import React, { Component } from "react";
/*import logo from "./../../images/tdap.svg";
import auth from "./../../auth";
import logoPng from "./../../assets/images/logo.png";*/
import { withRouter } from "react-router";
class PageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHeadertitle: "Dashboard"
    };
  }

  componentDidMount() {
    var pageHeadertitle = "Dashboard";
    if (this.props.location.pathname === "/farmers-data") {
      pageHeadertitle = "Farmers Management";
    }
    if (this.props.location.pathname === "/farmer-registration") {
      pageHeadertitle = "Farmer Registration";
    }
    if (this.props.location.pathname === "/contracts") {
      pageHeadertitle = "Contracts";
    }

    if (this.props.location.pathname === "/add-update-contract") {
      pageHeadertitle = "Add / Update Contract";
    }
    this.setState({ pageHeadertitle: pageHeadertitle });
  }

  render() {
    return (
      <div className="page-header page-header-light">
        <div className="page-header-content header-elements-md-inline">
          <div className="page-title d-flex text-white">
            <h4>
              <i className="icon-arrow-left52 mr-2 text-white" />
              <span className="text-white font-weight-semibold">
                Home {}
              </span> - {""}
              {this.state.pageHeadertitle}
            </h4>
            <a
              href="!#"
              className="header-elements-toggle text-default d-md-none"
            >
              <i className="icon-more" />
            </a>
          </div>
        </div>
        <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
          <div className="d-flex">
            <div className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                <i className="icon-home2 mr-2" /> Home
              </a>
              <span className="breadcrumb-item  active">
                {this.state.pageHeadertitle}
              </span>
            </div>
            <a
              href="!#"
              className="header-elements-toggle text-default d-md-none"
            >
              <i className="icon-more" />
            </a>
          </div>
          <div className="header-elements d-none"></div>
        </div>
      </div>
    );
  }
}

export default withRouter(PageHeader);
