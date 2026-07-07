export const CreateError=(message,statusCode=500,extra={})=>{
    const tempError=new Error(message)
    return Object.freeze({
    name: 'CustomError',
    message,
    statusCode,
    isOperational: true,
    timestamp: new Date().toISOString(),
    code: extra.code || null,
    details: extra.details || null,
    log: extra.log || null,
    stack: tempError.stack 
  });
}