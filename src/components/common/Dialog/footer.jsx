import React from "react";
import PropTypes from "prop-types";
import { ModalFooter } from "reactstrap";

const Footer = props => (
    <ModalFooter>
        {props.children}
    </ModalFooter>
)

Footer.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Footer;