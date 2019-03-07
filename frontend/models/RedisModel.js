import redis from "redis"
import RedisCache from "../utils/RedisCache";

/**
 * -------------------------------------------
 * Setup redis client local
 * -------------------------------------------
 */
const client = redis.createClient()

/**
 * -------------------------------------------
 * Setup redis client live
 * -------------------------------------------
 */
// const client = redis.createClient(
//     port, host
// )
//
// client.auth(password)

const RedisModel = {

    /**
     * Get data from redis
     *
     * @param   {String} key
     * @throws  {Error}
     * @returns {Promise.<*>}
     */
    get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, result) => {
                if (err) return reject(err)
                try {
                    resolve((typeof result === 'string' && result.length > 0) ? JSON.parse(result) : false)
                } catch (err) {
                    reject(err)
                }
            })
        })
    },

    /**
     * Set data to redis
     *
     * @param {String}          key
     * @param {String|Object}   value
     * @param {Boolean|Number}  expiretime
     */
    set(key, value, expiretime = false) {
        const hasExpireTime = (typeof expiretime === 'number' && expiretime > 0)
        const method = hasExpireTime ? 'setex' : 'set'
        const valueString = (typeof value === 'object' ? JSON.stringify(value) : value)
        const params = hasExpireTime ? [key, expiretime, valueString] : [key, valueString]
        client[method].apply(client, params)
    },

    /**
     * Get new instance of RedisCache
     *
     * @param {String} key
     * @returns {RedisCache}
     */
    create(key) {
        return new RedisCache(key)
    }
}

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


export default RedisModel