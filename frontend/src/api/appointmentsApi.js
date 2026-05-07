import { getBaseUrl } from "../utils/api";
import { httpOptions } from "../utils/api";
const serverAddress = getBaseUrl() + "/api/appointments";

export function createAppointmentApi(appointmentInfo) {
  return fetch(`${serverAddress}/new-appointment`, {
    ...httpOptions.post(),
    body: JSON.stringify({ appointmentInfo }),
  });
}
export function getAvailableAppointmentsDatesApi(
  storeSlug,
  startDateTimeStamp,
  endDateTimeStamp,
  signal,
) {
  const query = `storeSlug=${storeSlug}&startDate=${startDateTimeStamp}&endDate=${endDateTimeStamp}`;
  return fetch(`${serverAddress}/get-available-appointment-dates?${query}`, {
    ...httpOptions.get(),
    signal: signal,
  });
}

export function getAllStoreAppointmentsApi(
  startDateTimeStamp,
  endDateTimeStamp,
) {
  return fetch(
    `${serverAddress}/get-all-store-appointments?startDate=${startDateTimeStamp}&endDate=${endDateTimeStamp}`,
    { ...httpOptions.get() },
  );
}

export function getUserBookingInfoApi(startDateTimeStamp, endDateTimeStamp) {
  return fetch(
    `${serverAddress}/get-user-booking-info?startDate=${startDateTimeStamp}&endDate=${endDateTimeStamp}`,
    { ...httpOptions.get() },
  );
}
