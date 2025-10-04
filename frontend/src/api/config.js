import { sendRejectedResponse } from "../utils/responseHandler";

//this function will request the config file from the server
export async function getConfig() {
  const res = await fetch("/config.json");
  if (!res.ok)
    throw new Error(
      sendRejectedResponse({
        message:
          "Failed to load config please contact your system adminstrator",
      })
    );
  return await res.json();
}
