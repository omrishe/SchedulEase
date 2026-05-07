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
  get: (withCred = true) => {
    const options = {
      method: "GET",
    };
    if (withCred) {
      options.credentials = "include";
    }
    return options;
  },

  post: (withCred = true) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (withCred) {
      options.credentials = "include";
    }
    return options;
  },

  patch: (withCred = true) => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (withCred) {
      options.credentials = "include";
    }
    return options;
  },

  delete: (withCred = true) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (withCred) {
      options.credentials = "include";
    }
    return options;
  },
};
