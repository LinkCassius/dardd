import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { Card, Col, Row } from "reactstrap";
import { ApiEndPoints } from "../../config";
import ApprovalSetupTable from "./approvalSetupTable";
import DialogWrapper from "../../components/common/Dialog";
import Can from "../../components/common/Auth/Can";
import ApprovalSetupForm from "./approvalSetupForm";
import ListGroup from "../../components/common/listGroup";
import auth from "../../auth";
import Modal from "../../components/common/modalconfirm";

class ApprovalSetupList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,

      approvalAreas: [],
      selectedApprovalArea: {
        _id: "5eb914cfc36ca02d64c82d66",
        approvalAreaCode: "CS",
        approvalAreaName: "Contract Status",
      }, //first approval area

      approvalsetups: [],

      id: "new",
      isOpen: false,
      modal: false,
      approvalSetupObj: null,
    };
    this.getInitialData = this.getInitialData.bind(this);
  }

  getInitialData(selectedApprovalArea) {
    fetch(
      ApiEndPoints.approvalsetupList + "?approvalArea=" + selectedApprovalArea,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ approvalsetups: data.result, loading: false });
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

  getApprovalAreas() {
    fetch(ApiEndPoints.approvalAreaList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            approvalAreas: data.result,
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

  componentDidMount() {
    this.getApprovalAreas();
    this.getInitialData(this.state.selectedApprovalArea._id);
  }

  handleApprovalAreaSelect = (approvalArea) => {
    this.setState({
      selectedApprovalArea: approvalArea,
      approvalsetups: [],
      loading: true,
    });
    this.getInitialData(approvalArea._id);
  };

  handleToggle = (approvalSetupObj) => {
    this.setState({ modal: !this.state.modal, approvalSetupObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = async (approverSetupObj) => {
    const originalApprovalSetup = this.state.approvalsetups;
    // const filteredApprovalSetup = originalApprovalSetup.filter(
    //   (m) => m._id !== approverSetupObj._id
    // );
    this.setState({
      modal: false,
    });
    // if (approvalsetups.length <= this.state.per_page) {
    //   this.setState({
    //     page: 1,
    //   });
    // }
    try {
      fetch(ApiEndPoints.deleteapprovalsetup + "?id=" + approverSetupObj._id, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            NotificationManager.success(data.msg);

            this.getInitialData(this.state.selectedApprovalArea._id);
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
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
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        NotificationManager.error("Record has already been deleted");

      this.setState({ approvalsetups: originalApprovalSetup });
    }
  };

  render() {
    const {
      approvalsetups,
      selectedApprovalArea,
      approvalAreas,
      approvalSetupObj,
    } = this.state;
    let sequence = 0;
    let checkCount = approvalsetups.length;
    if (checkCount === 0) sequence = sequence + 1;
    else {
      sequence = Math.max.apply(
        Math,
        approvalsetups.map(function (o) {
          return o.sequence + 1;
        })
      );
    }
    const tableOptions = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false,
      filter: false,
      download: false,
      print: false,
      viewColumns: false,
      sort: false,
      search: false,
      customToolbar: () => {
        return (
          <Can
            perform="ApprovalSetup Add Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add Approval Level
              </button>
            )}
          />
        );
      },
    };
    return (
      <div>
        <Card>
          <Row>
            <Col xs="12" sm="6" lg="3">
              <ListGroup
                items={approvalAreas}
                selectedItem={selectedApprovalArea}
                onItemSelect={this.handleApprovalAreaSelect}
              />
            </Col>

            <Col xs="12" sm="6" lg="9">
              <ApprovalSetupTable
                loading={this.state.loading}
                approvalsetups={this.state.approvalsetups}
                onEdit={(id) => {
                  this.setState({ isOpen: true, id: id });
                }}
                tableOptions={tableOptions}
                deleteObject={approvalSetupObj}
                onDelete={this.handleToggle}
              />
            </Col>
          </Row>
        </Card>
        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="md"
          className="customeModel"
        >
          <ApprovalSetupForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() => this.getInitialData(selectedApprovalArea._id)}
            newSequence={sequence}
            selectedApprovalArea={selectedApprovalArea}
          />
        </DialogWrapper>
        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={approvalSetupObj}
          modalBody={
            approvalSetupObj &&
            " approval sequence - " + approvalSetupObj.sequence
          }
        />
      </div>
    );
  }
}

export default ApprovalSetupList;
