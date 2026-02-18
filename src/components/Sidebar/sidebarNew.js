import React, { Component } from "react";
import { Link } from "react-router-dom";
//import logo from "./../../images/tdap.svg";
import auth from "./../../auth";
// import face from "./../../assets/images/demo/users/face1.jpg";
//import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import { generateNavigationItems } from "../../utils/authHelper";
import { siteConfig } from "../../config";
import SideMenu from "react-sidemenu";

// import "./../../assets/js/app.js";
// import $ from "jquery";
import "./side-menu.css";

const imagePathUrl = siteConfig.userImagesPath;

//import ExpandMoreIcon from "@material-ui/core/icons/ExpandMore";
//var  = JSON.parse(localStorage.getItem(""));

class MainSidebarNew extends Component {
  state = { navigation: { items: [] }, user: {}, activeItem: "" };
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
  handleClick = (value) => {
    window.location.href = `${value}`;
    this.setState({ activeItem: value });
  };
  render() {
    return (
      <div className="sidebar sidebar-light sidebar-main sidebar-expand-md">
        {/* Sidebar mobile toggler */}
        <div className="sidebar-mobile-toggler text-center">
          <a href="!#" className="sidebar-mobile-main-toggle">
            <i className="icon-arrow-left8" />
          </a>
          <span className="font-weight-semibold">Navigation</span>
          <a href="!#" className="sidebar-mobile-expand">
            <i className="icon-screen-full" />
            <i className="icon-screen-normal" />
          </a>
        </div>
        {/* /sidebar mobile toggler */}
        {/* Sidebar content */}
        <div className="sidebar-content">
          {/* User menu */}
          <div className="sidebar-user-material">
            <div className="layoutbgset">
              <div className="card-body text-center no-border sidebar-user-material-body">
                <img
                  src={
                    localStorage.getItem("imageName") === ""
                      ? imagePathUrl + "default.png"
                      : imagePathUrl + localStorage.getItem("imageName")
                  }
                  className="img-fluid rounded-circle shadow-1 mb-3"
                  width={"80px"}
                  height={"80px"}
                  alt=""
                />

                <h6 className="mb-0 text-white text-shadow-dark">
                  <span style={{ textTransform: "capitalize" }}>
                    {localStorage.getItem("firstName")}
                    {"  "}
                    {localStorage.getItem("lastName")}
                  </span>
                </h6>
                <span className="font-size-sm text-white text-shadow-dark">
                  <b>Email</b> : {localStorage.getItem("email")}
                  {/* <br/> <b>Name</b> : {localStorage.getItem("userName")} */}
                </span>
              </div>
              <div className="sidebar-user-material-footer">
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    className="d-flex justify-content-between align-items-center text-shadow-dark dropdown-toggle"
                    data-toggle="collapse"
                  >
                    <Typography>
                      <span className="my-account">My account</span>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <div>
                        <ul className="nav nav-sidebar">
                          <li className="nav-item">
                            <Link to="/UserProfile" className="nav-link">
                              <i className="icon-user-plus" />
                              <span>My profile</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to="/ChangePassword" className="nav-link">
                              <i className="fa fa-key" />
                              <span>Change Password</span>
                            </Link>
                          </li>

                          <li
                            className="nav-item"
                            onClick={() => {
                              auth.logout(() => {
                                this.props.history.push("/?activeIndex=0");
                              });
                            }}
                          >
                            <a href="/?activeIndex=0" className="nav-link">
                              <i className="icon-switch2" />
                              <span>Logout</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </div>
          </div>
          {/* /user menu */}
          {/* Main navigation */}
          <div className="card card-sidebar-mobile">
            <ul className="nav nav-sidebar" data-nav-type="accordion">
              {/* Main */}

              <li>
                <SideMenu
                  activeItem={this.state.activeItem}
                  items={generateNavigationItems().items}
                  reverse={false}
                  onMenuItemClick={this.handleClick}
                />
              </li>
              {/*              
              {navigation.items.map((route, idx) => {
                const menu =
                  route.children !== undefined ? (
                    <li className="nav-item nav-item-submenu">
                      <a to="#" className="nav-link">
                        <i className="icon-stack" /> <span>{route.name}</span>
                      </a>
                      {route.children.map((child, index) => (
                        <ul
                          className="nav nav-group-sub"
                          data-submenu-title="Starter kit"
                        >
                          <li className="nav-item">
                            <Link
                              key={index}
                              to={child.url}
                              className="nav-link"
                            >
                              <i className={child.icon}></i> {child.name}
                            </Link>
                          </li>
                        </ul>
                      ))}
                    </li>
                  ) : (
                    <li className="nav-item" key={idx}>
                      <Link to={route.url} className="nav-link active">
                        <i className={route.icon} />
                        <span>{route.name}</span>
                      </Link>
                    </li>
                  );

                return menu;
              })} */}

              {/* /main */}
            </ul>
          </div>
          {/* /main navigation */}
        </div>
        {/* /sidebar content */}
      </div>
    );
  }
}

export default MainSidebarNew;
