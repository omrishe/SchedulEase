import { sendRejectedResponse } from "../utils/responseHandler.js";
const serverAddress = "https://localhost:5000";
export async function createAppointment(appointmentInfo) {
  try {
    const response = await fetch(`${serverAddress}/api/appointments/new`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(appointmentInfo),
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

export async function fetchAllAppointment() {
  try {
    const response = await fetch(
      `${serverAddress}/api/appointments/getAllAppointments`,
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
