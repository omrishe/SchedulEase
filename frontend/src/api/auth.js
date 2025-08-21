import { sendRejectedResponse } from "../utils/responseHandler.js";

/**
 * signup api function sends data to server
 * -HTTP errors are caught if !response.ok
 * -other errors like .json or network issues are caught in the catch(error)
 */
const serverAddress = "https://localhost:5000";
export async function signup(formData) {
  try {
    const response = await fetch(`${serverAddress}/api/auth/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json(); //wont reach here if couldnt get to the server
    if (!response.ok) {
      //altough in any http code that returned the return is the same,i left it for clearer code or future expension
      return data;
    }
    return data;
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

/**
 * login api function sends data to verify user to the server
 * -HTTP errors are caught if !response.ok
 * -other errors like .json or network issues are caught in the catch(error)
 */
export async function userLogIn(formData) {
  try {
    const response = await fetch(`${serverAddress}/api/auth/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      //altough in any http code that returned the return is the same,i left it for clearer code or future expension
      return data;
    }
    console.log("in auth.js data is:", data);
    return data;
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
/**
 *  validate api function to verify that the user is still logged in
 *
 *
 */
export async function validateToken() {
  try {
    const response = await fetch(`${serverAddress}/api/auth/validateToken`, {
      method: "get",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return data;
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function logout() {
  try {
    const response = await fetch(`${serverAddress}/api/auth/logout`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json;
    if (response.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
