import React from "react";

import { TextValidator } from "react-material-ui-form-validator";
import Autocomplete from "@material-ui/lab/Autocomplete";
class AutoCompleteDDL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titlevalue: "",
      titleinputvalue: "",
      ptitlevalue: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.titleName !== this.props.titleName) {
      let soption = this.props.options.find(
        (o) => o.nameIdentiyNumber === nextProps.titleName
      );
      this.setState({
        ptitlevalue: nextProps.titleName,
        titlevalue: soption,
      });
    }
  }

  render() {
    const { titlevalue } = this.state;
    const { options } = this.props;
    //console.log("options : ", options);
    //console.log("titlevalue : ", titlevalue);
    //console.log("ptitlevalue : ", this.state.ptitlevalue);
    //console.log("this.props.titleName : ", this.props.titleName);
    return (
      <Autocomplete
        {...this.props}
        value={titlevalue}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            this.props.getTitleName(newValue.nameIdentiyNumber);
            this.props.getTitleId(newValue._id);
            this.props.getFarmerById(newValue._id);
            this.setState({
              titlevalue: newValue,
              ptitlevalue: newValue.nameIdentiyNumber,
            });
          }
        }}
        id="controleditem"
        options={options}
        getOptionLabel={(option) => option && option.nameIdentiyNumber}
        getOptionSelected={(option, value) =>
          value.titleName === option.nameIdentiyNumber
        }
        renderInput={(params) => (
          <TextValidator
            {...params}
            {...this.props}
            helperText=" "
            label="Select Farmer*"
            validators={["required"]}
            name="titleinputValue"
            errorMessages={["Farmer is mandatory"]}
            value={titlevalue}
            variant="outlined"
          />
        )}
      />
    );
  }
}

export default AutoCompleteDDL;
