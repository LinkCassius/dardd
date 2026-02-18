import jwtDecode from "jwt-decode";
const tokenKey = "token";

class Auth {
  constructor() {
    if (localStorage.getItem(tokenKey)) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
  }

  login(cb) {
    //localStorage.setItem("tokenKey", "jwt");
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    /* localStorage.removeItem("tokenKey");
    localStorage.removeItem("userData");*/
    this.unsetLocalStorageData();
    this.authenticated = false;
    //cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  setLocalStorageData(data) {
    localStorage.setItem(tokenKey, data.token);

    localStorage.setItem("firstName", data.firstName);
    localStorage.setItem("lastName", data.lastName);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("email", data.email);
    localStorage.setItem("imageName", data.imageName);
    localStorage.setItem("userData", JSON.stringify(data));
    //localStorage.setItem("childArray", data.childArray);
    localStorage.setItem("userGroup", data.userGroup);

    localStorage.setItem("uploadToken", data.uploadToken);
  }

  unsetLocalStorageData() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userName");
    localStorage.removeItem("userData");
    localStorage.removeItem("email");
    localStorage.removeItem("imageName");
    //localStorage.removeItem("childArray");
    localStorage.removeItem("userGroup");

    localStorage.removeItem("uploadToken");
  }

  getJwt() {
    return localStorage.getItem(tokenKey);
  }

  getCurrentUser() {
    try {
      const jwt = localStorage.getItem(tokenKey);
      //console.log("jwt: ", jwt);
      const decodejwt = jwtDecode(jwt);
      return decodejwt;
    } catch (ex) {
      return null;
    }
  }

  sortValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
}

export default new Auth();
