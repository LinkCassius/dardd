import React, { useState } from "react";
import Button from "../../components/CustomButtons/Button.js";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

function RetentionReportFilters(props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isCollapsed, setIsCollapsed] = useState(false); // Track collapsed state

  const handleRefresh = () => {
    setStartDate(null);
    setEndDate(null);
    props.handleRefresh();
  };
  const handleStartDateChange = (date) => {
    //console.log("Start date : ", date);
    const updatedDate = new Date(date);
    updatedDate.setHours(0, 0, 0, 0); // Set the time to midnight
    setStartDate(updatedDate);
  };
  const handleEndDateChange = (date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(0, 0, 0, 0); // Set the time to midnight
    setEndDate(updatedDate);
  };
  return (
    <React.Fragment>
      <div
        style={{
          padding: "15px 5px 5px 10px",
          width: "100%",
        }}
      > 
        <fieldset className="scheduler-border">
        <legend className="scheduler-border" style={{ display: "flex", alignItems: "center" }}>
            Filters
            <Button
              color="primary"
              style={{ marginLeft: "10px", minWidth: "auto", padding: "6px" }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </Button>
          </legend>
            {!isCollapsed && (
          <div className="form-group row">
            <div className="col-sm-3">
             
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  disableToolbar
                  variant="inline"
                  inputVariant="outlined"
                  onChange={handleStartDateChange}
                  value={startDate}
                  label={startDate && "Start Date"}
                  format="dd / MM / yyyy"
                  //margin="normal" //field going little down
                  maxDate={new Date()}
                  placeholder={"Start Date"} //<--- you can also use placeholder
                  //emptyLabel="Start Date" //<--- custom placeholder when date is null
                  openTo="year"  // Open directly to year view for faster navigation
                  views={["year", "month", "date"]}  // Allow year, month, and day selection
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-sm-3">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  disableToolbar
                  variant="inline"
                  inputVariant="outlined"
                  onChange={handleEndDateChange}
                  value={endDate}
                  label={endDate && "End Date"}
                  format="dd / MM / yyyy"
                  //margin="normal"
                  maxDate={new Date()}
                  placeholder={"End Date"} //<--- you can also use placeholder
                  //emptyLabel="Start Date" //<--- custom placeholder when date is null
                  openTo="year"  // Open directly to year view for faster navigation
                  views={["year", "month", "date"]}  // Allow year, month, and day selection
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-sm-5">
              <div>
                <Button
                  color="primary"
                  onClick={() =>
                    props.getSearchData({
                      startDate,
                      endDate
                    })
                  }
                >
                  Get Retention Register
                </Button>
                <span>&nbsp;&nbsp;</span>
                <Button color="primary" onClick={handleRefresh} title="Refresh">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
         )}
        </fieldset>
      </div>
    </React.Fragment>
  );
}

export default RetentionReportFilters;
