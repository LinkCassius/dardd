import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import Autocomplete from "@material-ui/lab/Autocomplete";

class AutoCompleteDDL extends React.Component {
  render() {
    const {
      id,
      options,
      name,
      getOptionLabel,
      validators,
      errorMessages,
      label,
      placeholder,
      selectedText,
      groupBy,
      getOptionSelected,
    } = this.props;
    return (
      <Autocomplete
        {...this.props}
        value={selectedText}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            this.props.onAutoCompleteChange(newValue);
          }
        }}
        id={id}
        options={options}
        groupBy={groupBy}
        getOptionLabel={getOptionLabel}
        getOptionSelected={getOptionSelected}
        renderInput={(params) => (
          <TextValidator
            {...params}
            {...this.props}
            helperText=" "
            validators={validators}
            name={name}
            errorMessages={errorMessages}
            value={selectedText}
            label={label}
            placeholder={placeholder}
            variant="outlined"
          />
        )}
      />
    );
  }
}

export default AutoCompleteDDL;
