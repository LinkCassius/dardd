import React from "react";
import { SelectValidator } from "react-material-ui-form-validator";

const SelectInput = (props) => {
  return (
    <SelectValidator
      variant="outlined"
      label={props.label}
      helperText={props.helperText}
      onChange={props.onChange}
      name={props.name}
      value={props.value || ""}
      className="select"
      {...props}
    >
      <option className="custom-option" key={-1} value={""}>
        {" "}
      </option>
      {props.data.map((value, index) => {
        return (
          <option
            className="custom-option"
            key={index}
            value={value._id}
            data_id={value.name}
          >
            {value.name}
          </option>
        );
      })}
    </SelectValidator>
  );
};

export default SelectInput;
