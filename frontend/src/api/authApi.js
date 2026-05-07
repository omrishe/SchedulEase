import { getBaseUrl } from "../utils/api";
import { httpOptions } from "../utils/api";
const serverAddress = getBaseUrl() + "/api/auth";
console.log(serverAddress);
export function signupApi(formData) {
  return fetch(`${serverAddress}/signup`, {
    ...httpOptions.post(),
    body: JSON.stringify(formData),
  });
}

export function userLogInApi(formData) {
  return fetch(`${serverAddress}/login`, {
    ...httpOptions.post(),
    body: JSON.stringify(formData),
  });
}

export function validateTokenApi(signal) {
  return fetch(`${serverAddress}/validate-token`, {
    method: "get",
    credentials: "include",
    signal,
  });
}

export function logoutApi() {
  return fetch(`${serverAddress}/logout`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
