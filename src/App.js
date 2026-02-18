import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component
import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
);

// Containers
const DefaultLayout = Loadable({
  loader: () => import("./containers/DefaultLayout"),
  loading,
});

// Pages
const Login = Loadable({
  loader: () => import("./views/Pages/Login"),
  loading,
});

const Page404 = Loadable({
  loader: () => import("./views/Pages/Page404"),
  loading,
});

const Page500 = Loadable({
  loader: () => import("./views/Pages/Page500"),
  loading,
});

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NotificationContainer />
        <HashRouter>
          <Switch>
            {/* Public Routes */}
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />

            {/* Private Routes - Only accessible if authenticated */}
            <PrivateRoute path="/" name="Home" component={DefaultLayout} />

            {/* Catch-all Redirect to 404 */}
            <Redirect to="/404" />
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default App;
