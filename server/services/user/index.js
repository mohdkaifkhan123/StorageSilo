import redisClient from "../../config/redis.js"

const logoutService=async(token)=>{
       await redisClient.del(`session:${token}`);
}

const UserServices={
    LogoutService:logoutService
}

export default UserServices