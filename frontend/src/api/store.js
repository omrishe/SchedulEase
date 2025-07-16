const serverAddress = "https://localhost:5000";

export function adminSetServices() {
  return;
}
export function adminDelService() {
  //might delete
  return;
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
