import { resetTime } from "./dateHandlers";

//Remove a booked time slot from cached slots
export function removeBookedSlot(prev, dateStamp, time) {
  return {
    ...prev,
    [dateStamp]: prev[dateStamp]?.filter((slot) => slot !== time) || [],
  };
}
