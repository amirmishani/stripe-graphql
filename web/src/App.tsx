import React from "react";
import { ProvideAuth } from "./hooks/useAuth";
import { Routes } from "./Routes";

export default function App() {
  return (
    <ProvideAuth>
      <Routes />
    </ProvideAuth>
  );
}
