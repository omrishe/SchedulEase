//helper function to set take a date
function addDaysToDate(date = new Date(), amount = 1) {
  try {
    const tmrwsDate = new Date(date);
    tmrwsDate.setDate(tmrwsDate.getDate() + Number(amount));
    return tmrwsDate;
  } catch (error) {
    console.error("error while parsing date see log", error);
    return new Date(); // Return default date on error
  }
}

//normalizes the date to contain only day/month/year
function normalizeDate(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

module.exports = { normalizeDate, addDaysToDate };
