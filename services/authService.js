import jwtDecode from "jwt-decode";
const tokenKey = "token";
const rtokenKey = "rtoken";

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(rtokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getrJwt() {
  return localStorage.getItem(rtokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    const decodejwt = jwtDecode(jwt);
    return decodejwt;
  } catch (ex) {
    return null;
  }
}

export default { logout, getCurrentUser, loginWithJwt, getJwt };
