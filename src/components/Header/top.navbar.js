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
        style={{ color: "#fff"}}
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
              style={{ color: "#fff", }}
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

class TopNavbar extends Component {
  state = { navigation: { items: [] }, user: {} };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
    if (this.state.navigation.items.length === 0) {
      this.setState({ navigation: generateNavigationItems() });
    }
  }

  loadingMain = () => {
    // pace.restart();
    return this.loading();
  };
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    const { user, navigation } = this.state;

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
          <form
            className="form-inline my-2 my-lg-0 "
            style={{ float: "left", width: "36%" }}
          >
            <div className="App positionabsolute">
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

          <ul className="navbar-nav mr-auto" style={{ width: "100%" }}>
            {navigation.items.map((route, idx) => {
              const menu =
                route.children !== undefined ? (
                  <NavDropdown key={idx} name={route.name} icon={route.icon}>
                    {route.children.map((child, index) => (
                      <Link
                        key={index}
                        to={child.url}
                        className="dropdown-item"
                        
                      >
                        <i className={child.icon}></i> {child.name}
                      </Link>
                    ))}
                  </NavDropdown>
                ) : (
                  <NavItem
                    key={idx}
                    path={route.url}
                    name={route.name}
                    icon={route.icon}
                  />
                );

              return menu;
            })}
          </ul>

          <form
            className="form-inline my-2 my-lg-0 "
            style={{ float: "left", width: "22%", paddingTop: "15px" }}
          >
            <NavDropdown
              icon={"fa fa-user-circle-o"}
              className="userli"
              title={user.firstName + " " + user.lastName + "\n" + user.email}
            >
              <Link
                className="dropdown-item"
                to="/UserProfile"
              >
                <i className="fa fa-address-book" aria-hidden="true"></i>
                User Profile
              </Link>
              <div className="dropdown-divider"></div>
              <Link
                className="dropdown-item"
                to="/ChangePassword"
              >
                <i className="fa fa-key" aria-hidden="true"></i>
                Change Password
              </Link>
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item"
                href="/?activeIndex=0"
                onClick={() => {
                  auth.logout(() => {
                    this.props.history.push("/?activeIndex=0");
                  });
                }}
              >
                <i className="icon-switch2" />
                Logout
              </a>
            </NavDropdown>
          </form>
        </div>
      </nav>
    );
  }
}
export default TopNavbar;

/* <a href="javascript:void(0)" className="dropbtn">
                      {route.name}
                    </a> */

/* {route.children.map((child, index) => (
                      <Link to={child.url} className="nav-link ">
                        <i className="icon-copy whitetexticon" />
                        <span className="whitetext" style={{ fontSize: 12 }}>
                          {child.name}
                        </span>
                      </Link>
                    ))} */
