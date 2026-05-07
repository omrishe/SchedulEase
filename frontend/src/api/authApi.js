import { getBaseUrl } from "../utils/api";
import { httpOptions } from "../utils/api";
const serverAddress = getBaseUrl() + "/api/auth";
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
    ...httpOptions.get(),
    signal,
  });
}

export function logoutApi() {
  return fetch(`${serverAddress}/logout`, {
    ...httpOptions.post(),
  });
}
