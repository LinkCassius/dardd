// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth'; // Import your auth utility

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.getCurrentUser() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
