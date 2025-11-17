/** a helper function designed to make server responses consistant incase of error
 * @param data an object containing the error
 * @return a pattern object containing the pattern data to send
 */
export function sendRejectedResponse(data) {
  return {
    code: data.code || "INTERNAL_ERROR",
    type: data.type || "errorResponse",
    isSuccess: false,
    message: data.message || "an error occured",
    otherData: data.otherData || {},
  };
}
