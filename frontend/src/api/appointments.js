import { sendRejectedResponse } from "../utils/responseHandler.js";
const baseServerAddress = import.meta.env.VITE_SERVER_ADDRESS;
const serverAddress = baseServerAddress + "/api/appointments";

export async function createAppointment(appointmentInfo) {
  try {
    const response = await fetch(`${serverAddress}/new`, {
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
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function getAvailableAppointments(storeIdentifier, date) {
  try {
    //sets it so if already logged in send the storeId and if not we send the store Slug
    console.log("store identifier is:\n", storeIdentifier);
    const todaysDate = new Date();
    //check if the date selected is today if it is send it with the time currently to show only dates that are after this hour
    //otherwise Reset hours and minutes to show the whole day
    if (
      date.getFullYear() === todaysDate.getFullYear() &&
      date.getMonth() === todaysDate.getMonth() &&
      date.getDate() === todaysDate.getDate()
    ) {
      //sets it so it sends the time from now
      date = new Date();
      date = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      );
    } else {
      //resets date hours and seconds
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const query = storeIdentifier.storeId
      ? `storeId=${storeIdentifier.storeId}&date=${date.getTime()}`
      : `storeSlug=${storeIdentifier.storeSlug}&date=${date.getTime()}`;
    const response = await fetch(
      `${serverAddress}/getAvailableAppointment?${query}`,
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
      //parse from array of iso to HH:MM format
      availableSlots.otherData = availableSlots.otherData.map((slot) => {
        const dateSlot = new Date(slot);
        const hours = dateSlot.getHours().toString().padStart(2, "0");
        const minutes = dateSlot.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      });
      return availableSlots;
    } else {
      throw new Error(`server  ${response.status} error occured`);
    }
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}

export async function fetchAllAppointment() {
  try {
    const response = await fetch(`${serverAddress}/getAllAppointments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const allAppointment = await response.json();
      console.log(allAppointment);
      return allAppointment;
    } else {
      throw new Error(`server  ${response.status} error occured`);
    }
  } catch (error) {
    console.log("error:", error);
    return sendRejectedResponse({
      message: "an error occured see log",
      otherData: error,
    });
  }
}
