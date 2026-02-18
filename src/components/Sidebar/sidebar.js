import React from "react";
/*import logo from "./../../images/tdap.svg";
import auth from "./../../auth";*/
const Sidebar = props => {
  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">
        <h1>TDAP</h1>
      </div>
      <div className="list-group list-group-flush">
        <a
          href="/dashboard"
          className="list-group-item list-group-item-action bg-light"
        >
          Dashboard
        </a>
        <a
          href="/farmer-registration"
          className="list-group-item list-group-item-action bg-light"
        >
          Register Farmer
        </a>
        <a
          href="/farmers-data"
          className="list-group-item list-group-item-action bg-light"
        >
          Farmers Data
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
