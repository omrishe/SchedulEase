/**
 * signup api function sends data to server
 * -HTTP errors are caught if !response.ok
 * -other errors like .json or network issues are caught in the catch(error)
 */
export async function Signup(formData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const serverResponse = await response.json(); //wont reach here if couldnt get to the server
    /**console.log(
      "in auth.js in frontend the returned object is:",
      serverResponse.message
    );
    **/
    return serverResponse;
  } catch (error) {
    console.log("error:", error.errors);
    return extractErrorDetails(error);
  }
}

/**
 * login api function sends data to verify user to the server
 * -HTTP errors are caught if !response.ok
 * -other errors like .json or network issues are caught in the catch(error)
 */
export async function logIn(formData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

function extractErrorDetails(error) {
  return {
    message: error.message,
    details: error.details,
    stack: error.stack,
  };
}
