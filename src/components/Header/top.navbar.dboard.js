import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
//import * as pace from "pace-js";
import auth from "./../../auth";
import logoPng from "./../../assets/images/logo.png";
//import authx from "../../services/authService";
import { generateNavigationItems } from "../../utils/authHelper";
//import routes from "../../routes";
import "pace-js/themes/blue/pace-theme-minimal.css";
import Autocomplete from "../../views/Contracts/Autocomplete.js";

const NavItem = (props) => {
  const pageURI = window.location.pathname + window.location.search;
  const liClassName = props.path === pageURI ? "nav-item active" : "nav-item";
  const aClassName = props.disabled ? "nav-link disabled" : "nav-link";
  return (
    <li className={liClassName}>
      <Link
        to={props.path}
        className={aClassName}
        style={{ color: "#fff", fontSize: 12 }}
      >
        <i className={props.icon}></i> <span>&nbsp;</span> {props.name}
        {props.path === pageURI ? (
          <span className="sr-only">(current)</span>
        ) : (
          ""
        )}
      </Link>
    </li>
  );
};

class NavDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isToggleOn: false,
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState((prevState) => ({
        isToggleOn: false,
      }));
    }
  }
  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  showDropdown(e) {
    e.preventDefault();
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }
  render() {
    const classDropdownMenu =
      "dropdown-menu" + (this.state.isToggleOn ? " show" : "");
    return (
      <div ref={this.setWrapperRef}>
        <ul id="ddl" title={this.props.title}>
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              style={{ color: "#fff", fontSize: 12 }}
              to="/"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={(e) => {
                this.showDropdown(e);
              }}
            >
              <i className={this.props.icon}></i> <span>&nbsp;</span>{" "}
              {this.props.name}
            </Link>
            <div className={classDropdownMenu} aria-labelledby="navbarDropdown">
              {this.props.children}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

class TopNavbarDboard extends Component {
  state = { user: {} };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
    // if (this.state.navigation.items.length === 0) {
    //   this.setState({ navigation: generateNavigationItems() });
    // }
  }

  loadingMain = () => {
    // pace.restart();
    return this.loading();
  };
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    const { user } = this.state;

    if (user === null) return <Redirect to="/" />;
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="navbar-brand">
          <Link to="/dashboard" className="navbar-brand">
            <img src={logoPng} alt="" />
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse bg-indigo"
          id="navbarSupportedContent"
        >
          <form className="form-inline my-2 my-lg-0 setsearchright">
            <div className="App">
              <Autocomplete
                suggestions={[
                  "White",
                  "Black",
                  "Green",
                  "Blue",
                  "Yellow",
                  "Red",
                ]}
              />
            </div>
          </form>

          <form className="form-inline my-2 my-lg-0 setlogoutright">
            <li class="nav-item">
              <a
                style={{
                  fontSize: 12,
                  color: "white",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
                href="/?activeIndex=0"
                className="nav-link"
                onClick={() => {
                  auth.logout(() => {
                    this.props.history.push("/?activeIndex=0");
                  });
                }}
                title="Logout"
              >
                <i className="icon-switch2"></i>
              </a>
            </li>
          </form>
        </div>
      </nav>
    );
  }
}
export default TopNavbarDboard;
