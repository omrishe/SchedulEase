import { sendRejectedResponse } from "../utils/responseHandler.js";
import {
  adminSetServicesApi,
  adminDelServiceApi,
  createStoreApi,
  getStoreInfoApi,
  addServiceToStoreApi,
  getStoreServicesApi,
  setStoreOwnerAvailabilityApi,
  adminEditServiceApi
} from "../api/storeApi.js";

export function adminSetServices() {
  return adminSetServicesApi();
}

export async function adminDelService(serviceToDelId, storeId) {
  try {
    if (!(serviceToDelId && storeId)) {
      throw new Error("service/store id  is missing");
    }
    const response = await adminDelServiceApi(serviceToDelId, storeId);
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
    const response = await createStoreApi(storeInfo);
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
    const response = await getStoreInfoApi(storeId);
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
    const response = await addServiceToStoreApi(authData, formData);
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
    const query = storeIdentifier.storeId
      ? `storeId=${storeIdentifier.storeId}`
      : `storeSlug=${storeIdentifier.storeSlug}`;
    const response = await getStoreServicesApi(query);
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
    const response = await setStoreOwnerAvailabilityApi(dateObjects, _id);
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

export async function adminEditService(storeId, serviceId, updatedFields) {
  try {
    const response = await adminEditServiceApi(storeId, serviceId, updatedFields);
    const data = await response.json();
    return data;
  } catch (error) {
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
