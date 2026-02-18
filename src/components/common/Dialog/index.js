import React from "react";
import PropTypes from "prop-types";
import { Modal, Spinner } from "reactstrap";

export { default as DialogHeader } from "./header";
export { default as DialogBody } from "./body";
export { default as DialogFooter } from "./footer";

const DialogWrapper = props => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.toggle}
    size={props.size}
    className={props.className}
    backdrop={props.backdrop}
  >
    {props.isLoading && (
      <div className="text-center">
        <Spinner type="grow" color="primary" />
      </div>
    )}
    {!props.isLoading && props.children}
  </Modal>
);

DialogWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["static"])])
};

DialogWrapper.defaultProps = {
  isLoading: false,
  size: "md",
  className: "",
  backdrop: "static"
};

export default DialogWrapper;
