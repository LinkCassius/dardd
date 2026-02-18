import React from "react";
/*import logo from "./../../images/tdap.svg";
import auth from "./../../auth";
import logoPng from "./../../assets/images/logo.png";*/
const Footer = (props) => {
  return (
    <div className="navbar navbar-expand-lg navbar-light">
      <div className="text-center d-lg-none w-100">
        <button
          type="button"
          className="navbar-toggler dropdown-toggle"
          data-toggle="collapse"
          data-target="#navbar-footer"
        >
          <i className="icon-unfold mr-2" />
          Footer
        </button>
      </div>
      <div className="navbar-collapse collapse" id="navbar-footer">
        <span className="navbar-text" style={{ paddingLeft: 90 }}>
          © {new Date().getFullYear()}
          <a target="/blank" href="https://technobraingroup.com">
            Techno Brain Group
          </a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
