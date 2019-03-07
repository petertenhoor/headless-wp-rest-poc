import RedisModel from "../models/RedisModel";

class RedisCache {

    constructor(key) {
        this.key = key
    }

    async get(value) {
        return await RedisModel.get(`${this.key}_${value}`)
    }

    set(id, value, expire) {
        RedisModel.set(`${this.key}_${id}`, value, expire)
    }
}

export default RedisCache