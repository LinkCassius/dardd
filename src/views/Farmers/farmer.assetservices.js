import React, { Component } from "react";
import { ApiEndPoints, siteConfig, fileTypes } from "../../config";

import moment from "moment";

//import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";
//import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import FormControl from "@material-ui/core/FormControl";

import Checkbox from "@material-ui/core/Checkbox";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
//import Typography from "@material-ui/core/Typography";
//import MaterialTable from "material-table";
import {
  // CheckboxValidatorElement,
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import Button from "../../components/CustomButtons/Button.js";

import { NotificationManager } from "react-notifications";
import auth from "../../auth";
const imagePathUrl = siteConfig.imagesPath;
/*const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});
*/
const steps = [
  "Producer Personal Details",
  "Farm Production",
  "Assets & Services",
];
class FarmerAssetServices extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
    this.state = {
      tab: 0,
      responseError: "",
      cndlist: [],
      historyDates: [],
      history: "LATEST",
      banklist: [],
      bankbranchlist: [],
      activeStep: 2,
      FixedStructures: {},
      IrrigationSystems: {},
      WaterInfrastructure: {},
      MachineryVehicles: {},
      ImplementsEquipment: {},
      OtherAssets: {},
      GovtSupport: {},
      GovtSupportOtherField: false,
      OtherAssetsOtherField: false,
      ImplementsEquipmentOtherField: false,
      MachineryVehiclesOtherField: false,
      WaterInfrastructureOtherField: false,
      IrrigationSystemsOtherField: false,
      FixedStructuresOtherField: false,
      fixedStructureOther: "",
      irrigationSystemOther: "",
      waterInfrastructureOther: "",
      machineryVehicleOther: "",
      implementsEquipmentOther: "",
      otherAssetsOther: "",
      govtSupportOther: "",
      farmerId: "",
      preferredcommunication: "",
      annualTurnover: "",
      accessDipTank: false,
      dipTankValue: "",
      dipTankType: "",
      haveExtensionServices: "",
      extensionServiceType: "",
      haveVeterinaryServices: "",
      veterinaryServiceType: "",
      earlyWarningInfo: "",
      agriEconomicInfo: "",
      training: "",

      savedisabled: false,
      saveBtnVisible: true,
      nextBtnVisible: false,

      hasCropInsurance: "",
      insuranceCompanyName: "",
      insuranceType: "",
      bank: "",
      bankBranch: "",
      bankAccountNumber: "",
      bankAccountName: "",

      docCollection: "",
      file: null,
      supportingDoc: null,
      uploading: false,
      fileName: "",

      preferredcommunicationObj: {},
      annualTurnoverObj: {},
      preferredcommunicationName: "",
      annualTurnoverName: "",
      signature: "",
    };
  }
  handleChange = (event) => {
    //below condition added on 19-mar-2021 by sandesh for ddl names to state
    if (event.target.name === "preferredcommunication") {
      this.setState({
        preferredcommunicationName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "annualTurnover") {
      this.setState({
        annualTurnoverName: event._targetInst.pendingProps.data_id,
      });
    }

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeHistory = (event) => {
    this.getHistoryData(event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  bankChange = (event) => {
    this.getBankBranchList(event.target.value);

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleCheckChange = (name) => (event) => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  getCheckboxInitiatValuesByGroup(groupName) {
    var valuesObj = {};
    this.state.cndlist.map(function (data) {
      if (data.cndGroup === groupName) {
        valuesObj[data.cndName] = false;
      }
    });
    return valuesObj;
  }

  handleCheckboxChange(ObjectName, event) {
    var targetStateSet = ObjectName + "OtherField";
    this.setState({
      [targetStateSet]:
        event.target.name === "Other" && event.target.checked === true
          ? true
          : false,
    });

    let objectValues = {};
    if (
      this.state[ObjectName] === null ||
      Object.keys(this.state[ObjectName]).length === 0
    ) {
      objectValues = this.getCheckboxInitiatValuesByGroup(ObjectName);
    } else {
      objectValues = this.state[ObjectName];
    }

    objectValues[event.target.name] = event.target.checked;
    //console.log("objectValuesUpdates", objectValues);
    this.setState({
      [ObjectName]: objectValues,
    });

    //console.log("this.state", this.state);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;
    formpojo.docCollection = this.state.supportingDoc;

    formpojo.fixedStructures =
      Object.keys(formpojo.FixedStructures).length === 0
        ? this.getCheckboxInitiatValuesByGroup("FixedStructures")
        : this.state.FixedStructures;
    formpojo.irrigationSystems =
      Object.keys(formpojo.IrrigationSystems).length === 0
        ? this.getCheckboxInitiatValuesByGroup("IrrigationSystems")
        : this.state.IrrigationSystems;

    formpojo.waterInfrastructure =
      Object.keys(formpojo.WaterInfrastructure).length === 0
        ? this.getCheckboxInitiatValuesByGroup("WaterInfrastructure")
        : this.state.WaterInfrastructure;

    formpojo.machineryVehicles =
      Object.keys(formpojo.MachineryVehicles).length === 0
        ? this.getCheckboxInitiatValuesByGroup("MachineryVehicles")
        : this.state.MachineryVehicles;

    formpojo.implementsEquipment =
      Object.keys(formpojo.ImplementsEquipment).length === 0
        ? this.getCheckboxInitiatValuesByGroup("ImplementsEquipment")
        : this.state.ImplementsEquipment;

    formpojo.otherAssets =
      Object.keys(formpojo.OtherAssets).length === 0
        ? this.getCheckboxInitiatValuesByGroup("OtherAssets")
        : this.state.OtherAssets;
    //formpojo.otherAssetsOther = formpojo.otherAssetsOther;

    if (formpojo.GovtSupport === null) formpojo.GovtSupport = {};

    formpojo.govtSupport =
      Object.keys(formpojo.GovtSupport).length === 0
        ? this.getCheckboxInitiatValuesByGroup("GovtSupport")
        : this.state.GovtSupport;

    //formpojo.govtSupportOther = formpojo.govtSupportOther;

    formpojo.isAccessToDipTank =
      formpojo.accessDipTank && formpojo.accessDipTank === "Yes" ? true : false;
    //formpojo.dipTankValue = formpojo.dipTankValue;
    //formpojo.dipTankType = formpojo.dipTankType;

    formpojo.haveExtensionServices =
      formpojo.haveExtensionServices && formpojo.haveExtensionServices === "Yes"
        ? true
        : false;
    //formpojo.extensionServiceType = formpojo.extensionServiceType;

    formpojo.haveVeterinaryServices =
      formpojo.haveVeterinaryServices &&
      formpojo.haveVeterinaryServices === "Yes"
        ? true
        : false;
    //formpojo.veterinaryServiceType = formpojo.veterinaryServiceType;

    formpojo.earlyWarningInfo =
      formpojo.earlyWarningInfo && formpojo.earlyWarningInfo === "Yes"
        ? true
        : false;
    formpojo.agriEconomicInfo =
      formpojo.agriEconomicInfo && formpojo.agriEconomicInfo === "Yes"
        ? true
        : false;
    formpojo.training =
      formpojo.training && formpojo.training === "Yes" ? true : false;

    formpojo.annualTurnover =
      formpojo.annualTurnover === "" ? null : formpojo.annualTurnover;

    formpojo.preferredcommunication =
      formpojo.preferredcommunication === ""
        ? null
        : formpojo.preferredcommunication;

    formpojo.hasCropInsurance =
      formpojo.hasCropInsurance && formpojo.hasCropInsurance === "Yes"
        ? true
        : false;

    formpojo.bank = formpojo.bank === "" ? null : formpojo.bank;
    formpojo.bankBranch =
      formpojo.bankBranch === "" ? null : formpojo.bankBranch;

    formpojo.preferredcommunicationObj = {
      _id: formpojo.preferredcommunication,
      cndName: formpojo.preferredcommunicationName,
    };
    formpojo.annualTurnoverObj = {
      _id: formpojo.annualTurnover,
      cndName: formpojo.annualTurnoverName,
    };

    fetch(ApiEndPoints.farmerAssetsServices, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": auth.getJwt(),
      },
      body: JSON.stringify(formpojo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          NotificationManager.success(data.msg);
          this.props.history.push("/farmers-data");
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else {
          this.setState({ responseError: data.msg });
          this.setState({ savedisabled: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  getHistoryDates() {
    var farmerId = this.props.match.params.farmerId;
    if (farmerId) {
      fetch(ApiEndPoints.farmerAssetsHistory + "?farmerId=" + farmerId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            this.setState({ historyDates: data.result });
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch(console.log);
    }
  }

  getHistoryData(value) {
    console.log("history Id : ", value);
    if (value && value === "LATEST") {
      this.setState({ saveBtnVisible: true });
      //get farmer by id
      var farmerId = this.props.match.params.farmerId;
      if (farmerId) {
        fetch(ApiEndPoints.farmerAssetsList + "?farmerId=" + farmerId, {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.success === true && data.result.length > 0) {
              this.setState({ nextBtnVisible: true });
              //this.getBankBranchList(data.result[0].bank);

              this.setState({
                FixedStructures: data.result[0].fixedStructures,
                IrrigationSystems: data.result[0].irrigationSystems,
                WaterInfrastructure: data.result[0].waterInfrastructure,
                MachineryVehicles: data.result[0].machineryVehicles,
                ImplementsEquipment: data.result[0].implementsEquipment,
                OtherAssets: data.result[0].otherAssets,
                GovtSupport: data.result[0].govtSupport,
                GovtSupportOtherField:
                  data.result[0].govtSupportOther !== "" &&
                  data.result[0].govtSupportOther !== null
                    ? true
                    : false,
                OtherAssetsOtherField:
                  data.result[0].otherAssetsOther !== "" &&
                  data.result[0].otherAssetsOther !== null
                    ? true
                    : false,
                ImplementsEquipmentOtherField:
                  data.result[0].implementsEquipmentOther !== "" &&
                  data.result[0].implementsEquipmentOther !== null
                    ? true
                    : false,
                MachineryVehiclesOtherField:
                  data.result[0].machineryVehicleOther !== "" &&
                  data.result[0].machineryVehicleOther !== null
                    ? true
                    : false,
                WaterInfrastructureOtherField:
                  data.result[0].waterInfrastructureOther !== "" &&
                  data.result[0].waterInfrastructureOther !== null
                    ? true
                    : false,
                IrrigationSystemsOtherField:
                  data.result[0].irrigationSystemOther !== "" &&
                  data.result[0].irrigationSystemOther !== null
                    ? true
                    : false,
                FixedStructuresOtherField:
                  data.result[0].fixedStructureOther !== "" &&
                  data.result[0].fixedStructureOther !== null
                    ? true
                    : false,
                fixedStructureOther: data.result[0].fixedStructureOther,
                irrigationSystemOther: data.result[0].irrigationSystemOther,
                waterInfrastructureOther:
                  data.result[0].waterInfrastructureOther,
                machineryVehicleOther: data.result[0].machineryVehicleOther,
                implementsEquipmentOther:
                  data.result[0].implementsEquipmentOther,
                otherAssetsOther: data.result[0].otherAssetsOther,
                govtSupportOther: data.result[0].govtSupportOther,
                preferredcommunication: data.result[0].preferredcommunication,
                annualTurnover: data.result[0].annualTurnover,
                accessDipTank:
                  data.result[0].isAccessToDipTank === true ? "Yes" : "No",
                dipTankType: data.result[0].dipTankType,
                dipTankValue: data.result[0].dipTankValue,
                haveExtensionServices:
                  data.result[0].haveExtensionServices === true ? "Yes" : "No",
                extensionServiceType: data.result[0].extensionServiceType,
                haveVeterinaryServices:
                  data.result[0].haveVeterinaryServices === true ? "Yes" : "No",
                veterinaryServiceType: data.result[0].veterinaryServiceType,

                earlyWarningInfo:
                  data.result[0].earlyWarningInfo === true ? "Yes" : "No",

                agriEconomicInfo:
                  data.result[0].agriEconomicInfo === true ? "Yes" : "No",

                training: data.result[0].training === true ? "Yes" : "No",

                hasCropInsurance:
                  data.result[0].hasCropInsurance === true ? "Yes" : "No",
                insuranceCompanyName: data.result[0].insuranceCompanyName,
                insuranceType: data.result[0].insuranceType,
                bank: data.result[0].bank,
                bankBranch: data.result[0].bankBranch,
                bankAccountNumber: data.result[0].bankAccountNumber,
                bankAccountName: data.result[0].bankAccountName,
                supportingDoc: data.result[0].docCollection,

                preferredcommunicationName:
                  data.result[0].preferredcommunicationObj &&
                  data.result[0].preferredcommunicationObj !== null &&
                  data.result[0].preferredcommunicationObj !== undefined
                    ? data.result[0].preferredcommunicationObj.cndName
                    : "",
                annualTurnoverName:
                  data.result[0].annualTurnoverObj &&
                  data.result[0].annualTurnoverObj !== null &&
                  data.result[0].annualTurnoverObj !== undefined
                    ? data.result[0].annualTurnoverObj.cndName
                    : "",
                signature: data.result[0].signature,
              });
            } else if (
              data &&
              data.success === true &&
              data.result.length === 0
            ) {
              this.setState({ nextBtnVisible: false });
            } else if (
              data &&
              data.success === false &&
              data.responseCode === 401
            ) {
              NotificationManager.error(data.msg);
              localStorage.clear();
              return (window.location.href = "/");
            }
          })
          .catch(console.log);
      }
    } else if (value && value !== "LATEST") {
      this.setState({ saveBtnVisible: false });

      fetch(ApiEndPoints.farmerAssetsHistory + "?id=" + value, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data history : ", data);
          if (data && data.success === true && data.result.length > 0) {
            //this.getBankBranchList(data.result[0].bank);

            this.setState({
              FixedStructures: data.result[0].fixedStructures,
              IrrigationSystems: data.result[0].irrigationSystems,
              WaterInfrastructure: data.result[0].waterInfrastructure,
              MachineryVehicles: data.result[0].machineryVehicles,
              ImplementsEquipment: data.result[0].implementsEquipment,
              OtherAssets: data.result[0].otherAssets,
              GovtSupport: data.result[0].govtSupport,
              GovtSupportOtherField:
                data.result[0].govtSupportOther !== "" &&
                data.result[0].govtSupportOther !== null
                  ? true
                  : false,
              OtherAssetsOtherField:
                data.result[0].otherAssetsOther !== "" &&
                data.result[0].otherAssetsOther !== null
                  ? true
                  : false,
              ImplementsEquipmentOtherField:
                data.result[0].implementsEquipmentOther !== "" &&
                data.result[0].implementsEquipmentOther !== null
                  ? true
                  : false,
              MachineryVehiclesOtherField:
                data.result[0].machineryVehicleOther !== "" &&
                data.result[0].machineryVehicleOther !== null
                  ? true
                  : false,
              WaterInfrastructureOtherField:
                data.result[0].waterInfrastructureOther !== "" &&
                data.result[0].waterInfrastructureOther !== null
                  ? true
                  : false,
              IrrigationSystemsOtherField:
                data.result[0].irrigationSystemOther !== "" &&
                data.result[0].irrigationSystemOther !== null
                  ? true
                  : false,
              FixedStructuresOtherField:
                data.result[0].fixedStructureOther !== "" &&
                data.result[0].fixedStructureOther !== null
                  ? true
                  : false,
              fixedStructureOther: data.result[0].fixedStructureOther,
              irrigationSystemOther: data.result[0].irrigationSystemOther,
              waterInfrastructureOther: data.result[0].waterInfrastructureOther,
              machineryVehicleOther: data.result[0].machineryVehicleOther,
              implementsEquipmentOther: data.result[0].implementsEquipmentOther,
              otherAssetsOther: data.result[0].otherAssetsOther,
              govtSupportOther: data.result[0].govtSupportOther,
              preferredcommunication: data.result[0].preferredcommunication,
              annualTurnover: data.result[0].annualTurnover,
              accessDipTank:
                data.result[0].isAccessToDipTank === true ? "Yes" : "No",
              dipTankType: data.result[0].dipTankType,
              dipTankValue: data.result[0].dipTankValue,
              haveExtensionServices:
                data.result[0].haveExtensionServices === true ? "Yes" : "No",
              extensionServiceType: data.result[0].extensionServiceType,
              haveVeterinaryServices:
                data.result[0].haveVeterinaryServices === true ? "Yes" : "No",
              veterinaryServiceType: data.result[0].veterinaryServiceType,

              earlyWarningInfo:
                data.result[0].earlyWarningInfo === true ? "Yes" : "No",

              agriEconomicInfo:
                data.result[0].agriEconomicInfo === true ? "Yes" : "No",

              training: data.result[0].training === true ? "Yes" : "No",

              hasCropInsurance:
                data.result[0].hasCropInsurance === true ? "Yes" : "No",
              insuranceCompanyName: data.result[0].insuranceCompanyName,
              insuranceType: data.result[0].insuranceType,
              bank: data.result[0].bank,
              bankBranch: data.result[0].bankBranch,
              bankAccountNumber: data.result[0].bankAccountNumber,
              bankAccountName: data.result[0].bankAccountName,

              id: data.result[0].farmerId,
              supportingDoc: data.result[0].docCollection,

              preferredcommunicationName:
                data.result[0].preferredcommunicationObj &&
                data.result[0].preferredcommunicationObj !== null &&
                data.result[0].preferredcommunicationObj !== undefined
                  ? data.result[0].preferredcommunicationObj.cndName
                  : "",
              annualTurnoverName:
                data.result[0].annualTurnoverObj &&
                data.result[0].annualTurnoverObj !== null &&
                data.result[0].annualTurnoverObj !== undefined
                  ? data.result[0].annualTurnoverObj.cndName
                  : "",
              signature: data.result[0].signature,
            });
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch(console.log);
    }
  }

  getCndList() {
    fetch(ApiEndPoints.cndList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getBankList() {
    fetch(ApiEndPoints.bankList + "?parent=bank", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ banklist: data.result });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getBankBranchList(id) {
    fetch(ApiEndPoints.bankList + "?parent=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ bankbranchlist: data.result });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getHistoryDates();

    this.getCndList();
    //  this.getBankList();
    var farmerId = this.props.match.params.farmerId;
    this.setState({ farmerId: farmerId });

    if (farmerId) {
      fetch(ApiEndPoints.farmerAssetsList + "?farmerId=" + farmerId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true && data.result.length > 0) {
            this.setState({ nextBtnVisible: true });
            // this.getBankBranchList(data.result[0].bank);

            this.setState({
              FixedStructures: data.result[0].fixedStructures,
              IrrigationSystems: data.result[0].irrigationSystems,
              WaterInfrastructure: data.result[0].waterInfrastructure,
              MachineryVehicles: data.result[0].machineryVehicles,
              ImplementsEquipment: data.result[0].implementsEquipment,
              OtherAssets: data.result[0].otherAssets,
              GovtSupport: data.result[0].govtSupport,
              GovtSupportOtherField:
                data.result[0].govtSupportOther !== "" &&
                data.result[0].govtSupportOther !== null
                  ? true
                  : false,
              OtherAssetsOtherField:
                data.result[0].otherAssetsOther !== "" &&
                data.result[0].otherAssetsOther !== null
                  ? true
                  : false,
              ImplementsEquipmentOtherField:
                data.result[0].implementsEquipmentOther !== "" &&
                data.result[0].implementsEquipmentOther !== null
                  ? true
                  : false,
              MachineryVehiclesOtherField:
                data.result[0].machineryVehicleOther !== "" &&
                data.result[0].machineryVehicleOther !== null
                  ? true
                  : false,
              WaterInfrastructureOtherField:
                data.result[0].waterInfrastructureOther !== "" &&
                data.result[0].waterInfrastructureOther !== null
                  ? true
                  : false,
              IrrigationSystemsOtherField:
                data.result[0].irrigationSystemOther !== "" &&
                data.result[0].irrigationSystemOther !== null
                  ? true
                  : false,
              FixedStructuresOtherField:
                data.result[0].fixedStructureOther !== "" &&
                data.result[0].fixedStructureOther !== null
                  ? true
                  : false,
              fixedStructureOther: data.result[0].fixedStructureOther,
              irrigationSystemOther: data.result[0].irrigationSystemOther,
              waterInfrastructureOther: data.result[0].waterInfrastructureOther,
              machineryVehicleOther: data.result[0].machineryVehicleOther,
              implementsEquipmentOther: data.result[0].implementsEquipmentOther,
              otherAssetsOther: data.result[0].otherAssetsOther,
              govtSupportOther: data.result[0].govtSupportOther,
              preferredcommunication: data.result[0].preferredcommunication,
              annualTurnover: data.result[0].annualTurnover,
              accessDipTank:
                data.result[0].isAccessToDipTank === true ? "Yes" : "No",
              dipTankType: data.result[0].dipTankType,
              dipTankValue: data.result[0].dipTankValue,
              haveExtensionServices:
                data.result[0].haveExtensionServices === true ? "Yes" : "No",
              extensionServiceType: data.result[0].extensionServiceType,
              haveVeterinaryServices:
                data.result[0].haveVeterinaryServices === true ? "Yes" : "No",
              veterinaryServiceType: data.result[0].veterinaryServiceType,

              earlyWarningInfo:
                data.result[0].earlyWarningInfo === true ? "Yes" : "No",

              agriEconomicInfo:
                data.result[0].agriEconomicInfo === true ? "Yes" : "No",

              training: data.result[0].training === true ? "Yes" : "No",

              hasCropInsurance:
                data.result[0].hasCropInsurance === true ? "Yes" : "No",
              insuranceCompanyName: data.result[0].insuranceCompanyName,
              insuranceType: data.result[0].insuranceType,
              bank: data.result[0].bank,
              bankBranch: data.result[0].bankBranch,
              bankAccountNumber: data.result[0].bankAccountNumber,
              bankAccountName: data.result[0].bankAccountName,
              supportingDoc: data.result[0].docCollection,

              preferredcommunicationName:
                data.result[0].preferredcommunicationObj &&
                data.result[0].preferredcommunicationObj !== null &&
                data.result[0].preferredcommunicationObj !== undefined
                  ? data.result[0].preferredcommunicationObj.cndName
                  : "",
              annualTurnoverName:
                data.result[0].annualTurnoverObj &&
                data.result[0].annualTurnoverObj !== null &&
                data.result[0].annualTurnoverObj !== undefined
                  ? data.result[0].annualTurnoverObj.cndName
                  : "",
              signature: data.result[0].signature,
            });
          } else if (
            data &&
            data.success === true &&
            data.result.length === 0
          ) {
            this.setState({ nextBtnVisible: false });
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch(console.log);
    }
  }

  handlePrevious(event) {
    event.preventDefault();
    var farmerId = this.props.match.params.farmerId;
    if (farmerId) this.props.history.push("/farmer-production/" + farmerId);
  }

  onChange(e) {
    this.setState({
      uploading: true,
      fileName: e.target.files[0].name,
    });

    const url = ApiEndPoints.uploadfile;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    if (fileTypes.includes(e.target.files[0].type))
      fetch(url, {
        method: "POST",
        body: formData,
        "x-auth-token": auth.getJwt(),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res && res.success === true) {
            NotificationManager.success("File Uploaded Successfully");
            this.setState({
              uploading: false,
              supportingDoc: res.url,
            });
          } else if (res && res.success === false && res.responseCode === 401) {
            NotificationManager.error(res.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch((rejected) => {
          console.log("rejected", rejected);
          this.setState({
            uploading: false,
          });
        });
    else {
      this.setState({
        uploading: false,
      });
      NotificationManager.warning(
        "Accepts only PDF/Excel/Word/Excel/ JPEG/PNG/PPT/ZIP/Text"
      );
    }
  }

  removefile(e) {
    NotificationManager.success("File Removed Successfully");
    this.setState({
      supportingDoc: null,
    });
  }

  filterFromCnd(cndGroupName) {
    const { cndlist } = this.state;
    let filtervalues = cndlist
      .filter((data) => data.cndGroup === cndGroupName)
      .sort((a, b) => a.priority - b.priority);
    return filtervalues;
  }
  render() {
    console.log("Annual Turnover : ", this.state.annualTurnoverName);
    let fixedStructuresList = this.filterFromCnd("FixedStructures");
    let irrigationSystemsList = this.filterFromCnd("IrrigationSystems");
    let waterInfrastructureList = this.filterFromCnd("WaterInfrastructure");
    let machineryVehiclesList = this.filterFromCnd("MachineryVehicles");
    let implementsEquipmentList = this.filterFromCnd("ImplementsEquipment");
    let otherAssetsList = this.filterFromCnd("OtherAssets");
    let govtSupportList = this.filterFromCnd("GovtSupport");
    let annualTurnoverList = this.filterFromCnd("AnnualTurnover");
    let preferredCommunicationList = this.filterFromCnd(
      "PreferredCommunication"
    );
    let saveBtnStyle =
      this.state.saveBtnVisible === true
        ? { display: "block" }
        : { display: "none" };

    // let nextBtnStyle =
    //   this.state.nextBtnVisible === true
    //     ? { display: "block" }
    //     : { display: "none" };

    return (
      <div className="card container py-3">
        <ValidatorForm
          ref="form"
          instantValidate
          //onError={errors => console.log(errors)}
          onSubmit={this.handleSubmit}
        >
          <div className="headerP">
            <span className="farmerTitle"> Farmer Asset Services</span>
          </div>

          <SelectValidator
            style={{ width: 200 }}
            label="History"
            //helperText="Enter your nationality*"
            variant="outlined"
            onChange={this.handleChangeHistory}
            name="history"
            value={this.state.history}
            className="select headerSelect"
          >
            <option className="custom-option" value="LATEST">
              LATEST
            </option>
            {this.state.historyDates.map((value, index) => {
              return (
                <option className="custom-option" key={index} value={value._id}>
                  {moment
                    .tz(value.createdDate, moment.tz.guess())
                    .format("DD/MM/YYYY H:mm")}
                  {/* {moment(value.createdDate).format("DD/MM/YYYY H:mm")} */}
                </option>
              );
            })}
          </SelectValidator>
        </ValidatorForm>

        <span className="error-msg">{this.state.responseError}</span>
        <Stepper activeStep={this.state.activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <ValidatorForm
          ref="form"
          instantValidate
          onError={(errors) => console.log(errors)}
          onSubmit={this.handleSubmit}
        >
          <div className="row">
            <div className="col-md-12 mx-auto">
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                3.1 Particulars of assets on the farm reported on
              </p>
              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Fixed Structures
                  </h6>

                  {fixedStructuresList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.FixedStructures[value.cndName] || false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "FixedStructures"
                          )}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.FixedStructuresOtherField &&
              this.state.FixedStructuresOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Fixed Structures(Other, Specify)"
                      onChange={this.handleChange}
                      name="fixedStructureOther"
                      value={this.state.fixedStructureOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Irrigation Systems
                  </h6>

                  {irrigationSystemsList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.IrrigationSystems[value.cndName] || false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "IrrigationSystems"
                          )}
                          value={value.cndName}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.IrrigationSystemsOtherField &&
              this.state.IrrigationSystemsOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Irrigation Systems(Other, Specify)"
                      onChange={this.handleChange}
                      name="irrigationSystemOther"
                      value={this.state.irrigationSystemOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Water Infrastructure
                  </h6>
                  {waterInfrastructureList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.WaterInfrastructure[value.cndName] ||
                            false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "WaterInfrastructure"
                          )}
                          value={value.cndName}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.WaterInfrastructureOtherField &&
              this.state.WaterInfrastructureOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Water Infrastructure(Other, Specify)"
                      onChange={this.handleChange}
                      name="waterInfrastructureOther"
                      value={this.state.waterInfrastructureOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Machinery/Vehicles
                  </h6>
                  {machineryVehiclesList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.MachineryVehicles[value.cndName] || false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "MachineryVehicles"
                          )}
                          value={value.cndName}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.MachineryVehiclesOtherField &&
              this.state.MachineryVehiclesOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Machinery/ Vehicles(Other, Specify)"
                      onChange={this.handleChange}
                      name="machineryVehicleOther"
                      value={this.state.machineryVehicleOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Implements/Equipment
                  </h6>
                  {implementsEquipmentList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.ImplementsEquipment[value.cndName] ||
                            false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "ImplementsEquipment"
                          )}
                          value={value.cndName}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.ImplementsEquipmentOtherField &&
              this.state.ImplementsEquipmentOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Implements/ Equipment(Other, Specify)"
                      onChange={this.handleChange}
                      name="implementsEquipmentOther"
                      value={this.state.implementsEquipmentOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Other Assets
                  </h6>
                  {otherAssetsList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.OtherAssets[value.cndName] || false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "OtherAssets"
                          )}
                          value={value.cndName}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.OtherAssetsOtherField &&
              this.state.OtherAssetsOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Other Assets(Other, Specify)"
                      onChange={this.handleChange}
                      name="otherAssetsOther"
                      value={this.state.otherAssetsOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <div className="form-group row">
                <div className="col-sm-4">
                  <h6>Do you have access to a dip tank elsewhere?</h6>
                  <RadioGroup
                    aria-label="accessDipTank"
                    name="accessDipTank"
                    value={this.state.accessDipTank}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-5">
                  <h6>If yes, which of the following?</h6>

                  <RadioGroup
                    aria-label="dipTankValue"
                    name="dipTankValue"
                    value={this.state.dipTankValue}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Communal/Public Dip Tank"
                      control={<Radio />}
                      label="Communal/Public Dip Tank"
                    />
                    <FormControlLabel
                      value="Private Dip Tank"
                      control={<Radio />}
                      label="Private Dip Tank"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <h6>Type of Dip Tank?</h6>
                  <RadioGroup
                    aria-label="dipTankType"
                    name="dipTankType"
                    value={this.state.dipTankType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Small Stock"
                      control={<Radio />}
                      label="Small Stock"
                    />
                    <FormControlLabel
                      value="Large Stock"
                      control={<Radio />}
                      label="Large Stock"
                    />
                  </RadioGroup>
                </div>
              </div>

              <hr />
              <div className="form-group row">
                <div className="col-sm-12">
                  <h6 style={{ textAlign: "left" }}>
                    Have you ever received any Government support?
                  </h6>
                  {govtSupportList.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            (this.state.GovtSupport &&
                              this.state.GovtSupport[value.cndName]) ||
                            false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "GovtSupport"
                          )}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.GovtSupportOtherField &&
              this.state.GovtSupportOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-4">
                    <TextValidator
                      variant="outlined"
                      label="Govt Support(Other, Specify)"
                      onChange={this.handleChange}
                      name="govtSupportOther"
                      value={this.state.govtSupportOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <hr />

              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                3.2 Type of Extension, Technical and Advisory Services
              </p>
              <div className="form-group row">
                <div className="col-sm-3">
                  <h6>Extension Services</h6>
                  <RadioGroup
                    aria-label="haveExtensionServices"
                    name="haveExtensionServices"
                    value={this.state.haveExtensionServices}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <h6>If yes, which do you use?</h6>
                  <RadioGroup
                    row
                    aria-label="extensionServiceType"
                    name="extensionServiceType"
                    value={this.state.extensionServiceType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="State"
                      control={<Radio />}
                      label="State"
                    />
                    <FormControlLabel
                      value="Private"
                      control={<Radio />}
                      label="Private"
                    />
                  </RadioGroup>
                </div>

                <div className="col-sm-3">
                  <h6>Veterinary Services</h6>
                  <RadioGroup
                    aria-label="haveVeterinaryServices"
                    name="haveVeterinaryServices"
                    value={this.state.haveVeterinaryServices}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <h6>If yes, which do you use?</h6>
                  <RadioGroup
                    aria-label="veterinaryServiceType"
                    name="veterinaryServiceType"
                    value={this.state.veterinaryServiceType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="State"
                      control={<Radio />}
                      label="State"
                    />
                    <FormControlLabel
                      value="Private"
                      control={<Radio />}
                      label="Private"
                    />
                  </RadioGroup>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-3">
                  <h6>Early-warning Information</h6>
                  <RadioGroup
                    aria-label="earlyWarningInfo"
                    name="earlyWarningInfo"
                    value={this.state.earlyWarningInfo}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <h6>Agricultural Economic Information</h6>
                  <RadioGroup
                    aria-label="agriEconomicInfo"
                    name="agriEconomicInfo"
                    value={this.state.agriEconomicInfo}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <h6>Training</h6>
                  <RadioGroup
                    aria-label="training"
                    name="training"
                    value={this.state.training}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
              </div>
              <hr />
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Section 4 <br />
                4.1 - Annual Turnover (Last 3 financial years) and Insurance
                Details
              </p>
              <div className="form-group row">
                <div className="col-sm-4">
                  <SelectValidator
                    label=" "
                    helperText="Select Annual Turnover"
                    single="false"
                    onChange={this.handleChange}
                    name="annualTurnover"
                    /*validators={["required"]}
                            errorMessages={[
                              "Please select Primary Agro activities"
                            ]}*/
                    value={this.state.annualTurnover}
                  >
                    {annualTurnoverList.map((value, index) => {
                      return (
                        <option
                          key={index}
                          className="custom-option"
                          value={value._id}
                          data_id={value.cndName}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>

                <div className="col-sm-2">
                  <h6>Has Crop Insurance</h6>
                  <RadioGroup
                    aria-label="hasCropInsurance"
                    name="hasCropInsurance"
                    value={this.state.hasCropInsurance}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      //
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Insurance Company Name"
                    onChange={this.handleChange}
                    name="insuranceCompanyName"
                    value={this.state.insuranceCompanyName}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Insurance Type"
                    onChange={this.handleChange}
                    name="insuranceType"
                    value={this.state.insuranceType}
                  />
                </div>
              </div>
              {/* <hr />
              <div className="form-group row">
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Bank Account Number"
                    onChange={this.handleChange}
                    name="bankAccountNumber"
                    value={this.state.bankAccountNumber}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Bank Account Name"
                    onChange={this.handleChange}
                    name="bankAccountName"
                    value={this.state.bankAccountName}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    label="Select Bank Name"
                    single="false"
                    onChange={this.bankChange}
                    name="bank"
                    value={this.state.bank}
                    helperText=" "
                    variant="outlined"
                  >
                    {this.state.banklist.map((value, index) => {
                      return (
                        <option className="custom-option" value={value._id}>
                          {value.name}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>

                <div className="col-sm-3">
                  <SelectValidator
                    label="Select Branch Name"
                    single="false"
                    onChange={this.handleChange}
                    name="bankBranch"
                    value={this.state.bankBranch}
                    helperText=" "
                    variant="outlined"
                  >
                    {this.state.bankbranchlist.map((value, index) => {
                      return (
                        <option className="custom-option" value={value._id}>
                          {value.name}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
              </div> */}

              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                4.2 Preferred communication with the farmer in future
              </p>
              <div className="form-group row">
                <div className="col-sm-4">
                  <SelectValidator
                    label=" "
                    helperText="Select Preferred communication"
                    onChange={this.handleChange}
                    name="preferredcommunication"
                    /*validators={["required"]}
                            errorMessages={[
                              "Please select Preferred communication"
                            ]}*/
                    value={this.state.preferredcommunication}
                  >
                    {preferredCommunicationList.map((value, index) => {
                      return (
                        <option
                          key={index}
                          className="custom-option"
                          value={value._id}
                          data_id={value.cndName}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
              </div>
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Upload Farmer ID
              </p>
              <div className="col-sm-8" style={{ textAlign: "left" }}>
                <FormGroup>
                  {this.state.supportingDoc ? (
                    <span>
                      <a
                        target="_blank"
                        href={
                          siteConfig.imagesPath +
                          this.state.supportingDoc +
                          "?token=" +
                          localStorage.getItem("uploadToken")
                        }
                      >
                        <i
                          style={{
                            fontSize: "25px",
                          }}
                          className="fa fa-file"
                        ></i>
                      </a>
                      <span>&nbsp;&nbsp;</span>
                      {this.state.supportingDoc}
                      <span>&nbsp;&nbsp;</span>

                      <i
                        style={{
                          textAlign: "left",
                        }}
                        className="fa fa-remove"
                        onClick={this.removefile}
                      ></i>
                    </span>
                  ) : (
                    <TextValidator
                      variant="outlined"
                      helperText=" "
                      onChange={this.onChange}
                      name="file"
                      type="file"
                      value={this.state.file}
                      // validators={["required"]}
                      errorMessages={["File is mandatory"]}
                    />
                  )}

                  {this.state.uploading === true ? (
                    <i className="fa fa-circle-o-notch fa-spin"></i>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <hr />
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Farmer Signature
              </p>
              <div className="form-group row">
                <div className="col-sm-6">
                  <FormGroup>
                    {this.state.signature === "" ? (
                      <img
                        alt=""
                        src={
                          imagePathUrl +
                          "NoSignGeneral.png" +
                          "?token=" +
                          localStorage.getItem("uploadToken")
                        }
                      />
                    ) : (
                      <img
                        alt=""
                        src={
                          imagePathUrl +
                          this.state.signature +
                          "?token=" +
                          localStorage.getItem("uploadToken")
                        }
                        width={"150px"}
                      />
                    )}
                    {/* // <img
                    //   src={
                    //     this.state.signature === ""
                    //       ? imagePathUrl +
                    //         "NoSignGeneral.png" +
                    //         "?token=" +
                    //         localStorage.getItem("uploadToken")
                    //       : imagePathUrl +
                    //         this.state.signature +
                    //         "?token=" +
                    //         localStorage.getItem("uploadToken")
                    //   }
                    // /> */}
                  </FormGroup>
                </div>
              </div>
              <div style={{ textAlign: "right", float: "right" }}>
                <Button
                  color="primary"
                  onClick={this.handlePrevious.bind(this)}
                  className="farmerButtons"
                >
                  Previous
                </Button>

                <Button
                  color="primary"
                  type="submit"
                  disabled={this.state.savedisabled}
                  style={saveBtnStyle}
                  className="farmerButtons"
                >
                  {this.state.savedisabled ? "Please wait..." : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </div>
    );
  }
}

export default FarmerAssetServices;
