import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import 'hover.css';
import Home from './containers/Home';
import Admin from './containers/Admin';
import LoginForm from './components/LoginForm';

const App=()=> {

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginForm} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/home" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
