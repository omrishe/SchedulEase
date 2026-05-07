export function getBaseUrl() {
  if (import.meta.env.DEV) {
    return "";
  }
  if (!import.meta.env.VITE_SERVER_ADDRESS) {
    throw new Error("VITE_SERVER_ADDRESS is not defined");
  }
  return import.meta.env.VITE_SERVER_ADDRESS;
}

export const httpOptions = {
  get: () => ({
    method: "GET",
    credentials: "include",
  }),

  post: () => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }),
};
