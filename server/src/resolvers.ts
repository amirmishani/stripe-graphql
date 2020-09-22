import { IResolvers } from "apollo-server-express";
import * as bcrypt from "bcryptjs";
import { stripe } from "./stripe";
import { User } from "./entity/User";

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }

      return User.findOne(req.session.userId);
    },
    getCard: async (_, __, { req }) => {
      let paymentMethod;

      if (!req.session.userId) {
        return null;
      }

      const user = await User.findOne(req.session.userId);
      if (!user || !user.paymentId) {
        return null;
      }

      try {
        paymentMethod = await stripe.paymentMethods.retrieve(user.paymentId);
      } catch (error) {
        throw new Error(error.message);
      }

      if (paymentMethod && paymentMethod.card && paymentMethod.card.last4) {
        const { brand, exp_month, exp_year, last4 } = paymentMethod.card;

        return {
          brand,
          exp_month,
          exp_year,
          last4,
        };
      }

      return null;
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
      }).save();

      return true;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
    logout: async (_, __, { req }) => {
      try {
        req.session.destroy();
      } catch (error) {
        throw new Error(error.message);
      }

      return true;
    },
    createSubscription: async (_, { paymentId }, { req }) => {
      let user, customer, customerId;

      // check if authenticated
      if (!req.session || !req.session.userId) {
        throw new Error("Unauthorized");
      }

      // find authenticated user
      user = await User.findOne(req.session.userId);
      if (!user) {
        throw new Error("User not found");
      }

      customerId = user.customerId;

      if (!customerId) {
        // create a first time customer customer
        try {
          customer = await stripe.customers.create({
            email: user.email,
            payment_method: paymentId,
            invoice_settings: {
              default_payment_method: paymentId,
            },
          });

          customerId = customer.id;
        } catch (error) {
          throw new Error(error.message);
        }
      }

      // attach payment to returning customer & update default payment method
      if (user.customerId && !user.paymentId) {
        try {
          const paymentMethod = await stripe.paymentMethods.attach(paymentId, {
            customer: user.customerId,
          });
          await stripe.customers.update(user.customerId, {
            invoice_settings: {
              default_payment_method: paymentMethod.id,
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }

      // update user with subscription
      if (customerId) {
        user.customerId = customerId;
        user.paymentId = paymentId;
        user.plan = "premium-plan";

        // subscribe user
        try {
          await stripe.subscriptions.create({
            customer: customerId,
            items: [
              {
                price: process.env.STRIPE_PRICE_ID,
              },
            ],
          });
        } catch (error) {
          throw new Error(error.message);
        }

        // save user
        try {
          await user.save();
        } catch (error) {
          throw new Error("User not saved");
        }
      }

      return user;
    },
    updatePayment: async (_, { paymentId }, { req }) => {
      let customer, paymentMethod;

      // check if authenticated
      if (!req.session || !req.session.userId) {
        throw new Error("Unauthorized");
      }

      // find authenticated user
      const user = await User.findOne(req.session.userId);

      if (!user) {
        throw new Error("User not found");
      }
      if (!user.customerId) {
        throw new Error("Customer ID not found");
      }

      // attach payment to customer
      try {
        paymentMethod = await stripe.paymentMethods.attach(paymentId, {
          customer: user.customerId,
        });
      } catch (error) {
        throw new Error(error.message);
      }

      // update customer default payment
      if (paymentMethod.id) {
        try {
          customer = await stripe.customers.update(user.customerId, {
            invoice_settings: {
              default_payment_method: paymentMethod.id,
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }

      // detach previous payment
      if (user.paymentId) {
        try {
          await stripe.paymentMethods.detach(user.paymentId);
        } catch (error) {
          throw new Error(error.message);
        }
      }

      // save user
      if (customer && paymentMethod && paymentMethod.id) {
        user.paymentId = paymentMethod.id;

        try {
          await user.save();
        } catch (error) {
          throw new Error("User not saved");
        }
      }

      return user;
    },
    cancelSubscription: async (_, __, { req }) => {
      let customer: any;

      // check if authenticated
      if (!req.session || !req.session.userId) {
        throw new Error("Unauthorized");
      }

      // find authenticated user
      const user = await User.findOne(req.session.userId);

      if (!user) {
        throw new Error("User not found");
      }
      if (!user.customerId) {
        throw new Error("Customer ID not found");
      }

      try {
        // get stripe customer
        customer = await stripe.customers.retrieve(user.customerId);

        // grab first and only subscription
        const [subscription] = customer.subscriptions.data;

        // delete subscription
        await stripe.subscriptions.del(subscription.id);

        // remove payment method used for subscription
        if (user.paymentId) {
          await stripe.paymentMethods.detach(user.paymentId);
        }

        user.paymentId = null;
        user.plan = "free-trial";
        user.save();
      } catch (error) {
        throw new Error(error.message);
      }

      return user;
    },
  },
};
