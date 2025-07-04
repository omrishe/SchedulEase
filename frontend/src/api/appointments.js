const serverAddress = "https://localhost:5000";
export async function createAppointment(appointmentInfo) {
  try {
    const response = await fetch(`${serverAddress}/api/appointments/new`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: appointmentInfo["name"],
        date: appointmentInfo["date"],
        time: appointmentInfo["time"],
        additionalRequests: appointmentInfo["additionalRequests"],
        email: appointmentInfo["email"],
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      handlePostError(data);
    } else {
      return data;
    }
  } catch (error) {
    console.log("error:", error.errors);
    throw error;
  }
}

function handlePostError(data) {
  if (data.error) {
    console.error("Error:", data.error);
    console.error("error details:", data.details);
  }
  if (data.message) {
    console.error("Message:", data.message);
  }
  if (!data.message && !data.error) {
    console.error("unknown error occured during sending appointment data");
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
    console.error(error);
  }
}
