import React from "react";
import { useQuery } from "@apollo/client";
import { meQuery } from "../../graphql/queries";

export function Debug() {
  const { loading, error, data } = useQuery(meQuery);

  console.log(data);

  if (loading || error || !data) return null;

  return <div>Debug</div>;
}
