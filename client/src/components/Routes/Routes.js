import React from 'react';
import { useAuth } from '../../hooks/auth';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import Home from '../Home/Home';
import TopBar from '../TopBar/TopBar';

export default function Routes(){
    return(
      <Router>
          <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
            <PrivateRoute path="/">
              <TopBar />
              <Home />
            </PrivateRoute>
          </Switch>
      </Router>
    )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.isUserAuthenticated() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }