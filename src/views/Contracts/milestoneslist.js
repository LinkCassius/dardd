import React, { Component } from "react";
import {
  ApiEndPoints,
  masterConstants,
  siteConfig,
} from "../../config";
import MaterialDatatable from "material-datatable";
import Footer from "../../components/Footer/footer";
import Loader from "react-loader-spinner";
import TopNavbar from "../../components/Header/top.navbar";
const options = {
  filterType: "multiselect",
  responsive: "scroll",
  selectableRows: false,
};
class MilestonesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      contacts: [],
    };
  }
  componentDidMount() {
    var contractId = this.props.match.params.contractId;
    fetch(ApiEndPoints.milestonesList + "?contractId=" + contractId)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        this.setState({ contacts: data.result, loading: true });
      })
      .catch(console.log);
  }
  loaderDiv() {
    return this.state.loading === false ? (
      <span>
        <Loader type="ThreeDots" color="green" height={80} width={80} />
      </span>
    ) : (
      ""
    );
  }

  render() {
    const columns = [
      {
        name: "Milestone Name",
        title: "Milestone Name",
        field: "milestoneName",
      },
      {
        name: "Milestone Details",
        title: "Milestone Details",
        field: "milestoneDetails",
      },
      {
        name: "Start Date",
        title: "Start Date",
        field: "startDate",
        key: "startDate",
        options: {
          headerNoWrap: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return `${new Date(value.startDate * 1000).toLocaleString()}`;
          },
        },
        //render: rowData => new Date(rowData.startDate * 1000).toLocaleString()
      },
      {
        name: "End Date",
        title: "End Date",
        field: "endDate",
        key: "endDate",
        options: {
          headerNoWrap: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return `${new Date(value.endDate * 1000).toLocaleString()}`;
          },
        },
        //render: rowData => new Date(rowData.endDate * 1000).toLocaleString()
      },
      {
        name: "Supporting Doc",
        title: "Supporting Doc",
        field: "supportDoc",
        key: "status",
        filtering: false,
        options: {
          headerNoWrap: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return value.supportDoc ? (
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={siteConfig.imagesPath + value.supportDoc}
              >
                <i
                  style={{
                    "font-size": "25px",
                    padding: "5px",
                  }}
                  className="fa fa-file-code-o"
                ></i>
              </a>
            ) : (
              "NA"
            );
          },
        },
      },
      {
        name: "Status",
        title: "Status",
        field: "status",
        key: "status",
        options: {
          headerNoWrap: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return `${masterConstants.status[value.status]}`;
          },
        },
        //render: rowData => masterConstants.status[rowData.status]
      },
    ];
    return (
      <div>
        <TopNavbar />
        {/* Page content */}
        <div className="page-content">
          {/*<MainSidebar />*/}
          {/* Main content */}
          <div className="content-wrapper">
            {/* Page header */}
            {/*<PageHeader />*/}
            {/* /page header */}
            {/* Content area Dashboard */}
            <loaderDiv />
            <div className="content">
              <div className="card">
                <div className="card-body">
                  <div className="regbut">
                    <a href="/add-update-contract">
                      <button type="button" className="btn btn-success">
                        <i className="icon-diff"></i> Add New Contracts
                      </button>
                    </a>
                  </div>

                  <MaterialDatatable
                    striped
                    title={"Milestone Management"}
                    data={this.state.contacts}
                    columns={columns}
                    options={options}
                  />

                  {/*<MaterialTable
                  options={{
                    exportButton: true,
                    selection: true,
                    filtering: true,
                    headerStyle: {
                      backgroundColor: masterCons.tableHeaderBackColor,
                      color: "#FFF"
                    }
                   
                  }}
                  columns={columns}
                  data={this.state.contacts}
                  title={
                    <h1>
                      Milestones{" "}
                      <a href="/farmer-registration">
                        <button type="button" className="btn btn-info btn-md">
                          <i class="icon-diff"></i> Register New Farmer
                        </button>
                  </a>
                    </h1>
                  }
                />*/}
                </div>
              </div>
            </div>
            {/* /content area */}
            {/* Footer */}
            <Footer />
            {/* /footer */}
          </div>
          {/* /main content */}
        </div>
        {/* /page content */}
      </div>
    );
  }
}
/*const supportingDocList = props => {
  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper" className="m-5">
        <h1>supportingDoc Data</h1>
        <table class="table table-striped m-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Identity No</th>
              <th scope="col">Email</th>
              <th scope="col">Contact No</th>
              <th scope="col">Is Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
*/
export default MilestonesList;
