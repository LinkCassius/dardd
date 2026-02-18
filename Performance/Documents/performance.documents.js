import React, { Component } from "react";

import { NotificationManager } from "react-notifications";
import moment from "moment";

import Button from "../../../components/CustomButtons/Button.js";

import { ApiEndPoints } from "../../../config";
import Can from "../../../components/common/Auth/Can";
import PerformanceDocTable from "./performanceDocTable";
import PerformanceDocFileForm from "./performanceDocForm";
import DialogWrapper from "../../../components/common/Dialog";
import auth from "../../../auth";
import Modal from "../../../components/common/modalconfirm";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class PerformanceDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      documents: [],
      performanceId: "",
      name: "",
      docCollection: "",
      isFolder: "",
      parent: "",
      taskId: "",
      variationId: "",
      milestoneId: "",
      paymentId: "",
      status: "",
      id: "new",
      file: null,
      supportingDoc: null,
      uploading: false,
      uploadDate: currentDate,
      refId: "",
      refType: "",
      folder_isOpen: false,
      file_isOpen: false,
      movArray: [],
      perfRecord: [],

      modal: false,
      perfdocId: null,
    };
    this.getPerfDocumentsList = this.getPerfDocumentsList.bind(this);
  }
  handleCancel(event) {
    event.preventDefault();
    this.props.docToggle(this.state.documents.length > 0);
  }
  componentDidMount() {
    Promise.all([this.getPerfDocumentsList(), this.getMovData()]);

    const { performanceId, performance } = this.props;
    let filterPerfById = performance.filter((e) => e.perId === performanceId);
    this.setState({ perfRecord: filterPerfById });
  }
  getPerfDocumentsList() {
    const { performanceId } = this.props;
    if (performanceId !== "") {
      fetch(
        ApiEndPoints.performance_Document_List + "?perfid=" + performanceId,
        {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            this.setState({ documents: data.result, loading: false });
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
    } else {
      this.setState({ loading: false });
      this.props.docToggle(false);
      NotificationManager.error(
        "Please Save as Draft first Next upload documents"
      );
    }
  }

  getMovData() {
    const { performanceId } = this.props;

    fetch(ApiEndPoints.indicatorsList + "?indicatorId=" + performanceId, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            movArray: data.result[0].movArray,
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

  updateDocTable = (docId, currentApprover) => {
    const formpojo = {};

    formpojo.id = docId;
    formpojo.performanceId = this.props.performanceId;
    formpojo.currentApprover = currentApprover;

    if (currentApprover === "approverUser1") formpojo.apUser1HasDownload = true;
    if (currentApprover === "approverUser2") formpojo.apUser2HasDownload = true;
    if (currentApprover === "approverUser3") formpojo.apUser3HasDownload = true;

    fetch(
      ApiEndPoints.AddUpdatePerformance_Document +
        "?userid=" +
        auth.getCurrentUser()._id,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": auth.getJwt(),
        },
        body: JSON.stringify(formpojo),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          //NotificationManager.success("Document Downloaded Successfully");
          this.getPerfDocumentsList();
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (data && data.success === false) {
          this.setState({ responseError: data.msg });
          NotificationManager.error("Something went wrong");
        } else {
          this.setState({ responseError: data.msg });
        }
      })
      .catch("error", console.log);
  };

  download = (value, docId) => {
    const { performanceId, performance, reviewType } = this.props;
    if (reviewType === "approvals") {
      let filterPerfById = performance.filter((e) => e.perId === performanceId);

      let approvalsStatusFlag,
        currentApprover = "";

      approvalsStatusFlag = performance.find(
        (e) => e.currentApprovarStatus === "pending"
      );

      if (filterPerfById) {
        if (typeof approvalsStatusFlag === "undefined") {
          //do nothing
          console.log("do nothing");
        } else {
          //update doc table for the current approval user
          console.log("update doc table");
          currentApprover = filterPerfById[0].currentApprovar;
          this.updateDocTable(docId, currentApprover);
        }
      }
    }
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = value;
    a.download = value.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  handleToggle = (perfdocId) => {
    this.setState({ modal: !this.state.modal, perfdocId });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = async (perfdocId) => {
    const originalDocuments = this.state.documents;
    //const documents = originalDocuments.filter((m) => m._id !== perfdocId);
    this.setState({
      modal: false,
    });

    try {
      fetch(ApiEndPoints.delete_perfdocument + "?id=" + perfdocId, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            NotificationManager.success(data.msg);

            this.getPerfDocumentsList();
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 400
          ) {
            NotificationManager.error(data.msg);
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
        NotificationManager.error("Document has already been deleted");

      this.setState({ documents: originalDocuments });
    }
  };

  render() {
    const { performanceId } = this.props;
    const { perfdocId } = this.state;

    const tableOptions = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false,
      filter: false,
      download: false,
      print: false,
      search: false,
      viewColumns: false,
      sort: false,
      customToolbar: () => {
        return (
          <div>
            {this.props.reviewType === "self" && (
              <Can
                perform="File Add Access"
                yes={() => (
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      this.setState({ file_isOpen: true, id: "new" })
                    }
                    type="button"
                  >
                    <i className="fa fa-file"></i> <span>&nbsp;&nbsp;</span> Add
                    New File
                  </button>
                )}
              />
            )}
          </div>
        );
      },
    };

    return (
      <div>
        <PerformanceDocTable
          loading={this.state.loading}
          documents={this.state.documents}
          onEdit={(id) => {
            this.setState({ file_isOpen: true, id: id });
          }}
          onDelete={this.handleToggle}
          performanceId={performanceId}
          reviewType={this.props.reviewType}
          tableOptions={tableOptions}
          download={this.download}
          perfRecord={this.state.perfRecord}
        />
        <Button color="warning" onClick={this.handleCancel.bind(this)}>
          Back
        </Button>
        <DialogWrapper
          isOpen={this.state.file_isOpen}
          toggle={() => this.setState({ file_isOpen: !this.state.file_isOpen })}
          size="md"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <PerformanceDocFileForm
            toggle={() =>
              this.setState({ file_isOpen: !this.state.file_isOpen })
            }
            id={this.state.id}
            updateList={this.getPerfDocumentsList}
            performanceId={performanceId}
            movArray={this.state.movArray}
          />
        </DialogWrapper>

        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={perfdocId}
          modalBody={" the document "}
        />
      </div>
    );
  }
}

export default PerformanceDocument;
