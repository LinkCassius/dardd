import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Media,
} from "reactstrap";
import { siteConfig } from "../../config";
import Button from "../CustomButtons/Button.js";

const imagePathUrl = siteConfig.widgetImagesPath;

const WidgetModal = (props) => {
  return (
    <Modal
      isOpen={props.widgetModal}
      toggle={props.toggle}
      //className={"clssName"}
    >
      <ModalHeader>Select Widget</ModalHeader>
      <ModalBody>
        {props.widgets.map(function (value) {
          return (
            <FormGroup check key={value._id}>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={props.onChange}
                  name="widgetCheck"
                  value={JSON.stringify(value)}
                  defaultChecked={value.select}
                />{" "}
                <Media
                  object
                  src={imagePathUrl + value.icon}
                  height="30"
                  width="30"
                  alt="Icon"
                />{" "}
                {value.name} ({value.type})<br />
                {value.description}
                <br />
              </Label>
            </FormGroup>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.onSubmit}>
          Save
        </Button>{" "}
        <Button color="warning" onClick={props.toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WidgetModal;
