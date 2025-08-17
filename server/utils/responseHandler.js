/*a helper function designed to make server responses consistant 
// handles both error data and success data
//fils all field regardless of type
*/

function serilizeResponse(data) {
  const isError = data instanceof Error;
  return {
    message:
      data.message ||
      (isError ? "an error occured" : "no message was provided"),
    details:
      data.details ||
      (isError ? "an error occured" : "no details was provided"),
    stack:
      data.stack || (isError ? "an error occured" : "no stack was provided"),
  };
}

module.exports = { serilizeResponse };
