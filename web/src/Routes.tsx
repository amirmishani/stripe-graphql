import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { NavbarView } from "./common/Navbar";
import { LoadingView } from "./common/LoadingView";
import { LoginView } from "./modules/user/LoginView";
import { RegisterView } from "./modules/user/RegisterView";
import { AccountView } from "./modules/account/AccountView";
import { Subscription } from "./modules/account/Subscription";
import { UpdateCard } from "./modules/account/UpdateCard";
import { HomeView } from "./modules/home/HomeView";

const ProtectedRoute = ({ component: Component, history, ...rest }: any) => {
  const { user, isLoaded } = useAuth();

  // need to make sure context is loaded before making decision
  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export function Routes() {
  return (
    <Router>
      <div className="site-wrapper">
        <NavbarView />
        <Switch>
          <Route path="/login" component={LoginView} />
          <Route path="/register" component={RegisterView} />
          <ProtectedRoute path="/account" component={AccountView} />
          <ProtectedRoute path="/subscribe" component={Subscription} />
          <ProtectedRoute path="/update" component={UpdateCard} />
          <Route path="/" component={HomeView} />
        </Switch>
      </div>
    </Router>
  );
}
