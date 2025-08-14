const serverAddress = "https://localhost:5000";

const getHeaderWithCred = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};
export function adminSetServices() {
  return;
}
export function adminDelService() {
  //might delete
  return;
}

export async function createStore(storeInfo) {
  try {
    const response = await fetch(`${serverAddress}/api/store/new`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(storeInfo),
    });
    const data = await response.json();
    if (!response.ok) {
      //add error handling
      console.error("no error handling set yet");
    } else {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
}

export async function getStoreInfo(storeId) {
  try {
    const response = await fetch(`${serverAddress}/getStoreInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(
        "an error occured the server return status code",
        response.status
      );
    } else {
      return responseBody;
    }
  } catch (err) {
    console.error(err);
    return err;
  }
}
