import React, { Component } from "react";
import Button from "../../../components/CustomButtons/Button.js";
import auth from "../../../auth";
import {
  ValidatorForm,
  SelectValidator,
  TextValidator,
} from "react-material-ui-form-validator";
class ContractReportFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseError: "",
      startDate: "",
      endDate: "",
      loading: false,
      cndlist: [],
      contractType: "",
      contractStatus: "",
      hasVariation: "",
    };
  }

  async componentDidMount() {}

  handleRefresh = () => {
    this.setState({
      contractType: "",
      contractStatus: "",
      startDate: "",
      endDate: "",
      hasVariation: "",
    });

    this.props.handleRefresh();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { cndlist } = this.props;

    let contractType = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractType")
      : [];
    let contractStatus = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractStatus")
      : [];
    contractType.sort(auth.sortValues("cndName"));
    contractStatus.sort(auth.sortValues("cndName"));
    return (
      <ValidatorForm
        ref="form"
        onError={(errors) => console.log(errors)}
        style={{
          padding: "15px 5px 5px 10px",
          width: "100%",
        }}
      >
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Report Filters</legend>
          <div className="form-group row">
            <div className="col-sm-3">
              <SelectValidator
                variant="outlined"
                label="Contract Type"
                onChange={this.handleChange}
                name="contractType"
                value={this.state.contractType}
                helperText=" "
              >
                {contractType.map((value, index) => {
                  return (
                    <option
                      className="custom-option"
                      key={index}
                      value={value._id}
                    >
                      {value.cndName}
                    </option>
                  );
                })}
              </SelectValidator>
            </div>
            <div className="col-sm-3">
              <SelectValidator
                variant="outlined"
                label="Contract Status"
                onChange={this.handleChange}
                name="contractStatus"
                value={this.state.contractStatus}
                helperText=" "
              >
                {contractStatus.map((value, index) => {
                  return (
                    <option
                      className="custom-option"
                      key={index}
                      value={value._id}
                    >
                      {value.cndName}
                    </option>
                  );
                })}
              </SelectValidator>
            </div>
            <div className="col-sm-3">
              <TextValidator
                variant="outlined"
                //label="Start Date"
                onChange={this.handleChange}
                name="startDate"
                type="date"
                value={this.state.startDate}
                helperText="Start Date"
              />
            </div>
            <div className="col-sm-3">
              <TextValidator
                variant="outlined"
                //label="End Date"
                onChange={this.handleChange}
                name="endDate"
                type="date"
                value={this.state.endDate}
                helperText="End Date"
              />
            </div>
            <div className="col-sm-3">
              <SelectValidator
                label="Contract has Variation"
                variant="outlined"
                helperText=" "
                onChange={this.handleChange}
                name="hasVariation"
                value={this.state.hasVariation}
              >
                <option className="custom-option" value="Yes">
                  Yes
                </option>
                <option className="custom-option" value="No">
                  No
                </option>
              </SelectValidator>
            </div>
            <div className="col-sm-5">
              <div>
                <Button
                  color="primary"
                  onClick={() =>
                    this.props.getSearchData(
                      this.state.contractType,
                      this.state.contractStatus,
                      this.state.startDate,
                      this.state.endDate,
                      this.state.hasVariation
                    )
                  }
                >
                  Search
                </Button>
                <span>&nbsp;&nbsp;</span>
                <Button
                  color="primary"
                  onClick={this.handleRefresh}
                  title="Refresh"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </fieldset>
      </ValidatorForm>
    );
  }
}
export default ContractReportFilters;
