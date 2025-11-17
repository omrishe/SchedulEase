//helper function to set take a date
export function addDaysToDate(date = new Date(), amount = 1) {
  try {
    const tmrwsDate = new Date(date);
    tmrwsDate.setDate(tmrwsDate.getDate() + Number(amount));
    return tmrwsDate;
  } catch (error) {
    console.error("error while parsing date see log", error);
    return new Date(); // Return default date on error
  }
}

export function resetTime(dateOrTimeStamp, mode = "jsDate") {
  try {
    const newDate = new Date(dateOrTimeStamp);
    newDate.setHours(0, 0, 0, 0);
    if (mode === "jsDate") {
      return newDate;
    } else if (mode === "timeStamp") {
      return newDate.getTime();
    } else {
      throw new Error(
        "error while resetting time of day - mode does not exist"
      );
    }
  } catch (error) {
    console.error("error while parsing date see log", error);
    return mode === "timeStamp" ? 0 : new Date(); // Return default value
  }
}

export function ParseDateToHHMM(date) {
  const dateSlot = new Date(date);
  const hours = dateSlot.getHours().toString().padStart(2, "0");
  const minutes = dateSlot.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
