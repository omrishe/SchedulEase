import { sendRejectedResponse } from "../utils/responseHandler";

//this function will request the config file from the server
export async function getConfig() {
  const res = await fetch("/config.json");
  if (!res.ok) {
    console.error(
      "Failed to load config please contact your system administrator"
    );
    throw new Error(
      "Failed to load config please contact your system administrator"
    );
  }
  return await res.json();
}
