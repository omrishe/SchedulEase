import { getBaseUrl } from "../utils/api";
const serverAddress = getBaseUrl() + "/api/store";

export function adminSetServicesApi() {
  return;
}

export function adminDelServiceApi(serviceToDelId, storeId) {
  return fetch(
    `${serverAddress}/delete-services?serviceId=${serviceToDelId}&storeId=${storeId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
}

export function createStoreApi(storeInfo) {
  return fetch(`${serverAddress}/new`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(storeInfo),
  });
}

export function getStoreInfoApi(storeId) {
  return fetch(`${serverAddress}/get-store-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export function addServiceToStoreApi(authData, formData) {
  return fetch(`${serverAddress}/set-new-store-services`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ authData, formData }),
  });
}

export function getStoreServicesApi(query) {
  return fetch(`${serverAddress}/get-services?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export function setStoreOwnerAvailabilityApi(dateObjects, _id) {
  return fetch(`${serverAddress}/new-store-time-slots`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ dates: dateObjects, _id: _id }),
  });
}

export function adminEditServiceApi(storeId, serviceId, updatedFields) {
  return fetch(`${serverAddress}/updateService`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ storeId, serviceId, ...updatedFields }),
  });
}
