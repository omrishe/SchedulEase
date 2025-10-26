//handles store-related requests
import { sendRejectedResponse } from "../utils/responseHandler.js";
const baseServerAddress = import.meta.env.VITE_SERVER_ADDRESS;
const serverAddress = baseServerAddress + "/api/store";

export function adminSetServices() {
  return;
}
export async function adminDelService(serviceToDelId, storeId) {
  try {
    if (!(serviceToDelId && storeId)) {
      throw new Error("service/store id  is missing");
    }
    const response = await fetch(
      `${serverAddress}/delete-services?serviceId=${serviceToDelId}&storeId=${storeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
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

export async function createStore(storeInfo) {
  try {
    const response = await fetch(`${serverAddress}/new`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(storeInfo),
    });
    const data = await response.json();
    if (!response.ok) {
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

export async function getStoreInfo(storeId) {
  try {
    const response = await fetch(`${serverAddress}/getStoreInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
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

export async function addServiceToStore(authData, formData) {
  try {
    const response = await fetch(`${serverAddress}/set-new-store-services`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ authData, formData }),
    });

    const data = await response.json();
    if (!response.ok) {
      data.message = "error";
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

export async function getStoreServices(storeIdentifier) {
  try {
    //sets it so if already logged in send the storeId and if not we send the store Slug
    const query = storeIdentifier.storeId
      ? `storeId=${storeIdentifier.storeId}`
      : `storeSlug=${storeIdentifier.storeSlug}`;
    const response = await fetch(`${serverAddress}/getServices?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const storeServices = await response.json();
      return storeServices;
    } else {
      throw new Error(`server  ${response.status} error occured`);
    }
  } catch (error) {
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function setStoreOwnerAvailability(dateObjects, _id) {
  try {
    const response = await fetch(`${serverAddress}/new-store-time-slots`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dates: dateObjects, _id: _id }),
    });
    const data = await response.json();
    if (!response.ok) {
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
