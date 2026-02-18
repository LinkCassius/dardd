import React from "react";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalPopup = ({
    modalflag,
    toggle,
    cancelToggle,
    onModalSubmit,
    modalBody
}) => {


    return (
        <React.Fragment>
            <Modal className="modal-danger" isOpen={modalflag} toggle={toggle} backdrop={"static"} external={<button className="cool-close-button" onClick={() => cancelToggle()}></button>}>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>{modalBody} ?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => onModalSubmit()}>
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
    modalBody: PropTypes.string
};
export default ModalPopup;
