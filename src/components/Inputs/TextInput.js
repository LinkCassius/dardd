import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

const TextInput = (props) => {
  return (
    <TextValidator
      variant="outlined"
      label={props.label}
      helperText={props.helperText}
      onChange={props.onChange}
      name={props.name}
      validators={[props.validators]}
      errorMessages={[props.errorMessages]}
      value={props.value || ""}
    />
  );
};

export default TextInput;
