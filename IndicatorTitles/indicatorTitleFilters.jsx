import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { ApiEndPoints } from "../../config";
import DropdownTreeSelect from "react-dropdown-tree-select";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";

class IndicatorTitleFilters extends Component {
  constructor(props) {
    super(props);
    this.getDimenstionsList = this.getDimenstionsList.bind(this);
    this.state = {
      responseError: "",

      dimenstionlist: [],

      dimensions: [],
      Pid: "",
      loading: false,
      filtersFlag: false,
      reviewType: "self",
    };
  }

  assignChildren(objChild, userDimensions) {
    const childarray = [];
    objChild.map((value, index) => {
      value.id = value._id;
      if (value.children.length > 0) {
        value.children = this.assignChildren(value.children);
      }
      if (userDimensions.indexOf(value._id) >= 0) childarray.push(value);
    });

    return childarray;
  }
  getDimenstionsList = async () => {
    await fetch(ApiEndPoints.programList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ dimenstionlist: data.result });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  };
  refreshScreen = () => {
    this.props.refreshScreen();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.dimenstionlist !== this.props.dimenstionlist) {
      this.setState({ dimenstionlist: nextProps.dimenstionlist });
    }
  }
  getdimlist() {
    this.setState({ dimensionlist: this.props.dimenstionlist });
  }

  checktreenodes = (list, checkedflag) => {
    list.map((value) => {
      value.checked = checkedflag;
      value.expanded = checkedflag;
      if (value.children.length > 0) {
        value.children.map((child) => {
          var childList = [];
          childList.push(child);
          childList = this.checktreenodes(childList, checkedflag);

          child = childList[0];
        });
      }
    });
    return list;
  };
  changeTreeState = (list, currentNode) => {
    list.map((value) => {
      if (value.id == currentNode.id) {
        const boolflag = currentNode.checked;
        value.checked = boolflag;
        value.expanded = boolflag;
        if (value.children.length > 0) {
          value.children.map((child) => {
            var childList = [];
            childList.push(child);
            childList = this.checktreenodes(childList, boolflag);
            child = childList[0];
          });
        }
        return list;
      } else {
        if (value.children.length > 0) {
          value.children.map((child) => {
            var childList = [];
            childList.push(child);
            childList = this.changeTreeState(childList, currentNode);
            if (child.id == currentNode.id) {
              value.expanded = true;
            }

            child = childList[0];
          });
        }
      }
    });
    return list;
  };
  onTreeChange = (currentNode, selectedNodes) => {
    const list = this.changeTreeState(this.state.dimenstionlist, currentNode);
    const dlist = [...this.state.dimensions];
    if (currentNode.checked) {
      dlist.push(currentNode.id);
      if (currentNode.parent != null) {
        // dlist.push(currentNode.parent);
      }
      this.setState({ dimensions: dlist });
    } else {
      if (currentNode.parent != null) {
        var index2 = dlist.indexOf(currentNode.parent);
        if (index2 !== -1) {
          dlist.splice(index2, 1);
        }
      }
      var index = dlist.indexOf(currentNode.id);

      if (index !== -1) {
        dlist.splice(index, 1);
      }
    }
    const uniqueIds = dlist.filter(
      (val, id, array) => array.indexOf(val) == id
    );

    this.setState({
      dimenstionlist: list,
      dimensions: uniqueIds,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    //state changing logic here
  };
  radioOnChange = (event) => {
    {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
    this.props.radioOnChildChange(
      this.state.reportingCycle,
      this.state.dimenstionlist,
      this.state.selectedDate,
      this.state.dimensions,
      event.target.value
    );
  };
  render() {
    const { dimenstionlist, dimensions } = this.state;
    return (
      <GridContainer>
        <span className="error-msg">{this.state.responseError}</span>

        <ValidatorForm
          ref="form"
          onError={(errors) => console.log(errors)}
          style={{
            padding: "15px 5px 0px 15px",
            width: "100%",
          }}
          onSubmit={this.handleSubmit}
        >
          <fieldset className="scheduler-border" style={{ width: "99%" }}>
            <legend className="scheduler-border">Filters</legend>
            <div className="form-group row">
              <div className="col-sm-3" style={{ textAlign: "left" }}>
                <DropdownTreeSelect
                  data={dimenstionlist}
                  className="mdl-demo customPos"
                  texts={{ placeholder: "Programs/SubPrograms" }}
                  onChange={this.onTreeChange}
                  keepTreeOnSearch
                />
              </div>
              <div className="col-half-offset">
                <div className="text-center">
                  <Button
                    color="primary"
                    onClick={() =>
                      this.props.getIndicators(10, 1, "", dimensions)
                    }
                  >
                    Get Indicators Titles
                  </Button>
                  <span>&nbsp;&nbsp;</span>
                  <Button color="primary" onClick={this.props.refreshScreen}>
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </fieldset>
        </ValidatorForm>
      </GridContainer>
    );
  }
}
const styles = createStyles((theme) => ({
  dayWrapper: {
    position: "relative",
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  },
  customDayHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main} `,
    borderRadius: "50%",
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: "#676767",
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: "highlight",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  },
  endHighlight: {
    extend: "highlight",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  },
}));
export default withStyles(styles)(IndicatorTitleFilters);
