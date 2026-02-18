import React from "react";

const CnDList = React.lazy(() => import("./views/CnD/cnds"));

const DashboardDesign = React.lazy(() =>
  import("./views/Dashboard/dashboard.design")
);
//const Dashboard = React.lazy(() => import("./views/Dashboard/dashboard"));
const FarmersList = React.lazy(() => import("./views/Farmers/farmerslist"));

const ContractList = React.lazy(() => import("./views/Contracts/contractlist"));
const ContractServiceProviders = React.lazy(() =>
  import("./views/Contracts/ContractServiceProviders/contractServiceProviders")
);
const ContractReport = React.lazy(() =>
  import("./views/Reports/ContractReport/contractReport")
);
const RetentionRegister = React.lazy(() =>
  import("./views/Reports/RetentionReport/retentionList")
);
const MilestonesList = React.lazy(() =>
  import("./views/Contracts/milestoneslist")
);

const FarmerRegistration = React.lazy(() =>
  import("./views/Farmers/farmer.reg")
);

// const ContractForm = React.lazy(() =>
//   import("./views/Contracts/contract.form")
// );
const ContractDetail = React.lazy(() =>
  import("./views/Contracts/contract.detail")
);
const ContractDocument = React.lazy(() =>
  import("./views/Contracts/ContractDocuments/contract.document")
);
const FarmerProduction = React.lazy(() =>
  import("./views/Farmers/farmer.production")
);

const FarmerAssetServices = React.lazy(() =>
  import("./views/Farmers/farmer.assetservices")
);

const Programmes = React.lazy(() => import("./views/Programs/programs"));
const Indicators = React.lazy(() =>
  import("./views/Performance/Planning/indicators")
);
const IndicatorTitles = React.lazy(() =>
  import("./views/IndicatorTitles/indicatorTitles")
);

const UserGroupList = React.lazy(() => import("./views/UserGroups/usergroups"));
const Performance = React.lazy(() =>
  import("./views/Performance/Reporting/performance")
);
const PerformanceModerate = React.lazy(() =>
  import("./views/Performance/Moderating/performanceAll")
);

const ActivityList = React.lazy(() => import("./views/Activity/activitylist"));
const ApprovalSetupList = React.lazy(() =>
  import("./views/ApprovalSetup/approvalsetup")
);
const Users = React.lazy(() => import("./views/Users/users"));
const UserCard = React.lazy(() => import("./views/Users/userCard"));
const ChangePassword = React.lazy(() => import("./views/Users/changePass"));
const Banks = React.lazy(() => import("./views/Bank/banks"));
const InteractionList = React.lazy(() =>
  import("./views/Interaction/interactionlist")
);

const FarmerReporting = React.lazy(() =>
  import("./views/Farmers/Reporting/farmerReporting")
);

const routes = [
  { path: "/", exact: true, name: "Home" },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardDesign,
    permission: "Dashboard",
  },
  {
    path: "/users",
    exact: true,
    name: "Users",
    component: Users,
    permission: "Users View Access",
  },
  {
    path: "/ChangePassword",
    exact: true,
    name: "Change Password",
    component: ChangePassword,
    permission: "Login Access",
  },
  {
    path: "/UserProfile",
    name: "User Profile",
    component: UserCard,
    permission: "Login Access",
  },
  {
    path: "/farmers-data",
    exact: true,
    name: "Farmers",
    component: FarmersList,
    permission: "Farmers View Access",
  },
  {
    path: "/contracts",
    exact: true,
    name: "Contracts",
    component: ContractList,
    permission: "Contracts View Access",
  },
  {
    path: "/serviceproviders",
    exact: true,
    name: "Service Providers",
    component: ContractServiceProviders,
    permission: "Contract-ServiceProviders View Access",
  },
  {
    path: "/contract-report",
    exact: true,
    name: "Contract Report",
    component: ContractReport,
    permission: "Contract-Report View Access",
  },
  {
    path: "/retention-register",
    exact: true,
    name: "Retention Register",
    component: RetentionRegister,
    permission: "Contract-Report View Access",
  },
  // {
  //   path: "/add-update-contract",
  //   exact: true,
  //   name: "Add-Update Contract",
  //   component: ContractForm,
  //   permission: "Contract Add Access",
  // },
  {
    path: "/contract-detail/:contractId",
    exact: true,
    name: "Contract Detail",
    component: ContractDetail,
    permission: "ContractDetail View Access",
  },
  {
    path: "/contract-document/:contractId/:parent?",
    exact: true,
    name: "Contract Document",
    component: ContractDocument,
    permission: "ContractDetail View Access",
  },
  {
    path: "/milestones/:contractId",
    exact: true,
    name: "Milestones",
    component: MilestonesList,
    permission: "Milestones View Access",
  },
  {
    path: "/farmer-registration",
    exact: true,
    name: "Add New Farmer",
    component: FarmerRegistration,
    permission: "Farmers View Access",
  },
  // {
  //   path: "/livestock-registration",
  //   exact: true,
  //   name: "Live Stock Registration",
  //   component: LiveStockRegistration,
  //   permission: "LiveStocks View Access",
  // },
  // {
  //   path: "/update-livestock-registration/:liveStockId",
  //   exact: true,
  //   name: "Live Stock Registration",
  //   component: LiveStockRegistration,
  //   permission: "LiveStocks View Access",
  // },
  {
    path: "/update-farmer-data/:farmerId",
    exact: true,
    name: "Update Farmer Registration",
    component: FarmerRegistration,
    permission: "Farmer Edit Access",
  },
  {
    path: "/farmer-production/:farmerId",
    exact: true,
    name: "Update Farmer Production",
    component: FarmerProduction,
    permission: "Farmer Edit Access",
  },
  {
    path: "/farmer-asset-services/:farmerId",
    exact: true,
    name: "Update Farmer Asset Services",
    component: FarmerAssetServices,
    permission: "Farmer Edit Access",
  },
  {
    path: "/farmers-reporting",
    exact: true,
    name: "Farmers Reporting",
    component: FarmerReporting,
    permission: "Farmers View Access",
  },
  {
    path: "/programmes",
    exact: true,
    name: "Programmes Master",
    component: Programmes,
    permission: "Programmes View Access",
  },
  {
    path: "/indicatorTitles",
    exact: true,
    name: "Indicator Titles",
    component: IndicatorTitles,
    permission: "IndicatorTitles View Access",
  },

  {
    path: "/indicators",
    exact: true,
    name: "Indicators",
    component: Indicators,
    permission: "Indicators View Access",
  },

  {
    path: "/performance",
    exact: true,
    name: "Performance",
    component: Performance,
    permission: "Performance View Access",
  },
  {
    path: "/performance-moderate",
    exact: true,
    name: "Performance Moderate",
    component: PerformanceModerate,
    permission: "Performance Moderate Access",
  },
  {
    path: "/usergroups",
    exact: true,
    name: "User Groups",
    component: UserGroupList,
    permission: "Roles View Access",
  },
  {
    path: "/cnds",
    exact: true,
    name: "CnDList",
    component: CnDList,
    permission: "ConfigMaster View Access",
  },
  {
    path: "/activity-logs",
    exact: true,
    name: "ActivityList",
    component: ActivityList,
    permission: "ActivityList View Access",
  },
  {
    path: "/approvalsetup",
    exact: true,
    name: "Approval Setup",
    component: ApprovalSetupList,
    permission: "ApprovalSetup View Access",
  },
  {
    path: "/banks",
    exact: true,
    name: "Banks",
    component: Banks,
    permission: "Bank View Access",
  },
  {
    path: "/interaction-data",
    exact: true,
    name: "Interaction",
    component: InteractionList,
    permission: "Interaction View Access",
  },
];

export default routes;
