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
    return handleError(error, "signup");
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
    console.log("in auth.js", formData);
    const data = await response.json();
    if (!response.ok) {
      //altough in any http code that returned the return is the same,i left it for clearer code or future expension
      return data;
    }
    return data;
  } catch (error) {
    return handleError(error, "userLogIn");
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
      return { ...data, success: false };
    }
    return { ...data, success: true };
  } catch (error) {
    error.success = false;
    return handleError(error, "validateToken");
  }
}

export async function logout() {
  const response = await fetch(`${serverAddress}/api/auth/logout`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    return true;
  }
  return false;
}

function handleError(error, location) {
  if (!error.message) {
    console.error(
      `an error occured on api auth in ${location} error details:`,
      error
    );
    error.message = "Something went wrong. Please try again later.";
    return error;
  }
  return error;
}
