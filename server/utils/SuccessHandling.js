export const CustomSuccess = (res,statusCode=200,extra={},message="Success") => {
  const response= Object.freeze({
    name: "CustomAccess",
    message:message,
    statusCode,
    success: true,
    timestamp: new Date().toISOString(),
    code: extra?.code,
  });
  console.log("resss",res,statusCode)
  return res.status(statusCode).json(response)
};
