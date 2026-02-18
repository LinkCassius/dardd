import React from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import Loader from "react-loader-spinner";
import { ApiEndPoints } from "../../config";
import Can from "../../components/common/Auth/Can";
import { check } from "./../../utils/authHelper";
import FormFunc from "../../components/common/formfunc";
import DialogWrapper from "../../components/common/Dialog";
import ContractTaskForm from "../Contracts/ContractTasks/contractTaskForm";
import ContractTaskTable from "../Contracts/ContractTasks/contractTaskTable";
import ContractVarForm from "../Contracts/ContractVariations/contractVarForm";
import ContractVarTable from "../Contracts/ContractVariations/contractVarTable";
import ContractMileForm from "../Contracts/ContractMilestones/contractMileForm";
import ContractMileTable from "../Contracts/ContractMilestones/contractMileTable";
import ContractPayForm from "../Contracts/ContractPayments/contractPayForm";
import ContractPayTable from "../Contracts/ContractPayments/contractPayTable";
import ContractDimForm from "../Contracts/ContractDimensions/contractDimForm";
import ContractDimTable from "../Contracts/ContractDimensions/contractDimTable";
import AlertTable from "../Contracts/alertTable";
import ContractOverview from "../Contracts/contractOverview";
import auth from "../../auth";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FlagIcon from "@material-ui/icons/Flag";

import PaymentIcon from "@material-ui/icons/Payment";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import ContractApprovalRemarksTable from "./contractApprRemarksTable";
const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractDetail extends FormFunc {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      responseError: "",

      contractName: "",
      contractNumber: "",
      projectNumber: "",
      serviceProvider: "",
      startDate: currentDate,
      endDate: currentDate,
      contractValue: "",
      contractTypeId: "",
      contractType: "",
      contractDetail: "",
      extension: "",
      contractStatus: "",
      contractStatusName: "",
      variationApproved: "",
      id: "",
      isRetentionApplicable: false,

      contractStatus_ApprValue: "",
      contractStatus_LastUpdated: "",
      contractStatus_ApprStatus: "",
      contractStatus_ApprSequence: "",
      startDate_Extension: "",
      endDate_Extension: "",
      endDate_ApprValue: "",
      endDate_LastUpdated: "",
      endDate_ApprStatus: "",
      endDate_ApprSequence: "",

      alerts: [],
      tasks: [],
      variations: [],
      milestones: [],
      payments: [],
      dimensions: [],

      task_isOpen: false,
      variation_isOpen: false,
      milestone_isOpen: false,
      payment_isOpen: false,
      dimension_isOpen: false,
      contractId: "",

      taskTotalRecCount: 0,
      taskSearchText: "",
      taskPer_page: 10,
      taskPage: 1,

      variationTotalRecCount: 0,
      variationSearchText: "",
      variationPer_page: 10,
      variationPage: 1,

      milestoneTotalRecCount: 0,
      milestoneSearchText: "",
      milestonePer_page: 10,
      milestonePage: 1,

      paymentTotalRecCount: 0,
      paymentSearchText: "",
      paymentPer_page: 10,
      paymentPage: 1,

      dimensionTotalRecCount: 0,
      dimensionSearchText: "",
      dimensionPer_page: 10,
      dimensionPage: 1,

      activeIndex: 0,

      apprHistById: [],
      remarks_isOpen: false,
      approvalHistoryTotalRecCount: 0,
    };

    this.getTasksList = this.getTasksList.bind(this);
    this.getVariationsList = this.getVariationsList.bind(this);
    this.getMilestonesList = this.getMilestonesList.bind(this);
    this.getPaymentsList = this.getPaymentsList.bind(this);
    this.getDimensionsList = this.getDimensionsList.bind(this);
    this.getContractOverView = this.getContractOverView.bind(this);
  }

  componentDidMount() {
    this.getContractOverView(this.props.match.params.contractId);

    if (check("Dashboard Contract Alerts View Access")) {
      this.setState({ activeIndex: 0 });
      this.getAlertsList(this.props.match.params.contractId);
    }

    if (check("Contract Task View Access"))
      if (check("Dashboard Contract Alerts View Access") === false) {
        this.setState({ activeIndex: 1 });
      }
    this.getTasksList(
      this.props.match.params.contractId,
      this.state.taskPer_page,
      1,
      this.state.taskSearchText
    );

    if (check("Contract Variation View Access"))
      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Contract Task View Access") === false
      ) {
        this.setState({ activeIndex: 2 });
      }
    this.getVariationsList(
      this.props.match.params.contractId,
      this.state.variationPer_page,
      1,
      this.state.variationSearchText
    );
    if (check("Contract Milestone View Access"))
      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Contract Task View Access") === false &&
        check("Contract Variation View Access") === false
      ) {
        this.setState({ activeIndex: 3 });
      }
    this.getMilestonesList(
      this.props.match.params.contractId,
      this.state.milestonePer_page,
      1,
      this.state.milestoneSearchText
    );
    if (check("Contract Payment View Access"))
      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Contract Task View Access") === false &&
        check("Contract Variation View Access") === false &&
        check("Contract Milestone View Access") === false
      ) {
        this.setState({ activeIndex: 4 });
      }
    this.getPaymentsList(
      this.props.match.params.contractId,
      this.state.paymentPer_page,
      1,
      this.state.paymentSearchText
    );
    if (check("Contract Dimension View Access"))
      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Contract Task View Access") === false &&
        check("Contract Variation View Access") === false &&
        check("Contract Milestone View Access") === false &&
        check("Contract Payment View Access") === false
      ) {
        this.setState({ activeIndex: 5 });
      }
    this.getDimensionsList(
      this.props.match.params.contractId,
      this.state.dimensionPer_page,
      1,
      this.state.dimensionSearchText
    );

    this.setState({ contractId: this.props.match.params.contractId });
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.match.params.contractId !== this.props.match.params.contractId
    ) {
      this.setState({ contractId: newProps.match.params.contractId });

      this.getContractOverView(newProps.match.params.contractId);
      if (check("Dashboard Contract Alerts View Access")) {
        this.setState({ activeIndex: 0 });
        this.getAlertsList(newProps.match.params.contractId);
      }

      if (check("Contract Task View Access"))
        if (check("Dashboard Contract Alerts View Access") === false) {
          this.setState({ activeIndex: 1 });
        }
      this.getTasksList(
        newProps.match.params.contractId,
        this.state.taskPer_page,
        1,
        this.state.taskSearchText
      );
      if (check("Contract Variation View Access"))
        if (
          check("Dashboard Contract Alerts View Access") === false &&
          check("Contract Task View Access") === false
        ) {
          this.setState({ activeIndex: 2 });
        }
      this.getVariationsList(
        newProps.match.params.contractId,
        this.state.variationPer_page,
        1,
        this.state.variationSearchText
      );
      if (check("Contract Milestone View Access"))
        if (
          check("Dashboard Contract Alerts View Access") === false &&
          check("Contract Task View Access") === false &&
          check("Contract Variation View Access") === false
        ) {
          this.setState({ activeIndex: 3 });
        }
      this.getMilestonesList(
        newProps.match.params.contractId,
        this.state.milestonePer_page,
        1,
        this.state.milestoneSearchText
      );
      if (check("Contract Payment View Access"))
        if (
          check("Dashboard Contract Alerts View Access") === false &&
          check("Contract Task View Access") === false &&
          check("Contract Variation View Access") === false &&
          check("Contract Milestone View Access") === false
        ) {
          this.setState({ activeIndex: 4 });
        }
      this.getPaymentsList(
        newProps.match.params.contractId,
        this.state.paymentPer_page,
        1,
        this.state.paymentSearchText
      );
      if (check("Contract Dimension View Access"))
        if (
          check("Dashboard Contract Alerts View Access") === false &&
          check("Contract Task View Access") === false &&
          check("Contract Variation View Access") === false &&
          check("Contract Milestone View Access") === false &&
          check("Contract Payment View Access") === false
        ) {
          this.setState({ activeIndex: 5 });
        }
      this.getDimensionsList(
        newProps.match.params.contractId,
        this.state.dimensionPer_page,
        1,
        this.state.dimensionSearchText
      );

      this.setState({ contractId: newProps.match.params.contractId });
    }
  }
  getContractOverView(contractId) {
    if (contractId) {
      fetch(ApiEndPoints.contractList + "?contractId=" + contractId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            this.setState({
              contractName: data.result[0].contractName,
              contractNumber: data.result[0].contractNumber,
              projectNumber: data.result[0].projectNumber,
              serviceProvider: data.result[0].serviceProvider,
              startDate: moment(data.result[0].startDate * 1000).format(
                "DD/MM/YYYY"
              ),
              startDate_Extension: moment(
                data.result[0].startDate * 1000
              ).format("YYYY-MM-DD"),
              endDate: moment(data.result[0].endDate * 1000).format(
                "DD/MM/YYYY"
              ),
              endDate_Extension: moment(data.result[0].endDate * 1000).format(
                "YYYY-MM-DD"
              ),
              contractValue: data.result[0].contractValue,
              contractTypeId: data.result[0].contractType._id,
              contractType: data.result[0].contractType.cndName,
              contractStatus: data.result[0].contractStatus._id,
              contractStatusName: data.result[0].contractStatus.cndName,
              variationApproved: data.result[0].variationApproved,
              extension: data.result[0].extension,
              isRetentionApplicable: data.result[0].isRetentionApplicable,

              contractDetail: data.result[0].contractDetail,

              status: data.result[0].status,
              id: data.result[0]._id,
              variationApprovedAmount:
                data.result[0].contractValue *
                (data.result[0].variationApproved / 100),

              contractStatus_ApprValue: data.result[0].contractStatus_ApprValue,
              contractStatus_LastUpdated:
                data.result[0].contractStatus_LastUpdated,
              contractStatus_ApprStatus:
                data.result[0].contractStatus_ApprStatus,
              contractStatus_ApprSequence:
                data.result[0].contractStatus_ApprSequence,
              endDate_ApprValue:
                data.result[0].endDate_ApprValue &&
                data.result[0].endDate_ApprValue !== null
                  ? moment(data.result[0].endDate_ApprValue * 1000).format(
                      "YYYY-MM-DD"
                    )
                  : null,
              endDate_LastUpdated: data.result[0].endDate_LastUpdated,
              endDate_ApprStatus: data.result[0].endDate_ApprStatus,
              endDate_ApprSequence: data.result[0].endDate_ApprSequence,

              loading: false,
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

  getAlertsList(contractId) {
    fetch(ApiEndPoints.alerts + "/" + contractId, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ alerts: data.result, loading: false });
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

  getTasksList(contractId, per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.taskList +
        "/" +
        contractId +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            tasks: data.result,
            taskTotalRecCount: data.totalRecCount,
            loading: false,
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

  getVariationsList(contractId, per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contract_Variation_List +
        "/" +
        contractId +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          var totalVariationAmount = data.result.reduce(function (prev, cur) {
            return prev + cur.amount;
          }, 0);
          this.setState({
            variations: data.result,
            variationTotalRecCount: data.totalRecCount,
            totalVariationAmount,
            loading: false,
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

  getMilestonesList(contractId, per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contract_Milestone_List +
        "/" +
        contractId +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            milestones: data.result,
            milestoneTotalRecCount: data.totalRecCount,
            loading: false,
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

  getPaymentsList(contractId, per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contract_Payment_List +
        "/" +
        contractId +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            payments: data.result,
            paymentTotalRecCount: data.totalRecCount,
            loading: false,
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

  getDimensionsList(contractId, per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contract_Dimension_List +
        "/" +
        contractId +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            dimensions: data.result,
            dimensionTotalRecCount: data.totalRecCount,
            loading: false,
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

  taskChangePage = (page) => {
    this.setState({ taskPage: page });
    this.getTasksList(
      this.state.contractId,
      this.state.taskPer_page,
      page,
      this.state.taskSearchText
    );
  };

  taskChangeRowsPerPage = (per_page) => {
    this.setState({ taskPer_page: per_page });
    this.getTasksList(
      this.state.contractId,
      per_page,
      this.state.taskPage,
      this.state.taskSearchText
    );
  };

  taskSearch = (searchText) => {
    this.setState({ taskSearchText: searchText });
    this.getTasksList(
      this.state.contractId,
      this.state.taskPer_page,
      1,
      searchText
    );
  };

  variationChangePage = (page) => {
    this.setState({ variationPage: page });
    this.getVariationsList(
      this.state.contractId,
      this.state.variationPer_page,
      page,
      this.state.variationSearchText
    );
  };

  variationChangeRowsPerPage = (per_page) => {
    this.setState({ variationPer_page: per_page });
    this.getVariationsList(
      this.state.contractId,
      per_page,
      this.state.variationPage,
      this.state.variationSearchText
    );
  };

  variationSearch = (searchText) => {
    this.setState({ variationSearchText: searchText });
    this.getVariationsList(
      this.state.contractId,
      this.state.variationPer_page,
      1,
      searchText
    );
  };

  milestoneChangePage = (page) => {
    this.setState({ milestonePage: page });
    this.getMilestonesList(
      this.state.contractId,
      this.state.milestonePer_page,
      page,
      this.state.milestoneSearchText
    );
  };

  milestoneChangeRowsPerPage = (per_page) => {
    this.setState({ milestonePer_page: per_page });
    this.getMilestonesList(
      this.state.contractId,
      per_page,
      this.state.milestonePage,
      this.state.milestoneSearchText
    );
  };

  milestoneSearch = (searchText) => {
    this.setState({ milestoneSearchText: searchText });
    this.getMilestonesList(
      this.state.contractId,
      this.state.milestonePer_page,
      1,
      searchText
    );
  };

  paymentChangePage = (page) => {
    this.setState({ paymentPage: page });
    this.getPaymentsList(
      this.state.contractId,
      this.state.paymentPer_page,
      page,
      this.state.paymentSearchText
    );
  };

  paymentChangeRowsPerPage = (per_page) => {
    this.setState({ paymentPer_page: per_page });
    this.getPaymentsList(
      this.state.contractId,
      per_page,
      this.state.paymentPage,
      this.state.paymentSearchText
    );
  };

  paymentSearch = (searchText) => {
    this.setState({ paymentSearchText: searchText });
    this.getPaymentsList(
      this.state.contractId,
      this.state.paymentPer_page,
      1,
      searchText
    );
  };

  dimensionChangePage = (page) => {
    this.setState({ dimensionPage: page });
    this.getDimensionsList(
      this.state.contractId,
      this.state.dimensionPer_page,
      page,
      this.state.dimensionSearchText
    );
  };

  dimensionChangeRowsPerPage = (per_page) => {
    this.setState({ dimensionPer_page: per_page });
    this.getDimensionsList(
      this.state.contractId,
      per_page,
      this.state.dimensionPage,
      this.state.dimensionSearchText
    );
  };

  dimensionSearch = (searchText) => {
    this.setState({ dimensionSearchText: searchText });
    this.getDimensionsList(
      this.state.contractId,
      this.state.dimensionPer_page,
      1,
      searchText
    );
  };

  handleChange = (event, activeIndex) => {
    this.setState({ activeIndex });

    if (activeIndex === 0) {
      this.getAlertsList(this.state.contractId);
    }
    if (activeIndex === 1) {
      this.getTasksList(
        this.state.contractId,
        this.state.taskPer_page,
        1,
        this.state.taskSearchText
      );
    }
    if (activeIndex === 2) {
      this.getVariationsList(
        this.state.contractId,
        this.state.variationPer_page,
        1,
        this.state.variationSearchText
      );
    }
    if (activeIndex === 3) {
      this.getMilestonesList(
        this.state.contractId,
        this.state.milestonePer_page,
        1,
        this.state.milestoneSearchText
      );
    }
    if (activeIndex === 4) {
      this.getPaymentsList(
        this.state.contractId,
        this.state.paymentPer_page,
        1,
        this.state.paymentSearchText
      );
    }
    if (activeIndex === 5) {
      this.getDimensionsList(
        this.state.contractId,
        this.state.dimensionPer_page,
        1,
        this.state.dimensionSearchText
      );
    }
  };

  getApprovalRecordsById(id) {
    fetch(ApiEndPoints.approvalhistorybyappid + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            apprHistById: data.result,
            remarks_isOpen: true,
            approvalHistoryTotalRecCount: data.totalRecCount,
            loading: false,
          });
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
  }

  render() {
    const taskTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.taskTotalRecCount,
      rowsPerPage: this.state.taskPer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.taskChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.taskChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.taskSearch(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <Can
            perform="Contract Task Add Access"
            yes={() => (
              <button
                type="submit"
                onClick={() => this.setState({ task_isOpen: true, id: "new" })}
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New Task
              </button>
            )}
          />
        );
      },
    };

    const variationsTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.variationTotalRecCount,
      rowsPerPage: this.state.variationPer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.variationChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.variationChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.variationSearch(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <Can
            perform="Contract Variation Add Access"
            yes={() => (
              <button
                type="submit"
                onClick={() =>
                  this.setState({
                    variation_isOpen: true,
                    id: "new",
                  })
                }
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New Variation
              </button>
            )}
          />
        );
      },
    };

    const milestonesTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.milestoneTotalRecCount,
      rowsPerPage: this.state.milestonePer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.milestoneChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.milestoneCangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.milestoneSearch(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <React.Fragment>
            {contractStatusName === "Planning" ||
            contractStatusName === "On-Hold" ||
            contractStatusName === "Dispute" ? (
              <span style={{ width: "100%", color: "red", fontSize: "13px" }}>
                Cannot add a milestone for Planning/On-Hold/Dispute contracts
              </span>
            ) : (
              <Can
                perform="Contract Milestone Add Access"
                yes={() => (
                  <button
                    type="submit"
                    onClick={() =>
                      this.setState({
                        milestone_isOpen: true,
                        id: "new",
                      })
                    }
                    className="btn btn-success"
                  >
                    <i className="icon-diff"></i> Add New Milestone
                  </button>
                )}
              />
            )}
          </React.Fragment>
        );
      },
    };

    const paymentsTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.paymentTotalRecCount,
      rowsPerPage: this.state.paymentPer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.paymentChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.paymentChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.paymentSearch(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <React.Fragment>
            {contractStatusName === "Planning" ||
            contractStatusName === "On-Hold" ||
            contractStatusName === "Dispute" ? (
              <span style={{ width: "100%", color: "red", fontSize: "13px" }}>
                Cannot add a payment for Planning/On-Hold/Dispute contracts
              </span>
            ) : (
              <Can
                perform="Contract Payment Add Access"
                yes={() => (
                  <button
                    type="submit"
                    onClick={() =>
                      this.setState({
                        payment_isOpen: true,
                        id: "new",
                      })
                    }
                    className="btn btn-success"
                  >
                    <i className="icon-diff"></i> Add New Payment
                  </button>
                )}
              />
            )}
          </React.Fragment>
        );
      },
    };

    const dimensionsTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.dimensionTotalRecCount,
      rowsPerPage: this.state.dimensionPer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.dimensionChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.dimensionChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.dimensionSearch(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <Can
            perform="Contract Dimension Add Access"
            yes={() => (
              <button
                type="submit"
                onClick={() =>
                  this.setState({
                    dimension_isOpen: true,
                    id: "new",
                  })
                }
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New Programme
              </button>
            )}
          />
        );
      },
    };

    const approvaltableOptions = {
      filterType: "multiselect",
      search: false,
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      viewColumns: false,
      print: false,
      sort: false,
      count: this.state.approvalHistoryTotalRecCount,
      rowsPerPage: 100,
    };

    const {
      responseError,
      contractName,
      contractNumber,
      projectNumber,
      serviceProvider,
      startDate,
      endDate,
      contractValue,
      contractType,
      contractStatus,
      contractStatusName,
      isRetentionApplicable,
      variationApproved,
      contractId,

      contractStatus_ApprValue,
      contractStatus_LastUpdated,
      contractStatus_ApprStatus,
      contractStatus_ApprSequence,
      startDate_Extension,
      endDate_Extension,
      endDate_ApprValue,
      endDate_LastUpdated,
      endDate_ApprStatus,
      endDate_ApprSequence,
    } = this.state;

    //permission to View
    const CanViewAlerts = check("Dashboard Contract Alerts View Access")
      ? {}
      : { display: "none" };
    const CanViewTask = check("Contract Task View Access")
      ? {}
      : { display: "none" };
    const CanViewVariations = check("Contract Variation View Access")
      ? {}
      : { display: "none" };
    const CanViewMilestones = check("Contract Milestone View Access")
      ? {}
      : { display: "none" };
    // const CanViewPayments = check("Contract Payment View Access")
    //   ? {}
    //   : { display: "none" };
    const CanViewDimensions = check("Contract Dimension View Access")
      ? {}
      : { display: "none" };

    const CheckOtherTabs =
      check("Dashboard Contract Alerts View Access") ||
      check("Contract Task View Access") ||
      check("Contract Variation View Access") ||
      check("Contract Milestone View Access") ||
      check("Contract Payment View Access") ||
      check("Contract Dimension View Access")
        ? {}
        : { display: "none" };

    const checkAllTabs =
      check("Dashboard Contract Alerts View Access") ||
      check("Contract Task View Access") ||
      check("Contract Variation View Access") ||
      check("Contract Milestone View Access") ||
      check("Contract Payment View Access") ||
      check("Contract Dimension View Access")
        ? "block"
        : "none";

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <h6>
              Contract Name :{" "}
              <strong>
                {this.state.loading === true ? (
                  <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={30}
                    width={30}
                  />
                ) : (
                  contractName
                )}
              </strong>
            </h6>

            <div className="col-sm-12" style={{ textAlign: "right" }}>
              <strong>Contract Documents:</strong>{" "}
              <a target="_blank" href={"#/contract-document/" + contractId}>
                <i
                  style={{
                    fontSize: "25px",
                    color: "#2196f3",
                  }}
                  title="Documents"
                  className="fa fa-folder"
                ></i>
              </a>
            </div>
            <span className="error-msg">{responseError}</span>

            <h5>Overview</h5>

            {/* overview */}
            <ContractOverview
              contractId={contractId}
              contractName={contractName}
              contractNumber={contractNumber}
              projectNumber={projectNumber}
              startDate={startDate}
              endDate={endDate}
              contractValue={contractValue}
              contractType={contractType}
              variationApproved={variationApproved}
              contractStatus={contractStatus}
              contractStatusName={contractStatusName}
              serviceProvider={serviceProvider}
              contractStatus_ApprValue={
                contractStatus_ApprValue == null ? "" : contractStatus_ApprValue
              }
              contractStatus_LastUpdated={
                contractStatus_LastUpdated == null
                  ? "NA"
                  : contractStatus_LastUpdated
              }
              contractStatus_ApprStatus={
                contractStatus_ApprStatus == null
                  ? "NA"
                  : contractStatus_ApprStatus.cndName
              }
              contractStatus_ApprSequence={
                contractStatus_ApprSequence == null
                  ? "NA"
                  : contractStatus_ApprSequence
              }
              startDate_Extension={startDate_Extension}
              endDate_Extension={endDate_Extension}
              endDate_ApprValue={
                endDate_ApprValue == null ? "" : endDate_ApprValue
              }
              endDate_LastUpdated={
                endDate_LastUpdated == null ? "NA" : endDate_LastUpdated
              }
              endDate_ApprStatus={
                endDate_ApprStatus == null ? "NA" : endDate_ApprStatus.cndName
              }
              endDate_ApprSequence={
                endDate_ApprSequence == null ? "NA" : endDate_ApprSequence
              }
              updateList={() => this.getContractOverView(contractId)}
            />

            <hr />

            <Paper
              square
              style={{
                flexGrow: 1,
                display: checkAllTabs,
              }}
            >
              <Tabs
                value={this.state.activeIndex}
                onChange={this.handleChange}
                //variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="icon label tabs example"
                variant="scrollable"
              >
                <Tab
                  icon={<NotificationsActiveIcon />}
                  label="Alerts"
                  style={CanViewAlerts}
                />
                <Tab
                  icon={<AssignmentTurnedInIcon />}
                  label="Tasks"
                  style={CanViewTask}
                />
                <Tab
                  icon={<VerticalSplitIcon />}
                  label="Variations"
                  style={CanViewVariations}
                />
                <Tab
                  icon={<FlagIcon />}
                  label="Milestones"
                  style={CanViewMilestones}
                />
                <Tab
                  icon={<PaymentIcon />}
                  label="Payments"
                  style={CanViewMilestones}
                />
                <Tab
                  icon={<LocalActivityIcon />}
                  label="Programmes"
                  style={CanViewDimensions}
                />
              </Tabs>
            </Paper>
            <TabPanel
              value={this.state.activeIndex}
              index={0}
              style={CheckOtherTabs}
            >
              <AlertTable
                loading={this.state.loading}
                alerts={this.state.alerts}
              />
            </TabPanel>
            <TabPanel
              value={this.state.activeIndex}
              index={1}
              style={CheckOtherTabs}
            >
              <ContractTaskTable
                loading={this.state.loading}
                tasks={this.state.tasks}
                onEdit={(id) => {
                  this.setState({ task_isOpen: true, id: id });
                }}
                tableOptions={taskTableOptions}
              />
            </TabPanel>
            <TabPanel
              value={this.state.activeIndex}
              index={2}
              style={CheckOtherTabs}
            >
              <ContractVarTable
                loading={this.state.loading}
                variations={this.state.variations}
                onEdit={(id) => {
                  this.setState({ variation_isOpen: true, id: id });
                }}
                tableOptions={variationsTableOptions}
                onRemarksOpen={(id) => this.getApprovalRecordsById(id)}
              />
            </TabPanel>
            <TabPanel
              value={this.state.activeIndex}
              index={3}
              style={CheckOtherTabs}
            >
              <ContractMileTable
                loading={this.state.loading}
                milestones={this.state.milestones}
                onEdit={(id) => {
                  this.setState({ milestone_isOpen: true, id: id });
                }}
                tableOptions={milestonesTableOptions}
                onRemarksOpen={(id) => this.getApprovalRecordsById(id)}
              />
            </TabPanel>
            <TabPanel
              value={this.state.activeIndex}
              index={4}
              style={CheckOtherTabs}
            >
              <ContractPayTable
                loading={this.state.loading}
                payments={this.state.payments}
                onEdit={(id) => {
                  this.setState({ payment_isOpen: true, id: id });
                }}
                tableOptions={paymentsTableOptions}
                onRemarksOpen={(id) => this.getApprovalRecordsById(id)}
              />
            </TabPanel>
            <TabPanel
              value={this.state.activeIndex}
              index={5}
              style={CheckOtherTabs}
            >
              <ContractDimTable
                loading={this.state.loading}
                dimensions={this.state.dimensions}
                onEdit={(id) => {
                  this.setState({ dimension_isOpen: true, id: id });
                }}
                tableOptions={dimensionsTableOptions}
              />
            </TabPanel>
          </div>
        </div>

        {/* task form */}
        <DialogWrapper
          isOpen={this.state.task_isOpen}
          toggle={() => this.setState({ task_isOpen: !this.state.task_isOpen })}
          size="lg"
          className="customeModel"
        >
          <ContractTaskForm
            toggle={() =>
              this.setState({ task_isOpen: !this.state.task_isOpen })
            }
            id={this.state.id}
            updateList={() =>
              this.getTasksList(
                contractId,
                this.state.taskPer_page,
                1,
                this.state.taskSearchText
              )
            }
            contractId={contractId}
            startDate={startDate}
            endDate={endDate}
            startDate_Extension={startDate_Extension}
            endDate_Extension={endDate_Extension}
          />
        </DialogWrapper>

        {/* variation form */}
        <DialogWrapper
          isOpen={this.state.variation_isOpen}
          toggle={() =>
            this.setState({
              variation_isOpen: !this.state.variation_isOpen,
            })
          }
          size="md"
          className="customeModel"
        >
          <ContractVarForm
            toggle={() =>
              this.setState({
                variation_isOpen: !this.state.variation_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getVariationsList(
                contractId,
                this.state.variationPer_page,
                1,
                this.state.variationSearchText
              )
            }
            contractId={contractId}
            startDate_Extension={startDate_Extension}
            endDate_Extension={endDate_Extension}
            contractName={contractName}
            contractNumber={contractNumber}
            contractValue={contractValue}
            variationApproved={variationApproved}
            variations={this.state.variations}
          />
        </DialogWrapper>

        {/* milestone form */}
        <DialogWrapper
          isOpen={this.state.milestone_isOpen}
          toggle={() =>
            this.setState({
              milestone_isOpen: !this.state.milestone_isOpen,
            })
          }
          size="lg"
          className="customeModel"
        >
          <ContractMileForm
            toggle={() =>
              this.setState({
                milestone_isOpen: !this.state.milestone_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getMilestonesList(
                contractId,
                this.state.milestonePer_page,
                1,
                this.state.milestoneSearchText
              )
            }
            contractId={contractId}
            startDate={startDate}
            endDate={endDate}
            startDate_Extension={startDate_Extension}
            endDate_Extension={endDate_Extension}
            contractName={contractName}
            contractNumber={contractNumber}
            contractValue={contractValue}
            milestones={this.state.milestones}
            isRetentionApplicable={isRetentionApplicable}
          />
        </DialogWrapper>

        {/* payment form */}
        <DialogWrapper
          isOpen={this.state.payment_isOpen}
          toggle={() =>
            this.setState({
              payment_isOpen: !this.state.payment_isOpen,
            })
          }
          size="md"
          className="customeModel"
        >
          <ContractPayForm
            toggle={() =>
              this.setState({
                payment_isOpen: !this.state.payment_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getPaymentsList(
                contractId,
                this.state.paymentPer_page,
                1,
                this.state.paymentSearchText
              )
            }
            contractId={contractId}
            contractName={contractName}
            contractNumber={contractNumber}
            payments={this.state.payments}
            startDate_Extension={startDate_Extension}
          />
        </DialogWrapper>

        {/* dimension form */}
        <DialogWrapper
          isOpen={this.state.dimension_isOpen}
          toggle={() =>
            this.setState({
              dimension_isOpen: !this.state.dimension_isOpen,
            })
          }
          size="md"
          className="customeModel"
        >
          <ContractDimForm
            toggle={() =>
              this.setState({
                dimension_isOpen: !this.state.dimension_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getDimensionsList(
                contractId,
                this.state.dimensionPer_page,
                1,
                this.state.dimensionSearchText
              )
            }
            contractId={contractId}
          />
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.remarks_isOpen}
          toggle={() =>
            this.setState({ remarks_isOpen: !this.state.remarks_isOpen })
          }
          size="lg"
          className="customeModel"
        >
          <ContractApprovalRemarksTable
            loading={this.state.loading}
            apprHistById={this.state.apprHistById}
            onEdit={(id) => {
              this.setState({ remarks_isOpen: true, id: id });
            }}
            tableOptions={approvaltableOptions}
            toggle={() =>
              this.setState({
                remarks_isOpen: !this.state.remarks_isOpen,
              })
            }
          />
        </DialogWrapper>
      </div>
    );
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default ContractDetail;
