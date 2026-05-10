import { useEffect, useState, useCallback } from "react";

import {
  getAvailableAppointmentsDates,
  createAppointment,
} from "../services/appointmentsService.js";

import { fetchStoreData } from "../services/storeService.js";
import { sendRejectedResponse } from "../utils/responseHandler.js";
import { resetTime } from "../utils/dateHandlers.js";

export function useAppointmentBooking({
  appointmentInfo,
  updateAppointmentInfo,
  userName,
  slug,
}) {
  const [windowChooser, setWindow] = useState("items");
  const [services, setServices] = useState(["loading"]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});
  const [storeNotFound, setStoreNotFound] = useState(false);

  // Fetch services function
  useEffect(() => {
    async function getStoreData() {
      try {
        const res = await fetchStoreData({ storeSlug: slug });

        if (res.isSuccess) {
          setServices(res.otherData);
        } else if (res.code === "STORE_NOT_FOUND") {
          setStoreNotFound(true);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to fetch services:", error);
        }
      }
    }

    getStoreData();
  }, [slug]);

  // Fetch available slots function
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getAvailableSlots() {
      try {
        if (!userName) return;

        const res = await getAvailableAppointmentsDates(
          { storeSlug: slug },
          new Date(appointmentInfo.date),
          signal,
        );

        if (res.isSuccess) {
          setAvailableTimeSlots((prev) => ({
            ...prev,
            ...res.otherData,
          }));
        } else {
          sendRejectedResponse({
            message: "Failed to fetch slots",
            otherData: res.message,
          });
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        if (import.meta.env.DEV) {
          console.error("Error fetching slots:", error);
        }
      }
    }

    const dateStamp = resetTime(appointmentInfo.date, "timeStamp");

    if (!(dateStamp in availableTimeSlots)) {
      getAvailableSlots();
    }

    return () => controller.abort();
  }, [appointmentInfo.date, userName, slug]);

  // Book appointment function
  const handleChooseTimeOnClick = useCallback(
    async (time) => {
      try {
        const tempDate = new Date(appointmentInfo.date);
        const [hours, minutes] = time.split(":");

        tempDate.setHours(hours, minutes);

        const response = await createAppointment(
          await updateAppointmentInfo({ date: tempDate }),
        );

        if (response.isSuccess) {
          const dateStamp = resetTime(tempDate, "timeStamp");

          setAvailableTimeSlots((prev) => ({
            ...prev,
            [dateStamp]: prev[dateStamp]?.filter((slot) => slot !== time) || [],
          }));
        }

        return response;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Booking failed:", error);
        }

        return sendRejectedResponse({
          message: "failed to create appointment",
          otherData: error,
        });
      }
    },
    [appointmentInfo.date, updateAppointmentInfo],
  );

  return {
    windowChooser,
    setWindow,
    services,
    availableTimeSlots,
    handleChooseTimeOnClick,
    storeNotFound,
  };
}
