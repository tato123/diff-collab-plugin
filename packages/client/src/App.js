import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Room from "./components/Room";
import { TwilioProvider } from "./hooks/useToken";

import "antd/dist/antd.css";
import "./App.css";

const Placeholder = () => <div>no page here</div>;

const App = () => (
  <TwilioProvider>
    <Router>
      <Switch>
        <Route path="/room/:id" component={Room} />
        <Route component={Placeholder} />
      </Switch>
    </Router>
  </TwilioProvider>
);

export default App;
