import React from 'react';
import { useAuth } from '../../services/auth';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
} from "react-router-dom";
import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import Profile from '../Profile/Profile';
import Communities from '../Communities/Communities';
import Home from '../Home/Home';

export default function Routes(){
    return(
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <PrivateRoute path="/profile">
                  <h3>Profile page</h3>
                  <NavLink to="/" text="Home" />
                  <Profile />
                  <i>This is private content</i>
                </PrivateRoute>
                <PrivateRoute path="/communities">
                  <Communities />
                  <NavLink to="/home" text="home" />
                </PrivateRoute>
                <PrivateRoute path="/">
                  <Home />
                  <NavLink to="/communities" text="Communities" />
                </PrivateRoute>
            </Switch>
            <Logout/>
        </Router>
    )
}

function NavLink({to, text}){
  return(
    <div style={{position: "absolute", top: "20px", right: "140px"}}>
      <Link to={to}>{text}</Link>
    </div>
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