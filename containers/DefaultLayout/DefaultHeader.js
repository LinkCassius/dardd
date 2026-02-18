import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import DefaultHeaderDropdown from "./DefaultHeaderDropdown";
import logo from "../../assets/img/brand/logo.png";
import sygnet from "../../assets/img/brand/logo1.png";
import Autocomplete from "../../views/Contracts/Autocomplete.js";

// import sygnet from "../../assets/img/brand/sygnet.svg";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, alt: "dardlea Logo" }}
          minimized={{ src: sygnet, alt: "dardlea Logo" }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
          </NavItem>
        </Nav>
        <Nav className="d-md-down-none set-nav-width" navbar>
          <NavItem className="px-3">
            <form>
              <div>
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
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <DefaultHeaderDropdown notif onLogout={this.props.onLogout} />
          {/* <DefaultHeaderDropdown tasks />
          <DefaultHeaderDropdown mssgs />
          <NavItem className="d-md-down-none">
            <NavLink href="#">
              <i className="icon-location-pin" />
            </NavLink>
          </NavItem> 
          <DefaultHeaderDropdown onLogout={this.props.onLogout} accnt />*/}
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
