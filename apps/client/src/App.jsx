// App.js
import React from "react";
import Create from "./components/create/create";
import "./styles/App.scss";
import { Route } from "wouter";
import { GlobalContextProvider } from "./context/globalContext";
import Home from "./components/home/home";

function App() {
  return (
    <GlobalContextProvider>
      <div>
        <Route component={Create} path="/" />
        <Route component={Home} path="/home" />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
