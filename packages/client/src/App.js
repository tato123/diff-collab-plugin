import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Room from "./components/Room";
import Home from "./components/Home";
import AuthCallback from "./components/Auth/Callback";
import Auth from "./components/Auth";
import PrivateRoute from "./components/Auth/AuthRoute";

import "antd/dist/antd.css";
import "./App.css";

const App = () => (
  <Router>
    <Switch>
      <PrivateRoute path="/room/:id" component={Room} />
      <Route path="/callback" component={AuthCallback} />
      <Route path="/login" component={Auth} />
      <Route component={Home} />
    </Switch>
  </Router>
);

export default App;
