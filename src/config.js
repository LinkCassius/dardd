/*let pageNo = 10;
let recordPerPage = 10;
const cookieExpireTime = 999 * 365;*/
/*const pageConfig = {
  pageNo: 3
};*/
/****** here you can change server url where api runs********/
//let domain = "http://localhost:1337/";
//let apiDomain = "https://tdapwebapitest-byhyawa7hjbycvhq.southafricanorth-01.azurewebsites.net/";
let apiDomain = "http://localhost:6008/";
let apiUrl = apiDomain + "api/";
// const jwtConfig = {
//   /********** login url *********/
//   enabled: true,
//   fetchUrl: domain + 'login',
//   secretKey: 'adlfjadlkjflkadjflk'
// };

// const jwtSignupConfig = {
//   /********** user registration url *********/
//   enabled: true,
//   fetchUrl: domain + 'signup',
//   secretKey: 'adlfjadlkjflkadjflk'
// };

// const globalConstants = {
//   enabled: true,
// }

const siteConfig = {
  siteName: "DARDLEA: Farmer Profiling",
  siteIcon: "ion-flash",
  footerText: "agroChain:  Djital ©2021.",
  na_text: "NA",
  imageDomain: "https://bonton.s3.ap-south-1.amazonaws.com",
  imagesPath: apiDomain + "uploads/",
  userImagesPath: apiDomain + "images/users/",
  widgetImagesPath: apiDomain + "images/widgets/",
};
const themeConfig = {
  topbar: "themedefault",
  sidebar: "themedefault",
  layout: "themedefault",
  theme: "themedefault",
};
const language = "english";

const ApiEndPoints = {
  enabled: true,

  //login
  login: apiUrl + "login",

  //cnd
  cndList: apiUrl + "cndlist",
  AddUpdateCnd: apiUrl + "cnd",
  cnd: apiUrl + "cndlist",
  cndgroup: apiUrl + "cndgroup",

  //file upload
  uploadfile: apiUrl + "uploadfile",

  //usergroups/users/screens/widgets/log
  userGroupsList: apiUrl + "userGrouplist",
  userGroupList: apiUrl + "usergrouplist",
  AddUpdateUserGroup: apiUrl + "usergroup",
  userGroup: apiUrl + "usergrouplist",
  userGroupUsers: apiUrl + "usersbyusergroup",
  usersList: apiUrl + "userlist",
  activeusers: apiUrl + "activeusers",
  userlist_hierarchy: apiUrl + "userlist_hierarchy",
  user: apiUrl + "userlist",
  AddUpdateUser: apiUrl + "register",
  screens: apiUrl + "screens",
  widgetList: apiUrl + "widgetlst",
  widgetsList: apiUrl + "widgetsList", //for dynamic
  addUpdateWidget: apiUrl + "widget",
  addUpdateUserWidget: apiUrl + "userwidget",
  captureLogActivity: apiUrl + "logactivity",
  activityList: apiUrl + "activitylist",

  //farmers
  farmersList: apiUrl + "farmersList",
  farmerslistnew: apiUrl + "farmerslistnew",
  farmersDDL: apiUrl + "farmersDDL",
  farmersListById: apiUrl + "farmerlist",
  deletefarmer: apiUrl + "deletefarmer",
  farmerRegistration: apiUrl + "farmerRegistration",
  farmerProductionList: apiUrl + "farmerProductionList",
  farmerProduction: apiUrl + "farmerProduction",
  farmerAssetsList: apiUrl + "farmerAssetsList",
  farmerAssetsServices: apiUrl + "farmerAssetsServices",
  farmerDetailsHistory: apiUrl + "farmerDetailsHistory",
  farmerProductionHistory: apiUrl + "farmerProductionHistory",
  farmerAssetsHistory: apiUrl + "farmerAssetsHistory",
  farmerbyid: apiUrl + "farmerbyid",
  farmerusers: apiUrl + "farmerusers",
  farmerreporting: apiUrl + "farmerreporting",
  //farmer interaction
  addUpdateInteraction: apiUrl + "interaction",
  interactionList: apiUrl + "interactionlist",
  interactionlist_web: apiUrl + "interactionlist_web",
  interactionusers: apiUrl + "interactionusers",

  //export excel farmers/interaction
  exportfarmers: apiUrl + "lookupexportfarmers",
  farmerInteractions: apiUrl + "exportfarmerinteractions",
  //genFarmerFile: apiUrl + "genFarmerFile",
  //exportfarmers: apiUrl + "expfarmers", //tried with updating excel but js issue of memory
  mergeExcel: apiUrl + "mergeExcel",

  //contract
  contractList: apiUrl + "contractlist",
  AddUpdateContract: apiUrl + "contract",
  milestonesList: apiUrl + "contract_deliverable_list",
  AddUpdateMilstones: apiUrl + "contract_deliverable",
  taskList: apiUrl + "tasklist",
  AddUpdateTask: apiUrl + "task",
  taskById: apiUrl + "taskbyid",
  contract_Variation_List: apiUrl + "contract_variation_list",
  AddUpdateContract_Variation: apiUrl + "contract_variation",
  variationById: apiUrl + "variationbyid",
  contract_Milestone_List: apiUrl + "contract_milestone_list",
  AddUpdateContract_Milestone: apiUrl + "contract_milestone",
  milestoneById: apiUrl + "milestonebyid",
  contract_Payment_List: apiUrl + "contract_payment_list",
  AddUpdateContract_Payment: apiUrl + "contract_payment",
  paymentById: apiUrl + "paymentbyid",
  contract_Dimension_List: apiUrl + "contract_dimension_list",
  AddUpdateContract_Dimension: apiUrl + "contract_dimension",
  contract_Document_List: apiUrl + "contract_document_list",
  dimensionById: apiUrl + "dimensionbyid",
  AddUpdateContract_Document: apiUrl + "contract_document",
  documentById: apiUrl + "documentbyid",
  deletecontract: apiUrl + "deletecontract",
  approvalhistorybyappid: apiUrl + "approvalhistorybyappid",
  serviceproviders: apiUrl + "serviceproviders",
  serviceproviderslist: apiUrl + "serviceproviderslist",
  deleteserviceprovider: apiUrl + "deleteserviceprovider",
  retentionReport: apiUrl + "retentionreport",
  retentionExcelReport: apiUrl + "retentionexcelreport",
  //performance
  AddUpdatePerformance: apiUrl + "performance",
  indicatorstitles: apiUrl + "indicatorstlist",
  AddUpdateIndicator: apiUrl + "indicators",
  indicators_assign: apiUrl + "indicators_assign",
  indicatorsList: apiUrl + "indicatorslist",
  performanceList: apiUrl + "performancelist",
  AddUpdatePerformance_Document: apiUrl + "performance_document",
  performance_Document_List: apiUrl + "performance_document_list",
  perfDocumentById: apiUrl + "perDocumentById",
  PerformanceListById: apiUrl + "performanceListById",
  annualReport: apiUrl + "getDocument",
  annualPlan: apiUrl + "getAnnualPlanDoc",
  performanceListByCycle: apiUrl + "performancelistbycycle",
  addUpdateIndicatorTitles: apiUrl + "IndicatorTitles",
  IndicatorTitleslist: apiUrl + "IndicatorTitleslist",
  indicatorsddl: apiUrl + "indicatorsddl",
  deleteIndicatorTitle: apiUrl + "DeleteIndicatorTitle",
  programList: apiUrl + "getprograms", //by cndgroup 'dimension' in api
  allProgramList: apiUrl + "programlist", //get all programs.. above api and this gets same result
  AddUpdateProgram: apiUrl + "program",
  deleteProgram: apiUrl + "DeleteProgram",
  deleteIndicator: apiUrl + "DeleteIndicator",
  movlist: apiUrl + "movlist",
  addupdatemov: apiUrl + "addupdatemov",
  delete_perfdocument: apiUrl + "delete_perfdocument",
  updateIndicatorByFolder: apiUrl + "performance_folder", //update table vals on doc folder click
  //mail/alert/password/dimension
  sendMail: apiUrl + "sendmail",
  alerts: apiUrl + "alerts",
  changePassword: apiUrl + "changePassword",
  forgotPassword: apiUrl + "forgotPassword",
  globalsearch: apiUrl + "globalsearch",
  dimensionList: apiUrl + "getdimensions",

  //approvals
  approvalAreaList: apiUrl + "approvalarealist",
  approvalsetupList: apiUrl + "approvalsetuplist",
  AddUpdateApprovalSetup: apiUrl + "approvalsetup",
  deleteapprovalsetup: apiUrl + "deleteapprovalsetup",
  pendingApprovalsList: apiUrl + "pendingapprovalslist",
  pendingApprovalAreaList: apiUrl + "pendingapprovalarealist",
  addUpdateApprovalHistory: apiUrl + "approvalhistory",

  //bank
  addUpdateBank: apiUrl + "bank",
  bankList: apiUrl + "banklist",
};

/** Common Contants **/
const masterConstants = {
  enableDisableTypes: 100,
  status: {
    0: "Inactive",
    1: "Active",
  },
};

/*function createCacheEndpoint(finalListEndPoint, method, params = {}) {
  var endpoint = String(finalListEndPoint).replace(domain, "");
  if (method === "post") {
    var queryString = Object.keys(params)
      .map(function(key) {
        return key + "=" + params[key];
      })
      .join("&");
    endpoint = endpoint + "?qp=" + queryString;
  }
  return endpoint;
}

function removeApiCache() {
  Object.keys(localStorage).forEach(function(key) {
    if (/^ApiData_|^ApiData/.test(key)) {
      localStorage.removeItem(key);
    }
  });
}*/
//let Emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const masterCons = {
  enableDisableTypes: {
    1: "Enabled",
    0: "Disabled",
  },
  activeInactiveType: {
    active: "1",
    inActive: "0",
  },
  deletedType: {
    deleted: "1",
    notDeleted: "0",
  },
  tableHeaderBackColor: "#2b8759",
};

const fileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/x-zip-compressed",
];

export {
  apiUrl,
  siteConfig,
  themeConfig,
  language,
  masterConstants,
  masterCons,
  //Emailreg,
  ApiEndPoints,
  fileTypes,
};
