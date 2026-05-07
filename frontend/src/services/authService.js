import { sendRejectedResponse } from "../utils/responseHandler.js";
import {
  signupApi,
  userLogInApi,
  validateTokenApi,
  logoutApi,
} from "../api/authApi.js";

export async function signup(formData) {
  try {
    const response = await signupApi(formData);
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return data;
  } catch (error) {
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function userLogIn(formData) {
  try {
    const response = await userLogInApi(formData);
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("an error has occured while loggin in", error);
    }
    return sendRejectedResponse({
      message: "an error occured see logg",
      otherData: error,
    });
  }
}

export async function validateToken(signal) {
  try {
    let response;
    if (signal?.aborted) return null;
    response = await validateTokenApi(signal);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    if (response.status === 401) {
      return sendRejectedResponse({
        message: "token is invalid",
        code: "TOKEN_INVALID",
        isSuccess: false,
      });
    } else {
      return sendRejectedResponse({
        message: "an error occured see log",
        code: "VALIDATE_TOKEN_ERROR",
        otherData: await response.json(),
      });
    }
  } catch (error) {
    if (error.name === "AbortError") return null;
    return sendRejectedResponse({
      message: "an error occured during token validation see log",
      code: "VALIDATE_TOKEN_ERROR",
      otherData: error,
    });
  }
}

export async function logout() {
  try {
    const response = await logoutApi();
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
