import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>
          <a href="#" target="_blank">
            DARDLEA
          </a>{" "}
          &copy; 2025
        </span>
        <span className="ml-auto">
          Powered by{" "}
          <a href="http://www.technobraingroup.com/" target="_blank">
            Techno Brain Ltd
          </a>
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
