import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Room from "./components/Room";
import Home from "./components/Home";

import { TwilioProvider } from "./hooks/useToken";

import "antd/dist/antd.css";
import "./App.css";

const App = () => (
  <TwilioProvider>
    <Router>
      <Switch>
        <Route path="/room/:id" component={Room} />
        <Route component={Home} />
      </Switch>
    </Router>
  </TwilioProvider>
);

export default App;
