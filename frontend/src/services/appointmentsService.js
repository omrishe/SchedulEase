import { sendRejectedResponse } from "../utils/responseHandler.js";
import {
  addDaysToDate,
  resetTime,
  parseDateToHHMM,
} from "../utils/dateHandlers.js";
import {
  createAppointmentApi,
  getAvailableAppointmentsDatesApi,
  getAllStoreAppointmentsApi,
  getUserBookingInfoApi,
} from "../api/appointmentsApi.js";
import config from "../config.json";

export async function createAppointment(appointmentInfo) {
  try {
    const response = await createAppointmentApi(appointmentInfo);
    const data = await response.json();
    if (response.ok) {
      data.date = new Date(data.date);
      return data;
    } else {
      return data;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("error:", error);
    }
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function getAvailableAppointmentsDates(
  storeIdentifier,
  startDate,
  signal = undefined,
  endDate = undefined,
) {
  try {
    let startDateTimeStamp = startDate.getTime();
    const startOfTodayTimeStamp = resetTime(new Date(), "timeStamp");
    if (resetTime(startDateTimeStamp, "timeStamp") === startOfTodayTimeStamp) {
      startDateTimeStamp = new Date().getTime();
    }
    const amtOfDaysToFetch = config.daysToFetch;
    const endDateTimeStamp = endDate
      ? endDate.getTime()
      : resetTime(
          addDaysToDate(startDateTimeStamp, amtOfDaysToFetch),
          "timeStamp",
        );

    const response = await getAvailableAppointmentsDatesApi(
      storeIdentifier.storeSlug,
      startDateTimeStamp,
      endDateTimeStamp,
      signal,
    );

    if (response.ok) {
      const serverResponse = await response.json();
      let daysObjArr = {};
      for (let d = 0; d < amtOfDaysToFetch; d++) {
        const dateKey = resetTime(
          addDaysToDate(startDateTimeStamp, d),
          "timeStamp",
        );
        daysObjArr[dateKey] = [];
      }
      serverResponse.otherData.forEach((date) => {
        const tempDate = resetTime(date, "jsDate").getTime();
        daysObjArr[tempDate].push(parseDateToHHMM(date));
      });
      serverResponse.otherData = daysObjArr;
      return serverResponse;
    }
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    if (import.meta.env.DEV) {
      console.info("entered into catch details:", error);
    }
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function getAllStoreAppointments(startDate, endDate) {
  try {
    startDate = resetTime(startDate);
    endDate = resetTime(endDate);
    const response = await getAllStoreAppointmentsApi(
      startDate.getTime(),
      endDate.getTime(),
    );
    if (response.ok) {
      const allAppointment = await response.json();
      return allAppointment;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("error:", error);
    }
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function getUserBookingInfo(startDate, endDate) {
  try {
    startDate = resetTime(startDate);
    endDate = resetTime(endDate);
    const response = await getUserBookingInfoApi(
      startDate.getTime(),
      endDate.getTime(),
    );
    const allAppointment = await response.json();
    return allAppointment;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("error:", error);
    }
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
