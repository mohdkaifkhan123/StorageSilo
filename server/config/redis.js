import { createClient } from "redis";

const redisClient=createClient({
    url:process.env.REDIS_URI,
    socket:{
        connectTimeout:5000
    },
})

redisClient.on("error",(err)=>{
    console.error("Redis client error",err.message);
})

try{
    await redisClient.connect()
}catch(err){
    console.error("Initial Redis connection failed",err.message)
}
export default redisClient