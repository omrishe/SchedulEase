import { getBaseUrl, httpOptions } from "../utils/api";
const serverAddress = getBaseUrl() + "/api/store";

export function adminSetServicesApi() {
  return;
}

export function adminDelServiceApi(serviceToDelId, storeId) {
  return fetch(
    `${serverAddress}/delete-services?serviceId=${serviceToDelId}&storeId=${storeId}`,
    httpOptions.delete(),
  );
}

export function createStoreApi(storeInfo) {
  return fetch(`${serverAddress}/new`, {
    ...httpOptions.post(),
    body: JSON.stringify(storeInfo),
  });
}

export function getStoreInfoApi(storeId) {
  return fetch(`${serverAddress}/get-store-info`, httpOptions.get());
}

export function addServiceToStoreApi(authData, formData) {
  return fetch(`${serverAddress}/set-new-store-services`, {
    ...httpOptions.post(),
    body: JSON.stringify({ authData, formData }),
  });
}

export function getStoreServicesApi(query) {
  return fetch(`${serverAddress}/fetch-Store-Data?${query}`, httpOptions.get());
}

export function setStoreOwnerAvailabilityApi(dateObjects, _id) {
  return fetch(`${serverAddress}/new-store-time-slots`, {
    ...httpOptions.post(),
    body: JSON.stringify({ dates: dateObjects, _id: _id }),
  });
}

export function adminEditServiceApi(storeId, serviceId, updatedFields) {
  return fetch(`${serverAddress}/updateService`, {
    ...httpOptions.patch(),
    body: JSON.stringify({ storeId, serviceId, ...updatedFields }),
  });
}
