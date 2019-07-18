import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Room from "./components/Room";

import "antd/dist/antd.css";
import "./App.css";

const Placeholder = () => <div>no page here</div>;

const App = () => (
  <Router>
    <Switch>
      <Route path="/room/:id" component={Room} />
      <Route component={Placeholder} />
    </Switch>
  </Router>
);

export default App;
