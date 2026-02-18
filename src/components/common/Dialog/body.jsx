import React from "react";
import PropTypes from "prop-types";
import { ModalBody } from "reactstrap";

const Body = (props) => (
   <ModalBody>
       {props.children}
   </ModalBody>
)

Body.propTypes = {
    children: PropTypes.object.isRequired
}

export default Body;