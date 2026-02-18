import React from "react";
import PropTypes from "prop-types";

const Loader = ( { show } ) => (
   <div id="loader"></div>
)

Loader.propTypes = {
    show: PropTypes.bool.isRequired
}

Loader.defaultProps = {
    show: false
};

export default Loader;