import React, { Component } from "react";
import { ApiEndPoints } from "../../config";

import moment from "moment";

//import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import FormGroup from "@material-ui/core/FormGroup";
//import Typography from "@material-ui/core/Typography";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import Button from "../../components/CustomButtons/Button.js";

import { NotificationManager } from "react-notifications";
import auth from "../../auth";
//import FarmMap from "./FarmMap";
import LocationMap from "../../components/Map/locationMap";
import DialogWrapper from "../../components/common/Dialog";

/*const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});*/

const steps = [
  "Producer Personal Details",
  "Farm Production",
  "Assets & Services",
];
class FarmerProduction extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      tab: 1,
      responseError: "",
      cndlist: [],
      historyDates: [],
      history: "LATEST",
      activeStep: 1,
      //
      advancedAgroProcessing: {},
      Aquaculture: {},
      arableFarmsize: "",
      businessEntityType: "",
      farmMuncipalRegion: "",
      farmName: "",
      farmerId: "",
      FieldCrops: {},
      FieldCropProduction: {},
      Forestry: {},
      ForestryProduction: {},
      GameFarming: {},
      grazingFarmsize: "",
      Horticulture: {},
      HorticultureProduction: {},
      Livestock: {},
      //marketingChannelType: "",
      marketingChannelTypeFormal: false,
      marketingChannelTypeInformal: false,
      metroDistrict: "",
      nonarableFarmsize: "",
      portionName: "",
      portionNumber: "",
      practiseAgroProcessing: "No",
      practiseAgroProcessingManual: "No",
      primaryAgroProcessing: {},
      projectLegalEntityName: "",
      province: "",
      SeaFishing: {},
      secondaryAgroProcessing: {},
      Total: "",
      totalFarmSize: {},
      totalMembersInEnitity: "",
      townVillage: "",
      wardNumber: "",

      savedisabled: false,
      saveBtnVisible: true,
      nextBtnVisible: false,

      farmLatitude: "",
      farmLongitude: "",

      isOpen: false,

      LivestockOtherField: false,
      liveStockOther: "",
      HorticultureOtherField: false,
      horticultureOther: "",
      FieldCropsOtherField: false,
      fieldCropsOther: "",
      ForestryOtherField: false,
      forestryOther: "",
      AquacultureOtherField: false,
      aquacultureOther: "",
      GameFarmingOtherField: false,
      gameFarmingOther: "",
      SeaFishingOtherField: false,
      seaFishingOther: "",
      primaryAgroProcessingOtherField: false,
      primaryAgroProcessingOther: "",
      secondaryAgroProcessingField: false,
      secondaryAgroProcessingOther: "",
      advancedAgroProcessingOtherField: false,
      advancedAgroProcessingOther: "",

      farmMuncipalRegionObj: {},
      metroDistrictObj: {},
      provinceObj: {},
      businessEntityTypeObj: {},
      farmMuncipalRegionName: "",
      metroDistrictName: "",
      provinceName: "",
      businessEntityTypeName: "",
    };
  }
  handleChange = (event) => {
    // if (event.target.id.includes("Horticulture")) {
    //   const Horticulture = this.state.Horticulture;
    //   Horticulture[event.target.name] = event.target.value;
    // }
    // else if (event.target.id.includes("Prod")) {
    //   const HorticultureProduction = this.state.HorticultureProduction;
    //   HorticultureProduction[event.target.name] = event.target.value;
    // }

    if (event.target.name === "arableFarmsize") {
      const { nonarableFarmsize, grazingFarmsize } = this.state;

      this.setState({
        Total: (
          parseFloat(nonarableFarmsize === "" ? 0 : nonarableFarmsize) +
          parseFloat(grazingFarmsize === "" ? 0 : grazingFarmsize) +
          parseFloat(event.target.value === "" ? 0 : event.target.value)
        ).toFixed(2),
      });
    }
    if (event.target.name === "grazingFarmsize") {
      const { nonarableFarmsize, arableFarmsize } = this.state;

      this.setState({
        Total: (
          parseFloat(nonarableFarmsize === "" ? 0 : nonarableFarmsize) +
          parseFloat(arableFarmsize === "" ? 0 : arableFarmsize) +
          parseFloat(event.target.value === "" ? 0 : event.target.value)
        ).toFixed(2),
      });
    }
    if (event.target.name === "nonarableFarmsize") {
      const { grazingFarmsize, arableFarmsize } = this.state;

      this.setState({
        Total: (
          parseFloat(grazingFarmsize === "" ? 0 : grazingFarmsize) +
          parseFloat(arableFarmsize === "" ? 0 : arableFarmsize) +
          parseFloat(event.target.value === "" ? 0 : event.target.value)
        ).toFixed(2),
      });
    }

    //below condition added on 19-mar-2021 by sandesh for ddl names to state

    if (event.target.name === "farmMuncipalRegion") {
      this.setState({
        farmMuncipalRegionName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "metroDistrict") {
      this.setState({
        metroDistrictName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "province") {
      this.setState({
        provinceName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "businessEntityType") {
      this.setState({
        businessEntityTypeName: event._targetInst.pendingProps.data_id,
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

  getCheckboxInitiatValuesByGroup(groupName) {
    var cndGroupName = "PrimaryAgroProcessing";
    if (groupName === "primaryAgroProcessing") {
      cndGroupName = "PrimaryAgroProcessing";
    }
    if (groupName === "advancedAgroProcessing") {
      cndGroupName = "AdvancedAgroProcessing";
    }
    if (groupName === "secondaryAgroProcessing") {
      cndGroupName = "SecondaryAgroProcessing";
    }

    var valuesObj = {};
    this.state.cndlist.map(function (data) {
      if (data.cndGroup === cndGroupName) {
        valuesObj[data.cndName] = false;
      }
    });
    return valuesObj;
  }

  getInputInitiatValuesByGroup(groupName, type) {
    var cndGroupName = groupName;
    //console.log("cndGroupName", cndGroupName);
    var valuesObj = {};
    if (type === undefined) {
      this.state.cndlist.map(function (data) {
        //console.log(data.cndGroup + "" + groupName);
        if (data.cndGroup === cndGroupName) {
          valuesObj[data.cndCode] = 0;
        }
      });
    } else {
      this.state.cndlist.map(function (data) {
        if (data.cndGroup === cndGroupName) {
          valuesObj[data.cndCode] = {
            "Area Planted (ha)": 0,
            "Quantity Produced (tons)": 0,
          };
        }
      });
    }
    return valuesObj;
  }

  handleInputValues(ObjectName, event) {
    var targetStateSet = ObjectName + "OtherField";
    if (event.target.name === "Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "Other" && event.target.value > 0
            ? true
            : false,
      });

    if (event.target.name === "Livestock_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "Livestock_Other" && event.target.value > 0
            ? true
            : false,
      });

    if (event.target.name === "horticulture_other")
      this.setState({
        [targetStateSet]:
          event.target.name === "horticulture_other" && event.target.value > 0
            ? true
            : false,
      });
    if (event.target.name === "Field_Crops_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "Field_Crops_Other" && event.target.value > 0
            ? true
            : false,
      });
    if (event.target.name === "Forestry_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "Forestry_Other" && event.target.value > 0
            ? true
            : false,
      });
    if (event.target.name === "Aquaculture_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "Aquaculture_Other" && event.target.value > 0
            ? true
            : false,
      });
    if (event.target.name === "SeaFishing_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "SeaFishing_Other" && event.target.value > 0
            ? true
            : false,
      });
    if (event.target.name === "GameFarming_Other")
      this.setState({
        [targetStateSet]:
          event.target.name === "GameFarming_Other" && event.target.value > 0
            ? true
            : false,
      });

    let objectValues = {};
    // if (ObjectName === "Horticulture" || ObjectName === "HorticultureProduction") {
    //   if (Object.keys(this.state[ObjectName]).length === 0) {
    //     objectValues = this.getInputInitiatValuesByGroup(ObjectName, 1);
    //   } else {
    //     objectValues = this.state[ObjectName];
    //     console.log("objectValuesdddddd", objectValues);
    //     if (event.target.id.includes("AreaPlanted") === true) {
    //       objectValues[event.target.name["Area Planted"]] = event.target.value;
    //     } else {
    //       objectValues[event.target.name["Quantity Produced (tons)"]] =event.target.value;
    //     }
    //   }
    // }
    // else

    if (
      this.state[ObjectName] == null ||
      Object.keys(this.state[ObjectName]).length === 0
    ) {
      objectValues = this.getInputInitiatValuesByGroup(ObjectName);
    } else {
      objectValues = this.state[ObjectName];
    }

    objectValues[event.target.name] = event.target.value;

    this.setState({
      [ObjectName]: objectValues,
    });

    //console.log("this.state", this.state);
  }

  handleCheckboxChange(ObjectName, event) {
    /*console.log("event", event.target);
    console.log("ObjectName", ObjectName);
    console.log(event.target.checked, event.target.name);
    */
    var targetStateSet = ObjectName + "OtherField";
    this.setState({
      [targetStateSet]:
        event.target.name === "Others" && event.target.checked === true
          ? true
          : false,
    });

    let objectValues = {};
    if (Object.keys(this.state[ObjectName]).length === 0) {
      objectValues = this.getCheckboxInitiatValuesByGroup(ObjectName);
    } else {
      objectValues = this.state[ObjectName];
    }

    //console.log("objectValuesinit", objectValues);
    objectValues[event.target.name] = event.target.checked;
    //console.log("objectValuesUpdates", objectValues);
    this.setState({
      [ObjectName]: objectValues,
    });

    //console.log("this.state", this.state);
  }
  handlettabChange = (event, newValue) => {
    console.log("event", event);
    this.setState({
      tab: newValue,
    });
  };

  // supportingDoc = (name) => (event) => {
  //   this.setState({ ...this.state, [name]: event.target.checked });
  // };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;

    if (Object.keys(formpojo.primaryAgroProcessing).length === 0) {
      formpojo.primaryAgroProcessing = this.getCheckboxInitiatValuesByGroup(
        "primaryAgroProcessing"
      );
    }

    if (Object.keys(formpojo.secondaryAgroProcessing).length === 0) {
      formpojo.secondaryAgroProcessing = this.getCheckboxInitiatValuesByGroup(
        "secondaryAgroProcessing"
      );
    }
    if (Object.keys(formpojo.advancedAgroProcessing).length === 0) {
      formpojo.advancedAgroProcessing = this.getCheckboxInitiatValuesByGroup(
        "advancedAgroProcessing"
      );
    }

    formpojo.totalFarmSize = {
      Total: formpojo.Total ? formpojo.Total : 0,
      Arable: formpojo.arableFarmsize ? formpojo.arableFarmsize : 0,
      Grazing: formpojo.grazingFarmsize ? formpojo.grazingFarmsize : 0,
      "Non-arable": formpojo.nonarableFarmsize ? formpojo.nonarableFarmsize : 0,
    };

    formpojo.liveStock =
      Object.keys(formpojo.Livestock).length === 0
        ? this.getInputInitiatValuesByGroup("Livestock")
        : this.state.Livestock;
    formpojo.horticulture =
      Object.keys(formpojo.Horticulture).length === 0
        ? this.getInputInitiatValuesByGroup("Horticulture")
        : this.state.Horticulture;
    formpojo.horticultureProduction =
      Object.keys(formpojo.HorticultureProduction).length === 0
        ? this.getInputInitiatValuesByGroup("HorticultureProduction")
        : this.state.HorticultureProduction;

    if (formpojo.FieldCrops === null) formpojo.FieldCrops = {};

    formpojo.fieldCrops =
      Object.keys(formpojo.FieldCrops).length === 0
        ? this.getInputInitiatValuesByGroup("Field Crops")
        : this.state.FieldCrops;

    if (formpojo.FieldCropProduction === null)
      formpojo.FieldCropProduction = {};

    formpojo.fieldCropsProduction =
      Object.keys(formpojo.FieldCropProduction).length === 0
        ? this.getInputInitiatValuesByGroup("Field Crops Production")
        : this.state.FieldCropProduction;

    formpojo.forestry =
      Object.keys(formpojo.Forestry).length === 0
        ? this.getInputInitiatValuesByGroup("Forestry")
        : this.state.Forestry;

    if (formpojo.ForestryProduction === null) formpojo.ForestryProduction = {};

    formpojo.forestryProduction =
      Object.keys(formpojo.ForestryProduction).length === 0
        ? this.getInputInitiatValuesByGroup("ForestryProduction")
        : this.state.ForestryProduction;

    formpojo.aquaculture =
      Object.keys(formpojo.Aquaculture).length === 0
        ? this.getInputInitiatValuesByGroup("Aquaculture")
        : this.state.Aquaculture;

    formpojo.seaFishing =
      Object.keys(formpojo.SeaFishing).length === 0
        ? this.getInputInitiatValuesByGroup("SeaFishing")
        : this.state.SeaFishing;

    formpojo.gameFarming =
      Object.keys(formpojo.GameFarming).length === 0
        ? this.getInputInitiatValuesByGroup("GameFarming")
        : this.state.GameFarming;

    formpojo.practiseAgroProcessing =
      formpojo.practiseAgroProcessing === "Yes" ? true : false;
    formpojo.practiseAgroProcessingManual =
      formpojo.practiseAgroProcessingManual === "Yes" ? true : false;

    if (formpojo.businessEntityType === "") formpojo.businessEntityType = null;

    formpojo.farmMuncipalRegionObj = {
      _id: formpojo.farmMuncipalRegion,
      cndName: formpojo.farmMuncipalRegionName,
    };
    formpojo.metroDistrictObj = {
      _id: formpojo.metroDistrict,
      cndName: formpojo.metroDistrictName,
    };
    formpojo.provinceObj = {
      _id: formpojo.province,
      cndName: formpojo.provinceName,
    };
    formpojo.businessEntityTypeObj = {
      _id: formpojo.businessEntityType,
      cndName: formpojo.businessEntityTypeName,
    };
    console.log("farmer prod formpojo: ", formpojo);
    fetch(ApiEndPoints.farmerProduction, {
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
          //this.props.history.push("/farmers-data");
          this.props.history.push(
            "/farmer-asset-services/" + this.state.farmerId
          );
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
      fetch(ApiEndPoints.farmerProductionHistory + "?farmerId=" + farmerId, {
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
        fetch(ApiEndPoints.farmerProductionList + "?farmerId=" + farmerId, {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("farmer production:", data);

            if (data && data.success === true && data.result.length > 0) {
              this.setState({ nextBtnVisible: true });

              this.setState({
                advancedAgroProcessing: data.result[0].advancedAgroProcessing,
                Aquaculture: data.result[0].aquaculture,
                arableFarmsize: data.result[0].totalFarmSize.Arable,
                businessEntityType: data.result[0].businessEntityType,
                farmMuncipalRegion: data.result[0].farmMuncipalRegion,
                farmName: data.result[0].farmName,
                farmerId: data.result[0].farmerId,
                FieldCrops: data.result[0].fieldCrops,
                FieldCropProduction: data.result[0].fieldCropsProduction,

                Forestry: data.result[0].forestry,
                ForestryProduction: data.result[0].forestryProduction,

                GameFarming: data.result[0].gameFarming,

                grazingFarmsize: data.result[0].totalFarmSize.Grazing,
                Horticulture: data.result[0].horticulture,
                HorticultureProduction: data.result[0].horticultureProduction,

                Livestock: data.result[0].liveStock,

                marketingChannelTypeFormal:
                  data.result[0].marketingChannelTypeFormal,
                marketingChannelTypeInformal:
                  data.result[0].marketingChannelTypeInformal,
                metroDistrict: data.result[0].metroDistrict,
                nonarableFarmsize: data.result[0].totalFarmSize["Non-arable"],
                portionName: data.result[0].portionName,
                portionNumber: data.result[0].portionNumber,
                practiseAgroProcessing:
                  data.result[0].practiseAgroProcessing === true ? "Yes" : "No",
                practiseAgroProcessingManual:
                  data.result[0].practiseAgroProcessingManual === true
                    ? "Yes"
                    : "No",
                primaryAgroProcessing: data.result[0].primaryAgroProcessing,
                projectLegalEntityName: data.result[0].projectLegalEntityName,
                province: data.result[0].province,
                SeaFishing: data.result[0].seaFishing,
                secondaryAgroProcessing: data.result[0].secondaryAgroProcessing,
                Total: data.result[0].totalFarmSize.Total,
                totalFarmSize: data.result[0].totalFarmSize,
                totalMembersInEnitity: data.result[0].totalMembersInEnitity,
                townVillage: data.result[0].townVillage,
                wardNumber: data.result[0].wardNumber,

                farmLatitude: data.result[0].farmLatitude,
                farmLongitude: data.result[0].farmLongitude,

                FieldCropsOtherField:
                  data.result[0].fieldCropsOther !== "" &&
                  data.result[0].fieldCropsOther !== null
                    ? true
                    : false,
                fieldCropsOther: data.result[0].fieldCropsOther,

                ForestryOtherField:
                  data.result[0].forestryOther !== "" &&
                  data.result[0].forestryOther !== null
                    ? true
                    : false,
                forestryOther: data.result[0].forestryOther,

                GameFarmingOtherField:
                  data.result[0].gameFarmingOther !== "" &&
                  data.result[0].gameFarmingOther !== null
                    ? true
                    : false,
                gameFarmingOther: data.result[0].gameFarmingOther,

                HorticultureOtherField:
                  data.result[0].horticultureOther !== "" &&
                  data.result[0].horticultureOther !== null
                    ? true
                    : false,
                horticultureOther: data.result[0].horticultureOther,

                LivestockOtherField:
                  data.result[0].liveStockOther !== "" &&
                  data.result[0].liveStockOther !== null
                    ? true
                    : false,
                liveStockOther: data.result[0].liveStockOther,

                advancedAgroProcessingOtherField:
                  data.result[0].advancedAgroProcessingOther !== "" &&
                  data.result[0].advancedAgroProcessingOther !== null
                    ? true
                    : false,
                advancedAgroProcessingOther:
                  data.result[0].advancedAgroProcessingOther,

                AquacultureOtherField:
                  data.result[0].aquacultureOther !== "" &&
                  data.result[0].aquacultureOther !== null
                    ? true
                    : false,
                aquacultureOther: data.result[0].aquacultureOther,

                primaryAgroProcessingOtherField:
                  data.result[0].primaryAgroProcessingOther !== "" &&
                  data.result[0].primaryAgroProcessingOther !== null
                    ? true
                    : false,
                primaryAgroProcessingOther:
                  data.result[0].primaryAgroProcessingOther,

                SeaFishingOtherField:
                  data.result[0].seaFishingOther !== "" &&
                  data.result[0].seaFishingOther !== null
                    ? true
                    : false,
                seaFishingOther: data.result[0].seaFishingOther,

                secondaryAgroProcessingOtherField:
                  data.result[0].secondaryAgroProcessingOther !== "" &&
                  data.result[0].secondaryAgroProcessingOther !== null
                    ? true
                    : false,
                secondaryAgroProcessingOther:
                  data.result[0].secondaryAgroProcessingOther,

                farmMuncipalRegionName:
                  data.result[0].farmMuncipalRegionObj &&
                  data.result[0].farmMuncipalRegionObj !== null &&
                  data.result[0].farmMuncipalRegionObj !== undefined
                    ? data.result[0].farmMuncipalRegionObj.cndName
                    : "",
                metroDistrictName:
                  data.result[0].metroDistrictObj &&
                  data.result[0].metroDistrictObj !== null &&
                  data.result[0].metroDistrictObj !== undefined
                    ? data.result[0].metroDistrictObj.cndName
                    : "",
                provinceName:
                  data.result[0].provinceObj &&
                  data.result[0].provinceObj !== null &&
                  data.result[0].provinceObj !== undefined
                    ? data.result[0].provinceObj.cndName
                    : "",
                businessEntityTypeName:
                  data.result[0].businessEntityTypeObj &&
                  data.result[0].businessEntityTypeObj !== null &&
                  data.result[0].businessEntityTypeObj !== undefined
                    ? data.result[0].businessEntityTypeObj.cndName
                    : "",
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
    } else if (value && value !== "LATEST") {
      this.setState({ saveBtnVisible: false });

      fetch(ApiEndPoints.farmerProductionHistory + "?id=" + value, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data history : ", data);
          if (data && data.success === true && data.result.length > 0) {
            this.setState({
              advancedAgroProcessing: data.result[0].advancedAgroProcessing,
              Aquaculture: data.result[0].aquaculture,
              arableFarmsize: data.result[0].totalFarmSize.Arable,
              businessEntityType: data.result[0].businessEntityType,
              farmMuncipalRegion: data.result[0].farmMuncipalRegion,
              farmName: data.result[0].farmName,
              farmerId: data.result[0].farmerId,
              FieldCrops: data.result[0].fieldCrops,
              FieldCropProduction: data.result[0].fieldCropsProduction,
              Forestry: data.result[0].forestry,
              ForestryProduction: data.result[0].forestryProduction,
              GameFarming: data.result[0].gameFarming,
              grazingFarmsize: data.result[0].totalFarmSize.Grazing,
              Horticulture: data.result[0].horticulture,
              HorticultureProduction: data.result[0].horticultureProduction,
              Livestock: data.result[0].liveStock,
              marketingChannelTypeFormal:
                data.result[0].marketingChannelTypeFormal,
              marketingChannelTypeInformal:
                data.result[0].marketingChannelTypeInformal,
              metroDistrict: data.result[0].metroDistrict,
              nonarableFarmsize: data.result[0].totalFarmSize["Non-arable"],
              portionName: data.result[0].portionName,
              portionNumber: data.result[0].portionNumber,
              practiseAgroProcessing:
                data.result[0].practiseAgroProcessing === true ? "Yes" : "No",
              practiseAgroProcessingManual:
                data.result[0].practiseAgroProcessingManual === true
                  ? "Yes"
                  : "No",
              primaryAgroProcessing: data.result[0].primaryAgroProcessing,
              projectLegalEntityName: data.result[0].projectLegalEntityName,
              province: data.result[0].province,
              SeaFishing: data.result[0].seaFishing,
              secondaryAgroProcessing: data.result[0].secondaryAgroProcessing,
              Total: data.result[0].totalFarmSize.Total,
              totalFarmSize: data.result[0].totalFarmSize,
              totalMembersInEnitity: data.result[0].totalMembersInEnitity,
              townVillage: data.result[0].townVillage,
              wardNumber: data.result[0].wardNumber,

              id: data.result[0].farmerId,

              farmLatitude: data.result[0].farmLatitude,
              farmLongitude: data.result[0].farmLongitude,

              FieldCropsOtherField:
                data.result[0].fieldCropsOther !== "" &&
                data.result[0].fieldCropsOther !== null
                  ? true
                  : false,
              fieldCropsOther: data.result[0].fieldCropsOther,

              ForestryOtherField:
                data.result[0].forestryOther !== "" &&
                data.result[0].forestryOther !== null
                  ? true
                  : false,
              forestryOther: data.result[0].forestryOther,

              GameFarmingOtherField:
                data.result[0].gameFarmingOther !== "" &&
                data.result[0].gameFarmingOther !== null
                  ? true
                  : false,
              gameFarmingOther: data.result[0].gameFarmingOther,

              HorticultureOtherField:
                data.result[0].horticultureOther !== "" &&
                data.result[0].horticultureOther !== null
                  ? true
                  : false,
              horticultureOther: data.result[0].horticultureOther,

              LivestockOtherField:
                data.result[0].liveStockOther !== "" &&
                data.result[0].liveStockOther !== null
                  ? true
                  : false,
              liveStockOther: data.result[0].liveStockOther,

              advancedAgroProcessingOtherField:
                data.result[0].advancedAgroProcessingOther !== "" &&
                data.result[0].advancedAgroProcessingOther !== null
                  ? true
                  : false,
              advancedAgroProcessingOther:
                data.result[0].advancedAgroProcessingOther,

              AquacultureOtherField:
                data.result[0].aquacultureOther !== "" &&
                data.result[0].aquacultureOther !== null
                  ? true
                  : false,
              aquacultureOther: data.result[0].aquacultureOther,

              primaryAgroProcessingOtherField:
                data.result[0].primaryAgroProcessingOther !== "" &&
                data.result[0].primaryAgroProcessingOther !== null
                  ? true
                  : false,
              primaryAgroProcessingOther:
                data.result[0].primaryAgroProcessingOther,

              SeaFishingOtherField:
                data.result[0].seaFishingOther !== "" &&
                data.result[0].seaFishingOther !== null
                  ? true
                  : false,
              seaFishingOther: data.result[0].seaFishingOther,

              secondaryAgroProcessingOtherField:
                data.result[0].secondaryAgroProcessingOther !== "" &&
                data.result[0].secondaryAgroProcessingOther !== null
                  ? true
                  : false,
              secondaryAgroProcessingOther:
                data.result[0].secondaryAgroProcessingOther,

              farmMuncipalRegionName:
                data.result[0].farmMuncipalRegionObj &&
                data.result[0].farmMuncipalRegionObj !== null &&
                data.result[0].farmMuncipalRegionObj !== undefined
                  ? data.result[0].farmMuncipalRegionObj.cndName
                  : "",
              metroDistrictName:
                data.result[0].metroDistrictObj &&
                data.result[0].metroDistrictObj !== null &&
                data.result[0].metroDistrictObj !== undefined
                  ? data.result[0].metroDistrictObj.cndName
                  : "",
              provinceName:
                data.result[0].provinceObj &&
                data.result[0].provinceObj !== null &&
                data.result[0].provinceObj !== undefined
                  ? data.result[0].provinceObj.cndName
                  : "",
              businessEntityTypeName:
                data.result[0].businessEntityTypeObj &&
                data.result[0].businessEntityTypeObj !== null &&
                data.result[0].businessEntityTypeObj !== undefined
                  ? data.result[0].businessEntityTypeObj.cndName
                  : "",
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
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getHistoryDates();
    this.getCndList();
    var farmerId = this.props.match.params.farmerId;
    this.setState({ farmerId: farmerId });

    //get farmer Production by id

    if (farmerId) {
      fetch(ApiEndPoints.farmerProductionList + "?farmerId=" + farmerId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("farmer production:", data);

          if (data && data.success === true && data.result.length > 0) {
            this.setState({ nextBtnVisible: true });

            this.setState({
              advancedAgroProcessing: data.result[0].advancedAgroProcessing,
              Aquaculture: data.result[0].aquaculture,
              arableFarmsize: data.result[0].totalFarmSize.Arable,
              businessEntityType: data.result[0].businessEntityType,
              farmMuncipalRegion: data.result[0].farmMuncipalRegion,
              farmName: data.result[0].farmName,
              farmerId: data.result[0].farmerId,
              FieldCrops: data.result[0].fieldCrops,
              FieldCropProduction: data.result[0].fieldCropsProduction,
              Forestry: data.result[0].forestry,
              ForestryProduction: data.result[0].forestryProduction,
              GameFarming: data.result[0].gameFarming,
              grazingFarmsize: data.result[0].totalFarmSize.Grazing,
              Horticulture: data.result[0].horticulture,
              HorticultureProduction: data.result[0].horticultureProduction,

              Livestock: data.result[0].liveStock,

              marketingChannelTypeFormal:
                data.result[0].marketingChannelTypeFormal,
              marketingChannelTypeInformal:
                data.result[0].marketingChannelTypeInformal,
              metroDistrict: data.result[0].metroDistrict,
              nonarableFarmsize: data.result[0].totalFarmSize["Non-arable"],
              portionName: data.result[0].portionName,
              portionNumber: data.result[0].portionNumber,
              practiseAgroProcessing:
                data.result[0].practiseAgroProcessing === true ? "Yes" : "No",
              practiseAgroProcessingManual:
                data.result[0].practiseAgroProcessingManual === true
                  ? "Yes"
                  : "No",
              primaryAgroProcessing: data.result[0].primaryAgroProcessing,
              projectLegalEntityName: data.result[0].projectLegalEntityName,
              province: data.result[0].province,
              SeaFishing: data.result[0].seaFishing,
              secondaryAgroProcessing: data.result[0].secondaryAgroProcessing,
              Total: data.result[0].totalFarmSize.Total,
              totalFarmSize: data.result[0].totalFarmSize,
              totalMembersInEnitity: data.result[0].totalMembersInEnitity,
              townVillage: data.result[0].townVillage,
              wardNumber: data.result[0].wardNumber,

              farmLatitude: data.result[0].farmLatitude,
              farmLongitude: data.result[0].farmLongitude,

              FieldCropsOtherField:
                data.result[0].fieldCropsOther !== "" &&
                data.result[0].fieldCropsOther !== null
                  ? true
                  : false,
              fieldCropsOther: data.result[0].fieldCropsOther,

              ForestryOtherField:
                data.result[0].forestryOther !== "" &&
                data.result[0].forestryOther !== null
                  ? true
                  : false,
              forestryOther: data.result[0].forestryOther,

              GameFarmingOtherField:
                data.result[0].gameFarmingOther !== "" &&
                data.result[0].gameFarmingOther !== null
                  ? true
                  : false,
              gameFarmingOther: data.result[0].gameFarmingOther,

              HorticultureOtherField:
                data.result[0].horticultureOther !== "" &&
                data.result[0].horticultureOther !== null
                  ? true
                  : false,
              horticultureOther: data.result[0].horticultureOther,

              LivestockOtherField:
                data.result[0].liveStockOther !== "" &&
                data.result[0].liveStockOther !== null
                  ? true
                  : false,
              liveStockOther: data.result[0].liveStockOther,

              advancedAgroProcessingOtherField:
                data.result[0].advancedAgroProcessingOther !== "" &&
                data.result[0].advancedAgroProcessingOther !== null
                  ? true
                  : false,
              advancedAgroProcessingOther:
                data.result[0].advancedAgroProcessingOther,

              AquacultureOtherField:
                data.result[0].aquacultureOther !== "" &&
                data.result[0].aquacultureOther !== null
                  ? true
                  : false,
              aquacultureOther: data.result[0].aquacultureOther,

              primaryAgroProcessingOtherField:
                data.result[0].primaryAgroProcessingOther !== "" &&
                data.result[0].primaryAgroProcessingOther !== null
                  ? true
                  : false,
              primaryAgroProcessingOther:
                data.result[0].primaryAgroProcessingOther,

              SeaFishingOtherField:
                data.result[0].seaFishingOther !== "" &&
                data.result[0].seaFishingOther !== null
                  ? true
                  : false,
              seaFishingOther: data.result[0].seaFishingOther,

              secondaryAgroProcessingOtherField:
                data.result[0].secondaryAgroProcessingOther !== "" &&
                data.result[0].secondaryAgroProcessingOther !== null
                  ? true
                  : false,
              secondaryAgroProcessingOther:
                data.result[0].secondaryAgroProcessingOther,

              farmMuncipalRegionName:
                data.result[0].farmMuncipalRegionObj &&
                data.result[0].farmMuncipalRegionObj !== null &&
                data.result[0].farmMuncipalRegionObj !== undefined
                  ? data.result[0].farmMuncipalRegionObj.cndName
                  : "",
              metroDistrictName:
                data.result[0].metroDistrictObj &&
                data.result[0].metroDistrictObj !== null &&
                data.result[0].metroDistrictObj !== undefined
                  ? data.result[0].metroDistrictObj.cndName
                  : "",
              provinceName:
                data.result[0].provinceObj &&
                data.result[0].provinceObj !== null &&
                data.result[0].provinceObj !== undefined
                  ? data.result[0].provinceObj.cndName
                  : "",
              businessEntityTypeName:
                data.result[0].businessEntityTypeObj &&
                data.result[0].businessEntityTypeObj !== null &&
                data.result[0].businessEntityTypeObj !== undefined
                  ? data.result[0].businessEntityTypeObj.cndName
                  : "",
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
    if (farmerId) this.props.history.push("/update-farmer-data/" + farmerId);
  }

  handleNext(event) {
    event.preventDefault();

    var farmerId = this.props.match.params.farmerId;
    console.log("farmerId :xxx x : ", farmerId);

    this.props.history.push("/farmer-asset-services/" + farmerId);
  }

  handleCheckFormal = (event) => {
    this.setState({ marketingChannelTypeFormal: event.target.checked });
  };
  handleCheckInFormal = (event) => {
    this.setState({ marketingChannelTypeInformal: event.target.checked });
  };

  render() {
    const { cndlist, farmLatitude, farmLongitude } = this.state;

    let Latitude =
      farmLatitude === null || farmLatitude === undefined ? "" : farmLatitude;
    let Longitude =
      farmLongitude === null || farmLongitude === undefined
        ? ""
        : farmLongitude;

    let provinces = cndlist
      ? cndlist.filter((data) => data.cndGroup === "Provinces")
      : [];
    provinces.sort(auth.sortValues("cndName"));

    let districts = cndlist
      ? cndlist.filter((data) => data.cndGroup === "District")
      : [];
    districts.sort(auth.sortValues("cndName"));

    let municipalities = cndlist
      ? cndlist.filter(
          (data) =>
            data.cndGroup === "Municipality" &&
            data.parent._id == this.state.metroDistrict
        )
      : [];

    municipalities.sort(auth.sortValues("cndName"));

    let businessEntityType = cndlist.filter(
      (data) => data.cndGroup === "BusinessEntityType"
    );
    businessEntityType.sort(auth.sortValues("cndName"));

    let livestocks = cndlist
      .filter((data) => data.cndGroup === "Livestock")
      .sort((a, b) => a.priority - b.priority);

    let horticulture = cndlist
      .filter((data) => data.cndGroup === "Horticulture")
      .sort((a, b) => a.priority - b.priority);

    let horticultureProd = cndlist
      .filter((data) => data.cndGroup === "HorticultureProduction")
      .sort((a, b) => a.priority - b.priority);

    let fieldCrops = cndlist
      .filter((data) => data.cndGroup === "Field Crops")
      .sort((a, b) => a.priority - b.priority);

    let fieldCropProd = cndlist
      .filter((data) => data.cndGroup === "Field Crops Production")
      .sort((a, b) => a.priority - b.priority);

    let forestry = cndlist
      .filter((data) => data.cndGroup === "Forestry")
      .sort((a, b) => a.priority - b.priority);

    let forestryProd = cndlist
      .filter((data) => data.cndGroup === "ForestryProduction")
      .sort((a, b) => a.priority - b.priority);

    let aquaculture = cndlist
      .filter((data) => data.cndGroup === "Aquaculture")
      .sort((a, b) => a.priority - b.priority);

    let seaFishing = cndlist
      .filter((data) => data.cndGroup === "SeaFishing")
      .sort((a, b) => a.priority - b.priority);
    let GameFarming = cndlist
      .filter((data) => data.cndGroup === "GameFarming")
      .sort((a, b) => a.priority - b.priority);

    let primaryAgroProcessing = cndlist
      ? cndlist
          .filter((data) => data.cndGroup === "PrimaryAgroProcessing")
          .sort((a, b) => a.priority - b.priority)
      : [];
    let advancedAgroProcessing = cndlist
      ? cndlist
          .filter((data) => data.cndGroup === "AdvancedAgroProcessing")
          .sort((a, b) => a.priority - b.priority)
      : [];
    let secondaryAgroProcessing = cndlist
      ? cndlist
          .filter((data) => data.cndGroup === "SecondaryAgroProcessing")
          .sort((a, b) => a.priority - b.priority)
      : [];

    let saveBtnStyle =
      this.state.saveBtnVisible === true
        ? { display: "block" }
        : { display: "none" };

    let nextBtnStyle =
      this.state.nextBtnVisible === true
        ? { display: "block" }
        : { display: "none" };

    /*let education = cndlist.filter(data => data.cndGroup === "Education");
    let ownershipType = cndlist.filter(
      data => data.cndGroup === "OwnershipType"
    );

    let programmeRedistribution = cndlist.filter(
      data => data.cndGroup === "ProgrammeRedistribution"
    );

    let landAquisition = cndlist.filter(
      data => data.cndGroup === "LandAquisition"
    );
    */

    console.log("prod Latitude, Longitude : ", Latitude, Longitude);

    return (
      <div className="card container py-3">
        <ValidatorForm
          ref="form"
          instantValidate
          //onError={errors => console.log(errors)}
          onSubmit={this.handleSubmitHistory}
        >
          <div className="headerP">
            <span className="farmerTitle">Farm Production</span>
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
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Section 2 - Farm and production details - Particulars of the
                farm reported on
              </p>
              <div className="form-group row">
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Farm Name *"
                    helperText=" "
                    onChange={this.handleChange}
                    name="farmName"
                    value={this.state.farmName}
                    validators={["required"]}
                    errorMessages={["Farm Name is mandatory"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Portion Number"
                    helperText=" "
                    onChange={this.handleChange}
                    name="portionNumber"
                    value={this.state.portionNumber}
                    //validators={["required"]}
                    //errorMessages={["Portion Number is mandatory"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Portion Name"
                    helperText=" "
                    onChange={this.handleChange}
                    name="portionName"
                    value={this.state.portionName}
                    //validators={["required"]}
                    // errorMessages={["Portion Name is mandatory"]}
                  />
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Province *"
                    helperText="In which the
                            farm is situated *"
                    onChange={this.handleChange}
                    name="province"
                    value={this.state.province}
                    validators={["required"]}
                    //   className="select"
                    errorMessages={["Province is mandatory"]}
                  >
                    {provinces.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
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
              <div className="form-group row">
                <div className="col-sm-3">
                  {/* <SelectValidator
                    variant="outlined"
                    label="District *"
                    helperText="Municipality in which the
                            farm is situated *"
                    onChange={this.handleChange}
                    name="metroDistrict"
                    value={this.state.metroDistrict}
                    validators={["required"]}
                    className="select"
                    errorMessages={["District is mandatory"]}
                  >
                    
                    <option className="custom-option" value="District">
                      District
                    </option>
                  </SelectValidator> */}

                  {/* <TextValidator
                    variant="outlined"
                    label="Metro/District *"
                    helperText="Municipality in which the
                    farm is situated *"
                    onChange={this.handleChange}
                    name="metroDistrict"
                    value={this.state.metroDistrict}
                    validators={["required"]}
                    errorMessages={["Please enter municipality"]}
                  /> */}

                  <SelectValidator
                    variant="outlined"
                    label="Metro/District *"
                    helperText="Municipality in which the
                    farm is situated *"
                    onChange={this.handleChange}
                    name="metroDistrict"
                    value={this.state.metroDistrict}
                    validators={["required"]}
                    //   className="select"
                    errorMessages={["District is mandatory"]}
                  >
                    {districts.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          value={value._id}
                          data_id={value.cndName}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
                <div className="col-sm-3">
                  {/* <TextValidator
                    variant="outlined"
                    label="Municipality Region *"
                    helperText="region in which farm situated *"
                    onChange={this.handleChange}
                    name="farmMuncipalRegion"
                    value={this.state.farmMuncipalRegion}
                    validators={["required"]}
                    errorMessages={["Please enter Municipality Region"]}
                  /> */}
                  <SelectValidator
                    variant="outlined"
                    label="Municipality Region *"
                    helperText="region in which farm situated *"
                    onChange={this.handleChange}
                    name="farmMuncipalRegion"
                    value={this.state.farmMuncipalRegion}
                    validators={["required"]}
                    //   className="select"
                    errorMessages={["Please enter Municipality Region"]}
                  >
                    {municipalities.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          value={value._id}
                          data_id={value.cndName}
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
                    label="Ward Number *"
                    helperText=" "
                    onChange={this.handleChange}
                    name="wardNumber"
                    value={this.state.wardNumber}
                    validators={["required"]}
                    errorMessages={["Please enter Ward Number"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Nearest Town/Village *"
                    helperText=" "
                    onChange={this.handleChange}
                    name="townVillage"
                    value={this.state.townVillage}
                    validators={["required"]}
                    errorMessages={["Please enter Nearest Town/Village"]}
                  />
                </div>

                <div className="col-sm-6">
                  <TextValidator
                    variant="outlined"
                    label="Project or Legal entity name"
                    helperText=" "
                    onChange={this.handleChange}
                    name="projectLegalEntityName"
                    value={this.state.projectLegalEntityName}
                    //validators={["required"]}
                    //errorMessages={[
                    //  "Please enter Project or Legal entity name"
                    //]}
                  />
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Business entity type"
                    helperText="Select your Business entity type"
                    onChange={this.handleChange}
                    name="businessEntityType"
                    //validators={["required"]}
                    //errorMessages={["Please select Age Group"]}
                    value={this.state.businessEntityType}
                  >
                    {businessEntityType.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          value={value._id}
                          data_id={value.cndName}
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
                    label="Members In Business Entity"
                    helperText="How many members are there in the entity"
                    onChange={this.handleChange}
                    name="totalMembersInEnitity"
                    value={this.state.totalMembersInEnitity}
                    /*validators={["required"]}
                          errorMessages={[
                            "Please enter Project or Legal entity name"
                          ]}*/
                  />
                </div>
              </div>
              <hr />
              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Farm Size (ha)
              </h6>
              <div className="form-group row">
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Total"
                    helperText=" "
                    onChange={this.handleChange}
                    name="Total"
                    value={this.state.Total}
                    // validators={["required"]}
                    // errorMessages={["Please enter l farm size"]}
                    disabled
                    type="number"
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Arable"
                    helperText=" "
                    onChange={this.handleChange}
                    name="arableFarmsize"
                    value={this.state.arableFarmsize}
                    // validators={["required"]}
                    /* errorMessages={[
                            "Please enter male no of employees"
                          ]}
                          */
                    type="number"
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Grazing"
                    helperText=" "
                    onChange={this.handleChange}
                    name="grazingFarmsize"
                    value={this.state.grazingFarmsize}
                    /*validators={["required"]}
                          errorMessages={[
                            "Please enter female no of employees"
                          ]}
                          */
                    type="number"
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Non-arable"
                    //helperText="Non-arable"
                    onChange={this.handleChange}
                    name="nonarableFarmsize"
                    value={this.state.nonarableFarmsize}
                    /*validators={["required"]}
                          errorMessages={[
                            "Please enter youth count in employees"
                          ]}*/
                    type="number"
                  />
                </div>
              </div>
              <hr />
              {/* <h6 className="m-3">Farming/Fishing practised </h6> */}
              <p style={{ textAlign: "left", fontWeight: "bold" }}>
                Please indicate the type of farming/fishing practised (if
                livestock, please state the number owned of each type and ha for
                horticulture and field crops)
              </p>
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Livestock (Number)
              </p>
              <div className="form-group row">
                {livestocks.map((value, index) => {
                  return (
                    <div
                      className="col-sm-2"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <TextValidator
                        variant="outlined"
                        label={value.cndName}
                        onChange={this.handleInputValues.bind(
                          this,
                          "Livestock"
                        )}
                        name={value.cndCode}
                        // value={typeof (this.state.Livestock[value.cndName]) == 'undefined' ? "" : this.state.Livestock[value.cndName] || ""}
                        value={this.state.Livestock[value.cndCode] || ""}
                        validators={["isNumber"]}
                        errorMessages={["It Should be numeric"]}
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.LivestockOtherField &&
              this.state.LivestockOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="liveStockOther"
                      value={this.state.liveStockOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Horticulture
              </p>
              <div className="form-group row">
                {horticulture.map((value, index) => {
                  return (
                    <div className="col-sm-3" key={index}>
                      <p>{value.cndName}</p>
                      <TextValidator
                        style={{ paddingTop: 8 }}
                        // id="Horticulture_AreaPlanted"
                        id={value.cndCode}
                        variant="outlined"
                        label="Area Planted (ha)"
                        onChange={this.handleInputValues.bind(
                          this,
                          "Horticulture"
                        )}
                        name={value.cndCode}
                        value={this.state.Horticulture[value.cndCode] || ""}
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="form-group row">
                {horticultureProd.map((value, index) => {
                  return (
                    <div className="col-sm-3" key={index}>
                      <TextValidator
                        style={{ paddingTop: 8 }}
                        variant="outlined"
                        id={value.cndCode}
                        onChange={this.handleInputValues.bind(
                          this,
                          "HorticultureProduction"
                        )}
                        label="Quantity Produced (tons)"
                        // onChange={this.handleChange}
                        name={value.cndCode}
                        // value={typeof (this.state.Horticulture[value.cndCode]) == 'undefined' ? "" : this.state.Horticulture[value.cndCode] || ""}
                        value={
                          (this.state.HorticultureProduction &&
                            this.state.HorticultureProduction[value.cndCode]) ||
                          ""
                        }
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.HorticultureOtherField &&
              this.state.HorticultureOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="horticultureOther"
                      value={this.state.horticultureOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p className="p-1 mb-2 bg-success" style={{ textAlign: "left" }}>
                Field Crops
              </p>
              <div className="form-group row">
                {fieldCrops.map((value, index) => {
                  return (
                    <div
                      className="col-sm-2"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <p>{value.cndName}</p>
                      <TextValidator
                        variant="outlined"
                        label="Area Planted (ha)"
                        id={value.cndCode}
                        name={value.cndCode}
                        value={
                          typeof this.state.FieldCrops[value.cndCode] ==
                          "undefined"
                            ? ""
                            : this.state.FieldCrops[value.cndCode] || ""
                        }
                        onChange={
                          //(
                          this.handleInputValues.bind(this, "FieldCrops")

                          //,this.handleChange)
                        }
                        // validators={["matchRegexp:^[0-9]+\.[0-9]+$"]}
                        // errorMessages={["It Should be numeric"]}
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="form-group row">
                {fieldCropProd.map((value, index) => {
                  return (
                    <div className="col-sm-2" key={index}>
                      <TextValidator
                        style={{ paddingTop: 8 }}
                        variant="outlined"
                        id={value.cndCode}
                        onChange={this.handleInputValues.bind(
                          this,
                          "FieldCropProduction"
                        )}
                        label="Quantity Produced (tons)"
                        // onChange={this.handleChange}
                        name={value.cndCode}
                        // value={typeof (this.state.Horticulture[value.cndCode]) == 'undefined' ? "" : this.state.Horticulture[value.cndCode] || ""}
                        value={
                          typeof this.state.FieldCropProduction[
                            value.cndCode
                          ] == "undefined"
                            ? ""
                            : this.state.FieldCropProduction[value.cndCode] ||
                              ""
                        }
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.FieldCropsOtherField &&
              this.state.FieldCropsOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-10">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="fieldCropsOther"
                      value={this.state.fieldCropsOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Forestry
              </p>
              <div className="form-group row">
                {forestry.map((value, index) => {
                  return (
                    <div
                      className="col-sm-2"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <p>{value.cndName}</p>
                      <TextValidator
                        variant="outlined"
                        label="Area Planted (ha)"
                        id={value.cndCode}
                        name={value.cndCode}
                        value={
                          typeof this.state.Forestry[value.cndCode] ==
                          "undefined"
                            ? ""
                            : this.state.Forestry[value.cndCode] || ""
                        }
                        onChange={
                          //(
                          this.handleInputValues.bind(this, "Forestry")

                          //,this.handleChange)
                        }
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {/*                        
                      <div className="form-group row">
                        {forestry.map((value, index) => {
                          return (
                            <div
                              className="col-xs-2 col-half-offset"
                              style={{ paddingTop: 8 }}
                              key={index}
                            >
                              <p>{value.cndName}</p>
                              <TextValidator
                                variant="outlined"
                                label="Area Planted (ha)"
                                id={value.cndCode}
                                name={value.cndCode}
                                value={this.state.Forestry[value.cndCode]}
                                onChange={
                                  //(
                                  (this.handleInputValues.bind(
                                    this,
                                    "Forestry"
                                  ),
                                  this.handleChange)
                                }
                                validators={["isNumber"]}
                                errorMessages={["It Should be numeric"]}
                              />
                            </div>
                          );
                        })}
                      </div>
                        */}
              <div className="form-group row">
                {forestryProd.map((value, index) => {
                  return (
                    <div className="col-sm-2" key={index}>
                      <TextValidator
                        style={{ paddingTop: 8 }}
                        variant="outlined"
                        id={value.cndCode}
                        onChange={this.handleInputValues.bind(
                          this,
                          "ForestryProduction"
                        )}
                        label="Quantity Produced (tons)"
                        name={value.cndCode}
                        value={
                          (this.state.ForestryProduction &&
                            this.state.ForestryProduction[value.cndCode]) ||
                          ""
                        }
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.ForestryOtherField &&
              this.state.ForestryOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-10">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="forestryOther"
                      value={this.state.forestryOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Aquaculture - Quantity Produced (tons)
              </p>
              <div className="form-group row">
                {aquaculture.map((value, index) => {
                  return (
                    <div
                      className="col-sm-3"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <TextValidator
                        variant="outlined"
                        label={value.cndName}
                        id={value.cndCode}
                        name={value.cndCode}
                        value={this.state.Aquaculture[value.cndCode] || ""}
                        onChange={this.handleInputValues.bind(
                          this,
                          "Aquaculture"
                        )}
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.AquacultureOtherField &&
              this.state.AquacultureOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="aquacultureOther"
                      value={this.state.aquacultureOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Sea Fishing - Quantity Produced (tons)
              </p>
              <div className="form-group row">
                {seaFishing.map((value, index) => {
                  return (
                    <div
                      className="col-sm-2"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <TextValidator
                        variant="outlined"
                        label={value.cndName}
                        //onChange={this.handleChange}
                        name={value.cndCode}
                        value={this.state.SeaFishing[value.cndCode] || ""}
                        onChange={this.handleInputValues.bind(
                          this,
                          "SeaFishing"
                        )}
                        type="number"
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.SeaFishingOtherField &&
              this.state.SeaFishingOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="seaFishingOther"
                      value={this.state.seaFishingOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Game Farming - Number
              </p>
              <div className="form-group row">
                {GameFarming.map((value, index) => {
                  return (
                    <div
                      className="col-sm-2"
                      style={{ paddingTop: 8 }}
                      key={index}
                    >
                      <TextValidator
                        variant="outlined"
                        label={value.cndName}
                        //onChange={this.handleChange}
                        name={value.cndCode}
                        value={this.state.GameFarming[value.cndCode] || ""}
                        onChange={this.handleInputValues.bind(
                          this,
                          "GameFarming"
                        )}
                        validators={["isNumber"]}
                        errorMessages={["It Should be numeric"]}
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.GameFarmingOtherField &&
              this.state.GameFarmingOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="gameFarmingOther"
                      value={this.state.gameFarmingOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Type of Marketing Channel
              </p>
              <div className="form-group row">
                <div className="col-sm-6" style={{ textAlign: "left" }}>
                  {/* <FormLabel component="marketingChannelType">
                    Type of Marketing Channel
                  </FormLabel>
                  <RadioGroup
                    variant="outlined"
                    aria-label="marketingChannelType"
                    name="marketingChannelType"
                    value={this.state.marketingChannelType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Formal"
                      variant="outlined"
                      control={<Radio />}
                      label="Formal"
                    />
                    <FormControlLabel
                      value="Informal"
                      control={<Radio />}
                      label="Informal"
                    />
                  </RadioGroup> */}
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.marketingChannelTypeFormal}
                          onChange={this.handleCheckFormal}
                          name="formalMarketing"
                          color="primary"
                        />
                      }
                      label={<span style={{ color: "black" }}>{"Formal"}</span>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.marketingChannelTypeInformal}
                          onChange={this.handleCheckInFormal}
                          name="informalMarketing"
                          color="primary"
                        />
                      }
                      label={
                        <span style={{ color: "black" }}>{"Informal"}</span>
                      }
                    />
                  </FormGroup>
                </div>
              </div>
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Does your farm practise value adding and/or agro-processing
                activities
              </p>
              <div className="form-group row">
                <div className="col-sm-6" style={{ textAlign: "left" }}>
                  <RadioGroup
                    aria-label="practiseAgroProcessing"
                    name="practiseAgroProcessing"
                    value={this.state.practiseAgroProcessing}
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

              <p style={{ textAlign: "left", fontWeight: "bold" }}>
                If yes, indicate the type of value adding and/agro-processing
                activities your farm is practising by marking below
              </p>
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Primary Agro Activities
              </p>
              <div className="form-group row">
                <div className="col-sm-12" style={{ textAlign: "left" }}>
                  {primaryAgroProcessing.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          id={value.cndCode}
                          name={value.cndName}
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "primaryAgroProcessing"
                          )}
                          checked={
                            this.state.primaryAgroProcessing[value.cndName] ||
                            false
                          }
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.primaryAgroProcessingOtherField &&
              this.state.primaryAgroProcessingOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="primaryAgroProcessingOther"
                      value={this.state.primaryAgroProcessingOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Secondary Agro Activities
              </p>
              <div className="form-group row">
                <div className="col-sm-12" style={{ textAlign: "left" }}>
                  {secondaryAgroProcessing.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "secondaryAgroProcessing"
                          )}
                          color="primary"
                          checked={
                            this.state.secondaryAgroProcessing[value.cndName] ||
                            false
                          }
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.secondaryAgroProcessingOtherField &&
              this.state.secondaryAgroProcessingOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="secondaryAgroProcessingOther"
                      value={this.state.secondaryAgroProcessingOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Advanced Agro Activities
              </p>
              <div className="form-group row">
                <div className="col-sm-12" style={{ textAlign: "left" }}>
                  {advancedAgroProcessing.map((value, index) => {
                    return (
                      <label key={index}>
                        <Checkbox
                          name={value.cndName}
                          checked={
                            this.state.advancedAgroProcessing[value.cndName] ||
                            false
                          }
                          onChange={this.handleCheckboxChange.bind(
                            this,
                            "advancedAgroProcessing"
                          )}
                          color="primary"
                        />
                        <span>{value.cndName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {this.state.advancedAgroProcessingOtherField &&
              this.state.advancedAgroProcessingOtherField === true ? (
                <div className="form-group row">
                  <div className="col-sm-12">
                    <TextValidator
                      variant="outlined"
                      label="Other Specify"
                      onChange={this.handleChange}
                      name="advancedAgroProcessingOther"
                      value={this.state.advancedAgroProcessingOther}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Are the value adding and/or Agro-processing activities practised
                on your farm undertaken manually?
              </p>
              <div className="form-group row">
                <div className="col-sm-12" style={{ textAlign: "left" }}>
                  <RadioGroup
                    aria-label="practiseAgroProcessingManual"
                    name="practiseAgroProcessingManual"
                    value={this.state.practiseAgroProcessingManual}
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
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Location
              </p>
              <div className="form-group row">
                <div className="col-sm-3">
                  {/* <a
                    href={
                      "https://www.google.com/maps?q=" +
                      Latitude +
                      "," +
                      Longitude
                    }
                    target="_blank"
                    style={{ color: "blue" }}
                  >
                    Click here to view farm location
                  </a> */}
                  <button
                    onClick={() => this.setState({ isOpen: true })}
                    type="button"
                    className="btn btn-primary"
                  >
                    <i className="icon-diff"></i> Click here to view farm
                    location
                  </button>
                </div>
                <div className="col-sm-4">
                  <i>
                    <u>Note:</u> Location will be captured from Android App
                  </i>
                </div>
                <DialogWrapper
                  isOpen={this.state.isOpen}
                  toggle={() => this.setState({ isOpen: !this.state.isOpen })}
                  size="lg"
                  className="customeModel"
                >
                  <LocationMap
                    toggle={() => this.setState({ isOpen: !this.state.isOpen })}
                    Latitude={Latitude}
                    Longitude={Longitude}
                    mapHeader="Data Captured Location"
                  />
                </DialogWrapper>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <span className="mandatory">
                    All (*) marked fields are mandatory
                  </span>
                </div>
              </div>
              {/*<button
                        type="button"
                        onClick={this.handleSubmit}
                        className="btn btn-primary px-4 float-right"
                      >
                        Save
                      </button>*/}
              <div className="text-right" style={{ float: "right" }}>
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
                  {this.state.savedisabled ? "Please wait..." : "Save and Next"}
                </Button>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Button
                  color="warning"
                  onClick={this.handleNext.bind(this)}
                  style={nextBtnStyle}
                  className="farmerButtons"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </div>
    );
  }
}

export default FarmerProduction;
