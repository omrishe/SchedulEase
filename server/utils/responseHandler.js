/** a helper function designed to make server responses consistant incase of success
 * @param data data object containting the data to send
 * @return a pattern object containing the pattern data to send
 */
function sendSucessResponse(data) {
  return {
    code: data.code || "success",
    type: "successResponse",
    isSuccess: true,
    //msg is intentional,its a custom msg that was set
    message: data.message || "no message was provided",
    otherData: data.otherData || {},
  };
}
/** a helper function designed to make server responses consistant incase of error
 * @param data an object containing the error
 * @return a pattern object containing the pattern data to send
 */
function sendRejectedResponse(data = {}) {
  return {
    code: data.code || "INTERNAL_ERROR",
    type: data.type || "errorResponse",
    isSuccess: false,
    //msg is intentional,its a custom msg that was set
    message: data.message || "an error occured",
    otherData: data.otherData || {},
  };
}

module.exports = { sendSucessResponse, sendRejectedResponse };
