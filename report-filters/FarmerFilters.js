import React, { useState, useEffect } from "react";
import Button from "../../components/CustomButtons/Button.js";
import FetchRequest from "../../components/Http/FetchRequest";
import { ApiEndPoints } from "../../config";
import auth from "../../auth";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const MaterialSelect = ({ name, label, options, error, onChange, ...rest }) => {
  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel id={name}>{label}</InputLabel>
        <Select
          labelId={name}
          id={name}
          name={name}
          {...rest}
          label={label}
          onChange={onChange}
        >
          {/* <option className="custom-option" value="-1">
            ALL
          </option> */}
          {options.map((option, i) => {
            return (
              <option className="custom-option" key={i} value={option._id}>
                {option.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

/*
const MaterialInput = ({ name, label, error, ...rest }) => {
  return (
    <div>
      <TextField
        variant="outlined"
        {...rest}
        id={name}
        name={name}
        placeholder={label}
      />
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};
*/
function FarmerFilters(props) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [municipalities, setMunicipalities] = useState([]);
  const [assignMunicipalities, setAssignMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const [users, setUsers] = useState([]);
  const [assignUsers, setAssignUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("");

  const getDistricts = async () => {
    const districtData = await FetchRequest({
      url: ApiEndPoints.cndList + "?cndGroup=District",
      method: "GET",
    });
    if (districtData && districtData.success === true) {
      const districtsArr = districtData.result.map((item) => {
        return {
          name: item.cndName,
          _id: item._id,
        };
      });

      setDistricts(districtsArr);
    }
  };

  const getMunicipalities = async () => {
    const municipalityData = await FetchRequest({
      url: ApiEndPoints.cndList + "?cndGroup=Municipality",
      method: "GET",
    });

    if (municipalityData && municipalityData.success === true) {
      const municipalitiesArr = municipalityData.result.map((item) => {
        return {
          name: item.cndName,
          _id: item._id,
          parent: item.parent?._id,
        };
      });

      setMunicipalities(municipalitiesArr);
      setAssignMunicipalities(municipalitiesArr);
    }
  };

  const getChildUsers = async () => {
    /*
    const childArray = JSON.parse(
      localStorage.getItem("userData").split(",")
    ).childArray;

    const loggedId = JSON.parse(
      localStorage.getItem("userData").split(",")
    )._id;
    childArray.push({ _id: loggedId });
    if (childArray.length) {
    */
    const userData = await FetchRequest({
      url: props.url,
      method: "POST",
      //body: { childArray },
    });

    if (userData && userData.success === true) {
      const usersArray = userData.result.map((item) => {
        return {
          name: item.firstName + " " + item.lastName,
          _id: item._id,
          district: item.metroDistrictObj?._id,
          municipality: item.municipalRegionObj?._id,
        };
      });
      usersArray.sort(auth.sortValues("name"));
      setUsers(usersArray);
      setAssignUsers(usersArray);
    }
    // } else {
    //   setUsers([]);
    //   setAssignUsers([]);
    // }

    //console.log("dis, mun : ", districts, municipalities);
  };

  const approvalStatusArr = [
    { _id: "Pending", name: "Pending" },
    { _id: "Approved", name: "Approved" },
    { _id: "Rejected", name: "Rejected" },
  ];

  useEffect(() => {
    Promise.all([getDistricts(), getMunicipalities(), getChildUsers()]);
  }, []);

  const onChange = (event) => {
    //district
    if (event.target.name === "selectedDistrict") {
      setSelectedDistrict(event.target.value);

      const filterMunicipalities = municipalities.filter(
        (item) => item.parent === event.target.value
      );

      setAssignMunicipalities(filterMunicipalities);

      const filterUsers = users.filter(
        (item) => item.district === event.target.value
      );

      setAssignUsers(filterUsers);
    }
    //municipality
    if (event.target.name === "selectedMunicipality") {
      setSelectedMunicipality(event.target.value);

      const filterUsers = users.filter(
        (item) => item.municipality === event.target.value
      );

      setAssignUsers(filterUsers);
    }
    //reporting user
    if (event.target.name === "selectedUser") {
      setSelectedUser(event.target.value);

      // const filterUsers = users.filter(
      //   (item) => item._id === event.target.value
      // );

      // setAssignUsers(filterUsers);
    }

    //approval status
    if (event.target.name === "approvalStatus") {
      setApprovalStatus(event.target.value);

      if (selectedMunicipality === "") {
        setAssignUsers(users);
      }
    }
  };

  const handleRefresh = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDistrict("");
    setSelectedMunicipality("");
    setSelectedUser("");
    setApprovalStatus("");
    setAssignUsers(users);

    props.handleRefresh();
  };
  const handleStartDateChange = (date) => {
    //console.log("Start date : ", date);

    setStartDate(
      date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
  };
  const handleEndDateChange = (date) => {
    //console.log("end date : ", date);
    setEndDate(
      date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
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
          <legend className="scheduler-border">Filters</legend>
          <div className="form-group row">
            <div className="col-sm-3">
              {/* <MaterialInput
                label="Start Date"
                onChange={onChange}
                name="startDate"
                type="date"
                value={startDate}
                helperText="Start Date"
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
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
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-sm-3">
              {/* <MaterialInput
                label={endDate && "End Date"}
                onChange={onChange}
                name="endDate"
                type="date"
                value={endDate}
                helperText="End Date"
              /> */}
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
                />
              </MuiPickersUtilsProvider>
            </div>

            <div className="col-sm-3">
              <MaterialSelect
                label="District"
                onChange={onChange}
                name="selectedDistrict"
                value={selectedDistrict}
                //helperText=" "
                options={districts}
              />
            </div>
            <div className="col-sm-3">
              <MaterialSelect
                label="Municipality"
                onChange={onChange}
                name="selectedMunicipality"
                value={selectedMunicipality}
                //helperText=" "
                options={assignMunicipalities}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-3">
              <MaterialSelect
                label="Reporting Users"
                onChange={onChange}
                name="selectedUser"
                value={selectedUser}
                options={assignUsers}
              />
            </div>
            <div className="col-sm-3">
              <MaterialSelect
                label="Approval Status"
                onChange={onChange}
                name="approvalStatus"
                value={approvalStatus}
                options={approvalStatusArr}
              />
            </div>
            <div className="col-sm-5">
              <div>
                <Button
                  color="primary"
                  onClick={() =>
                    props.getSearchData({
                      startDate,
                      endDate,
                      childArray: assignUsers,
                      selectedUser,
                      approvalStatus,
                    })
                  }
                >
                  Search
                </Button>
                <span>&nbsp;&nbsp;</span>
                <Button color="primary" onClick={handleRefresh} title="Refresh">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </React.Fragment>
  );
}

export default FarmerFilters;
