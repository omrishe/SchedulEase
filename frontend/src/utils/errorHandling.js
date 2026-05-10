// Maps server error codes to friendly UI messages.
// Usage: getErrorMessage(response.code)
export const ERROR_CODES = {
  // Generic
  INTERNAL_ERROR: "Something went wrong. Please try again later.",

  // Auth errors
  AUTH_MISSING_FIELDS: "Please fill in all required fields.",
  AUTH_INVALID_EMAIL_FORMAT: "Please enter a valid email address.",
  // made it intentionally generic (wrong creds, existing email, weak password)
  AUTH_INVALID_CREDENTIALS:
    "The email or password you entered is incorrect. Please try again.",
  AUTH_VALIDATION_ERROR:
    "Could not create your account. Please check your details and try again.",
  AUTH_FORBIDDEN: "You do not have permission to perform this action.",

  // Store errors
  STORE_NOT_FOUND: "Store not found. Please check the URL and try again.",
  STORE_IDENTIFIER_MISSING:
    "Store information is missing. Please refresh and try again.",
  STORE_CREATE_ERROR:
    "An error occurred while creating the store. Please try again.",
  STORE_SERVICES_ERROR:
    "An error occurred while saving the services. Please try again.",
  STORE_DELETE_SERVICE_ERROR:
    "An error occurred while deleting the service. Please try again.",
  STORE_UPDATE_MISSING_FIELDS:
    "Service ID and Store ID are required to update a service.",
  STORE_UPDATE_SERVICE_ERROR:
    "An error occurred while updating the service. Please try again.",

  // Services errors
  SERVICE_NOT_FOUND: "Service not found. It may have been removed.",

  // Appointments errors
  APPOINTMENT_MISSING_DATA:
    "Please provide all required appointment details before booking.",
  APPOINTMENT_INVALID_DATE:
    "The selected date is invalid. Please choose a different date.",
  APPOINTMENT_DUPLICATE:
    "This appointment already exists. Please refresh the page and try again.",
  SLOT_UNAVAILABLE:
    "Sorry, this time slot is no longer available. Please choose a different time.",
  APPOINTMENTS_FETCH_ERROR:
    "Could not load appointments. Please try again later.",
  APPOINTMENTS_PAST_DATE: "You cannot view appointments for past dates.",

  // Dates errors
  INVALID_DATE_FORMAT:
    "The date format is invalid. Please refresh and try again.",

  // Users errors
  USER_NOT_FOUND:
    "Your account could not be found. Please log out and log back in.",

  // Time Slots errors
  SLOTS_INVALID_DATES: "The dates provided are invalid. Please try again.",
  SLOTS_CREATE_ERROR:
    "An error occurred while adding time slots. Please try again.",
};

// Returns the friendly message for a given error code.
export function getErrorMessage(code) {
  if (ERROR_CODES[code] === undefined) {
    return ERROR_CODES.INTERNAL_ERROR;
  }
  return ERROR_CODES[code];
}
