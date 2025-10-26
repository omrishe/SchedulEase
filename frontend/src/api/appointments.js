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

//warning! this function would only work for 27 days range (since 2 dates can have the same day date in a month)
export async function getAvailableAppointmentsDates(
  storeIdentifier,
  startDate,
  endDate = new Date()
) {
  try {
    const todaysDate = new Date();
    //check if the date selected is today if it is send it with the time currently to show only dates that are after this hour
    //otherwise Reset hours and minutes to show the whole day
    endDate = addDaysToDate(resetTime(endDate), config.daysToFetch);
    if (
      startDate.getFullYear() !== todaysDate.getFullYear() ||
      startDate.getMonth() !== todaysDate.getMonth() ||
      startDate.getDate() !== todaysDate.getDate()
    ) {
      //resets date hours and seconds
      startDate = resetTime(startDate);
    }
    //sets it so if already logged in send the storeId and if not send the store Slug
    const query = storeIdentifier.storeId
      ? `storeId=${
          storeIdentifier.storeId
        }&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`
      : `storeSlug=${
          storeIdentifier.storeSlug
        }&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
    const response = await fetch(
      `${serverAddress}/getAvailableAppointmentDates?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      const availableSlots = await response.json();
      let daysObjArr = {};
      for (let d = startDate; d < endDate; d = addDaysToDate(d, 1)) {
        daysObjArr[resetTime(d)] = [];
      }
      availableSlots.otherData.forEach((date) => {
        const tempDate = resetTime(date);
        daysObjArr[tempDate].push(date);
      });
      //parse from array of iso to HH:MM format
      availableSlots.otherData = availableSlots.otherData.map((slot) =>
        ParseDateToHHMM(slot)
      );
      return availableSlots;
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
