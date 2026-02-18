import React, { Component } from "react";
import { ApiEndPoints } from "../../config";
import TopNavbar from "../../components/Header/top.navbar";
import Footer from "../../components/Footer/footer";
import Can from "../../components/common/Auth/Can";
import commonhelpers from "../../helpers/commonHelper";
import BankForm from "./bankForm";
import BankTable from "./bankTable";
import DialogWrapper from "../../components/common/Dialog";
import { NotificationManager } from "react-notifications";
import auth from "../../auth";

class BankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      banks: [],
      id: "new",
      isOpen: false,
    };
    this.getInitialData = this.getInitialData.bind(this);
  }

  componentDidMount() {
    this.getInitialData();
  }

  getInitialData() {
    fetch(ApiEndPoints.bankList + "?parent=bank", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ banks: data.result, loading: false });
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

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      //serverSide: true,
      selectableRows: false,
      customToolbar: () => {
        return (
          <Can
            perform="Bank Add Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New Bank
              </button>
            )}
          />
        );
      },
    };

    return (
      <div>
        <BankTable
          loading={this.state.loading}
          banks={this.state.banks}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <BankForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={this.getInitialData}
          />
        </DialogWrapper>
      </div>
    );
  }
}
export default BankList;
