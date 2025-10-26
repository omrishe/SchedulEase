//helper function to set take a date
export function addDaysToDate(date = new Date(), amount = 1) {
  try {
    const tmrwsDate = new Date(date);
    tmrwsDate.setDate(tmrwsDate.getDate() + Number(amount));
    return tmrwsDate;
  } catch (error) {
    console.error("error while parsing date see log", error);
  }
}

export function resetTime(date) {
  try {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  } catch (error) {
    console.error("error while parsing date see log", error);
  }
}

export function ParseDateToHHMM(date) {
  const dateSlot = new Date(date);
  const hours = dateSlot.getHours().toString().padStart(2, "0");
  const minutes = dateSlot.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
