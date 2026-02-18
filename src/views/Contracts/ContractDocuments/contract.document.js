import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import queryString from "query-string";
import { ApiEndPoints } from "../../../config";
import Can from "../../../components/common/Auth/Can";
import ContractDocTable from "./contractDocTable";
import ContractDocFolderForm from "./contractDocFolderForm";
import ContractDocFileForm from "./contractDocFileForm";
import DialogWrapper from "../../../components/common/Dialog";
import auth from "../../../auth";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractDocument extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      documents: [],
      contractId: "",
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

      contractName: "",

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,
    };
    this.getDocumentsList = this.getDocumentsList.bind(this);
  }

  componentDidMount() {
    this.getDocumentsList(this.state.per_page, 1, this.state.searchText);
  }

  getDocumentsList(per_page, page, searchText) {
    const { contractId, parent } = this.props.match.params;
    const parentId = parent ? parent : "";

    let refId = "";
    let refType = "";
    const values = queryString.parse(this.props.location.search);

    if (Object.getOwnPropertyNames(values).length === 0) {
      this.setState({ refId: "", refType: "" });
      refId = "";
      refType = "";
    } else {
      this.setState({ refId: values.refId, refType: values.refType });
      refId = values.refId;
      refType = values.refType;
    }

    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contract_Document_List +
        "/" +
        contractId +
        "/" +
        parentId +
        "?refId=" +
        refId +
        "&refType=" +
        refType +
        "&per_page=" +
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
            documents: data.result,
            contractName: data.contractName,
            totalRecCount: data.totalRecCount,
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

  changePage = (page) => {
    this.setState({ page });
    this.getDocumentsList(this.state.per_page, page, this.state.searchText);
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page });
    this.getDocumentsList(per_page, this.state.page, this.state.searchText);
  };

  search = (searchText) => {
    this.setState({ searchText });
    this.getDocumentsList(this.state.per_page, 1, searchText);
  };

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      count: this.state.totalRecCount,
      rowsPerPage: this.state.per_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.changePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.changeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.search(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <div>
            {/* {parentId === "" ? (
              ""
            ) : (
              <span>
                <button
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                  type="button"
                  className="btn btn-success"
                >
                  <i
                    className="fa fa-arrow-left"
                    style={{
                      color: "white",
                      fontSize: "13px",
                    }}
                  ></i>
                  <span>&nbsp;</span> Back
                </button>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            )} */}

            <Can
              perform="Folder Add Access"
              yes={() => (
                <button
                  onClick={() =>
                    this.setState({ folder_isOpen: true, id: "new" })
                  }
                  type="button"
                  className="btn btn-success"
                >
                  <i
                    className="fa fa-folder"
                    style={{
                      color: "#f7df05",
                    }}
                  ></i>
                  <span>&nbsp;&nbsp;</span> Add New Folder
                </button>
              )}
            />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Can
              perform="File Add Access"
              yes={() => (
                <button
                  onClick={() =>
                    this.setState({ file_isOpen: true, id: "new" })
                  }
                  type="button"
                  className="btn btn-success"
                >
                  <i className="fa fa-file"></i> <span>&nbsp;&nbsp;</span> Add
                  New File
                </button>
              )}
            />
          </div>
        );
      },
    };

    const { contractId, parent } = this.props.match.params;
    //const parentId = parent ? parent : "";

    const { refId, refType } = this.state;

    return (
      <div>
        <ContractDocTable
          loading={this.state.loading}
          documents={this.state.documents}
          onFolderEdit={(id) => {
            this.setState({ folder_isOpen: true, id: id });
          }}
          onEdit={(id) => {
            this.setState({ file_isOpen: true, id: id });
          }}
          contractId={contractId}
          refId={refId}
          refType={refType}
          parent={parent}
          contractName={this.state.contractName}
          tableOptions={tableOptions}
        />

        <DialogWrapper
          isOpen={this.state.folder_isOpen}
          toggle={() =>
            this.setState({ folder_isOpen: !this.state.folder_isOpen })
          }
          size="sm"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <ContractDocFolderForm
            toggle={() =>
              this.setState({ folder_isOpen: !this.state.folder_isOpen })
            }
            id={this.state.id}
            updateList={() =>
              this.getDocumentsList(
                this.state.per_page,
                1,
                this.state.searchText
              )
            }
            contractId={contractId}
            refId={refId}
            refType={refType}
            parent={parent}
          />
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.file_isOpen}
          toggle={() => this.setState({ file_isOpen: !this.state.file_isOpen })}
          size="md"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <ContractDocFileForm
            toggle={() =>
              this.setState({ file_isOpen: !this.state.file_isOpen })
            }
            id={this.state.id}
            updateList={() =>
              this.getDocumentsList(
                this.state.per_page,
                1,
                this.state.searchText
              )
            }
            contractId={contractId}
            refId={refId}
            refType={refType}
            parent={parent}
          />
        </DialogWrapper>
      </div>
    );
  }
}

export default ContractDocument;
