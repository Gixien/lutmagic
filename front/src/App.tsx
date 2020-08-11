import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from './Views/Home';

const App = () => (
  <Switch>
    <Route exact path="/martin" component={Home} />
  </Switch>
);

export default withRouter(App);
