import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import Autocomplete from "@material-ui/lab/Autocomplete";
class IndicatorAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titlevalue: "",
      titleinputvalue: "",
      ptitlevalue: "",
      //  options: [""],
    };
  }
  //   async componentDidMount() {
  //     console.log("component did mount");
  //     await this.getIndicatorTitles();
  //   }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indicatorTitle !== this.props.indicatorTitle) {
      let soption = this.props.options.find(
        (o) => o.indicatorTitle === nextProps.indicatorTitle
      );
      this.setState({
        ptitlevalue: nextProps.indicatorTitle,
        titlevalue: soption,
      });
    }
  }
  //   shouldComponentUpdate(nextProps, nextState) {
  //     console.log("nextState", nextState);
  //     console.log("tstate", this.state.ptitlevalue);
  //     if (nextProps.indicatorTitle !== "") {
  //       return (
  //         nextState.ptitlevalue.length > this.state.ptitlevalue.length ||
  //         this.state.titlevalue !== ""
  //       );
  //     } else {
  //       return nextState.options.length > 0;
  //     }
  //   }

  sendindicatore = (option, value) => {
    console.log(option, value);
  };
  render() {
    const { titlevalue } = this.state;
    const { options } = this.props;

    return (
      <Autocomplete
        {...this.props}
        value={titlevalue}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            this.props.getIndicatorTitle(newValue.indicatorTitle);
            this.props.getIndicatorTitleDimensions(newValue.dimensions);
            this.setState({
              titlevalue: newValue,
              ptitlevalue: newValue.indicatorTitle,
            });
          }
        }}
        id="controleditem"
        options={options}
        getOptionLabel={(option) => option && option.indicatorTitle}
        getOptionSelected={(option, value) =>
          value.indicatorTitle === option.indicatorTitle
        }
        renderInput={(params) => (
          <TextValidator
            {...params}
            {...this.props}
            helperText=" "
            label="Indicator Title*"
            validators={["required"]}
            name="titleinputValue"
            errorMessages={["Indicator Title is mandatory"]}
            value={titlevalue}
            variant="outlined"
          />
        )}
      />
    );
  }
}

export default IndicatorAutocomplete;
