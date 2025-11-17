import { sendRejectedResponse } from "../utils/responseHandler.js";
import {
  addDaysToDate,
  resetTime,
  ParseDateToHHMM,
} from "../utils/dateHandlers.js";
const baseServerAddress = import.meta.env.VITE_SERVER_ADDRESS;
const serverAddress = baseServerAddress + "/api/appointments";
import config from "../config.json";

export async function createAppointment(appointmentInfo) {
  try {
    const response = await fetch(`${serverAddress}/new-appointment`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ appointmentInfo }),
    });
    const data = await response.json();
    if (response.ok) {
      //convert back from ISO string to a date object
      data.date = new Date(data.date);
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.error("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

//get store available appointments
export async function getAvailableAppointmentsDates(
  storeIdentifier,
  startDate,
  options = {}, // for { signal }
  endDate
) {
  try {
    const { signal } = options;
    let startDateTimeStamp = startDate.getTime();
    const startOfTodayTimeStamp = resetTime(new Date(), "timeStamp");
    //check if the date selected is today if it is send it with the time currently to show only dates that are after this hour
    if (resetTime(startDateTimeStamp, "timeStamp") === startOfTodayTimeStamp) {
      startDateTimeStamp = startOfTodayTimeStamp;
    }
    const amtOfDaysToFetch = config.daysToFetch;
    //if endDate not supplied set is as the default config otherwise set it as timestamp
    const endDateTimeStamp = endDate
      ? endDate.getTime()
      : resetTime(
          addDaysToDate(startDateTimeStamp, amtOfDaysToFetch),
          "timeStamp"
        );
    //sets it so if already logged in send the storeId and if not send the store Slug
    //currently disabled
    const query = storeIdentifier.storeId
      ? `storeId=${storeIdentifier.storeId}&startDate=${startDateTimeStamp}&endDate=${endDateTimeStamp}`
      : `storeSlug=${storeIdentifier.storeSlug}&startDate=${startDateTimeStamp}&endDate=${endDateTimeStamp}`;
    const response = await fetch(
      `${serverAddress}/getAvailableAppointmentDates?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
      }
    );
    if (response.ok) {
      const serverResponse = await response.json();
      let daysObjArr = {};
      //creates an obj where each day is a key with an empty array
      for (let d = 0; d < amtOfDaysToFetch; d++) {
        const dateKey = resetTime(
          addDaysToDate(startDateTimeStamp, d),
          "timeStamp"
        );
        daysObjArr[dateKey] = [];
      }
      //,ales ot so each day contains only the HH:MM of that day
      serverResponse.otherData.forEach((date) => {
        const tempDate = resetTime(date, "jsDate").getTime();
        daysObjArr[tempDate].push(ParseDateToHHMM(date)); //parse from array of iso to HH:MM format
      });
      serverResponse.otherData = daysObjArr;
      return serverResponse;
    } else {
      throw new Error(`server  ${response.status} error occured`);
    }
  } catch (error) {
    if (error.name === "AbortError") {
      // Fetch was aborted, do nothing
      return sendRejectedResponse({
        isSuccess: false,
        message: "Request aborted",
        code: "AbortError",
        otherData: error,
      });
    }
    console.error("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

//fetch all store appointments between start date and end date
export async function getAllStoreAppointments(startDate, endDate) {
  try {
    //reset to time in day to 00:00:00.000
    startDate = resetTime(startDate);
    endDate = resetTime(endDate);
    const response = await fetch(
      `${serverAddress}/get-All-Store-Appointments?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      const allAppointment = await response.json();
      return allAppointment;
    } else {
      throw new Error(`server  ${response.status} error occured`);
    }
  } catch (error) {
    console.error("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

//gets only the user Bookings
export async function getUserBookingInfo(startDate, endDate) {
  try {
    startDate = resetTime(startDate);
    endDate = resetTime(endDate);
    const response = await fetch(
      `${serverAddress}/getUserBookingInfo?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const allAppointment = await response.json();
    return allAppointment;
  } catch (error) {
    console.error("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
