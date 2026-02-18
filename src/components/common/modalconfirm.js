import React from "react";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalPopup = ({
  modalflag,
  toggle,
  cancelToggle,
  onModalSubmit,
  deleteObject,
  modalBody
}) => {
  return (
    <React.Fragment>
      <Modal className="modal-danger" isOpen={modalflag} toggle={toggle}>
        <ModalHeader toggle={() => toggle()}>Delete Confirmation</ModalHeader>
        <ModalBody>Are you sure wish to delete {modalBody} ?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => onModalSubmit(deleteObject)}>
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={() => cancelToggle()}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};
ModalPopup.propTypes = {
  modalflag: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  cancelToggle: PropTypes.func.isRequired,
  onModalSubmit: PropTypes.func.isRequired,
  deleteObject: PropTypes.object,
  modalBody: PropTypes.string
};
export default ModalPopup;
