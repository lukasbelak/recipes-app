import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import './libraries/bootstrap/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import 'hover.css';
import Home from './containers/Home';
import Admin from './containers/Admin';
import LoginForm from './components/Login/LoginForm';
import ErrorPage from './containers/ErrorPage'; //

const App=()=> {

  return (
    <Router>
      <Switch>
        <Redirect exact from='/recipes-app' to='/login' />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/" exact component={Home} />
        <Route path="/error" exact component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
