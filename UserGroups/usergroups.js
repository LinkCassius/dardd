import React, { Component } from "react";
import { ApiEndPoints } from "../../config";
import commonhelpers from "../../helpers/commonHelper";
import Footer from "../../components/Footer/footer";
import TopNavbar from "../../components/Header/top.navbar";
import UserGroupTable from "./userGroupTable";
import DialogWrapper from "../../components/common/Dialog";
import Can from "../../components/common/Auth/Can";
import UserGroupForm from "./userGroupForm";
import auth from "../../auth";
import { NotificationManager } from "react-notifications";
import WidgetModal from "../../components/common/widgetModal";

class UserGroupList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      usergroups: [],
      id: "new",
      isOpen: false,
    };
    this.getInitialData = this.getInitialData.bind(this);
  }

  getInitialData() {
    fetch(ApiEndPoints.userGroupList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ usergroups: data.result, loading: false });
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
    // commonhelpers.captureLogActivity(
    //   "Usergroups List Viewed",
    //   "View",
    //   "Usergroups",
    //   "Usergroup List",
    //   window.location.href,
    //   "Usergroups list viewed by " + localStorage.getItem("userName")
    // );
    this.getInitialData();
  }

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      //serverSide: true,
      selectableRows: false,
      viewColumns: false,
      sort: false,
      customToolbar: () => {
        return (
          <Can
            perform="Create Role Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New Role
              </button>
            )}
          />
        );
      },
    };

    return (
      <div>
        <UserGroupTable
          loading={this.state.loading}
          usergroups={this.state.usergroups}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          className="customeModel"
        >
          <UserGroupForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={this.getInitialData}
          />
        </DialogWrapper>
        {/* <WidgetModal
                widgetModal={widgetModal}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
                widgetCheck={data.widgetCheck}
                widgets={this.state.widgetData}
                toggle={this.toggleWidget}
                key={1}
              ></WidgetModal> */}
      </div>
    );
  }
}

export default UserGroupList;
