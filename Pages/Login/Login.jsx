import React, { Component } from "react";

import { ApiEndPoints } from "../../../config";
import queryString from "query-string";
import auth from "../../../auth";

//import "./login.scss";
import "../../../css/main.css";
import "../../../css/util.css";
// import "../../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
// import "../../../vendor/bootstrap/css/bootstrap.min.css";
// import "../../../App.css";

const initState = {
  email: "",
  password: "",
  errorEmail: "",
  errorPassword: "",
  responseError: "",
  responseFError: "",
  responseSuccess: "",
  loginform: true,
  activeIndex: 0,

  loginDisable: false,
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    if (auth.isAuthenticated() === true) {
      if (Object.getOwnPropertyNames(values).length === 0) {
        this.props.history.push("/dashboard?activeIndex=0");
      } else {
        this.setState({
          activeIndex: isNaN(parseInt(values.activeIndex))
            ? 0
            : parseInt(values.activeIndex),
        });

        let pushx =
          "/dashboard?activeIndex=" + isNaN(parseInt(values.activeIndex))
            ? 0
            : parseInt(values.activeIndex);
        this.props.history.push(pushx);
      }
    } else {
      this.setState({
        activeIndex: isNaN(parseInt(values.activeIndex))
          ? 0
          : parseInt(values.activeIndex),
      });
      this.props.history.push(
        "?activeIndex=" + isNaN(parseInt(values.activeIndex))
          ? 0
          : parseInt(values.activeIndex)
      );
    }
  }

  handleFormChange = (event) => {
    event.preventDefault();
    this.setState({ loginform: !this.state.loginform });
    this.setState({ email: "", responseFError: "" });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleForgotPSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      fetch(ApiEndPoints.forgotPassword, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            this.setState({ responseSuccess: data.msg });
          } else {
            this.setState({ responseFError: data.msg });
          }
        })
        .catch("error", console.log);
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loginDisable: true });
    const isValid = this.validate();
    if (isValid) {
      fetch(ApiEndPoints.login, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            // );
            auth.login(() => {
              auth.setLocalStorageData(data.loginResult);
              // this.props.history.push(
              //   "/dashboard?activeIndex=" + this.state.activeIndex
              // );
              const { state } = this.props.location;
              window.location = state ? state.from.pathname : "/";
            });
            this.setState(initState);
          } else {
            this.setState({ responseError: data.msg, loginDisable: false });
          }
        })
        .catch("error", console.log);
    } else this.setState({ loginDisable: false });
  };

  validate = () => {
    let returnValue = true;
    let errorEmail = "";
    let errorPassword = "";
    if (!this.state.password) {
      errorPassword = "Please enter your password!";
    }
    if (!this.state.email) {
      errorEmail = "Please enter your email!";
      returnValue = false;
    } else if (!this.state.email.includes("@")) {
      errorEmail = "Please enter valid email";
      returnValue = false;
    }
    this.setState({ errorEmail });
    this.setState({ errorPassword });
    return returnValue;
  };

  render() {
    const { email, password, loginform } = this.state;

    return (
      <div className="App bodybg">
        <div className="limiter">
          <div className="container-login100">
            <div className="mainfixwidth whitebg" style={{ height: "590px" }}>
              <div className="width50 float-l">
                <div className="leftimages"></div>
                {loginform ? (
                  <div id="loginform">
                    <form
                      className="login100-form validate-form"
                      onSubmit={this.handleSubmit}
                    >
                      <span className="login100-form-title">Member Login</span>
                      <div className="text-center p-t-20 p-b-20"></div>
                      <div
                        className="wrap-input100 validate-input"
                        data-validate="Valid email is required: ex@abc.xyz"
                      >
                        <input
                          className="input100"
                          type="text"
                          name="email"
                          autoComplete="off"
                          value={email}
                          placeholder="Email"
                          onChange={this.handleChange}
                        />
                        <span className="error-msg">
                          {this.state.errorEmail}
                        </span>
                        <span className="focus-input100"></span>
                        <span className="symbol-input100">
                          <i
                            className="fa fa-envelope margin0"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div
                        className="wrap-input100 validate-input"
                        data-validate="Password is required"
                      >
                        <input
                          className="input100"
                          type="password"
                          name="password"
                          autoComplete="off"
                          value={password}
                          placeholder="Password"
                          onChange={this.handleChange}
                        />
                        <span className="error-msg">
                          {this.state.errorPassword}
                        </span>
                        <span className="focus-input100" />
                        <span className="symbol-input100">
                          <i
                            className="fa fa-lock margin0"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      {/* <div className="checkbox">
                    <label>
                      <input type="checkbox" />
                      <span className="checkbox-material">
                        <span className="check" />
                      </span>{" "}
                      Remember Me
                    </label>
                  </div> */}
                      <span className="error-msg">
                        {this.state.responseError}
                      </span>
                      <div className="container-login100-form-btn">
                        {!this.state.loginDisable ? (
                          <button
                            /* onClick={() => {
                          auth.login(() => {
                            this.props.history.push("/dashboard");
                          });
                        }}
                        */
                            className="login100-form-btn"
                          >
                            Login
                          </button>
                        ) : (
                          "Please wait.."
                        )}
                      </div>
                      <div className="text-right p-t-12">
                        <span className="txt1"> </span>
                        <a
                          className="txt2 menu_links"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleFormChange}
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div id="forgotpasswordform">
                    <form
                      className="login100-form validate-form"
                      onSubmit={this.handleForgotPSubmit}
                    >
                      <span className="login100-form-title">
                        Forgot Password
                      </span>
                      <div className="text-center p-t-20 p-b-20"></div>
                      <div
                        className="wrap-input100 validate-input"
                        data-validate="Valid email is required: ex@abc.xyz"
                      >
                        <input
                          id="email"
                          className="input100"
                          type="text"
                          name="email"
                          autoComplete="off"
                          value={email}
                          placeholder="Email"
                          onChange={this.handleChange}
                        />
                        <span className="error-msg">
                          {this.state.errorEmail}
                        </span>
                        <span className="focus-input100"></span>
                        <span className="symbol-input100">
                          <i
                            className="fa fa-envelope margin0"
                            aria-hidden="true"
                          />
                        </span>
                      </div>

                      <span className="error-msg">
                        {this.state.responseFError}
                      </span>
                      <span className="success-msg">
                        {this.state.responseSuccess}
                      </span>
                      <div className="container-login100-form-btn">
                        <button className="login100-form-btn">
                          Reset Password
                        </button>
                      </div>
                      <div className="text-right p-t-12">
                        <span className="txt1"> </span>
                        <a
                          className="txt2 menu_links"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleFormChange}
                        >
                          Back To Login
                        </a>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="rightimage float-r " />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
