const express = require('express')
const next = require('next')
const compression = require("compression")
const cors = require('cors')
const redis = require("redis")
const bodyParser = require("body-parser")
const fetch = require("node-fetch")

const server = express()
const dev = process.env.NODE_ENV !== 'production'
const app = next({dir: '.', dev})
const handle = app.getRequestHandler()
const port = process.argv[2] ? process.argv[2] : 3000
const expire = 43200; // <-- one day in minutes

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


server.use(compression({threshold: 0}))
server.use(cors())
server.use(bodyParser.json())

app.prepare().then(() => {

    //handle static next.js assets with their handler
    server.get('/_next/*', async (req, res) => handle(req, res))

    //handle redis flushing
    server.post('/flush-cache', async (req, res) => {
        flushRedisCache().then((amount) => {
            console.log(`Successfully flushed ${amount} items from Redis cache.`)
            res.send(`Successfully flushed ${amount} items from Redis cache.`)
        })
    })

    //handle api caching
    server.post('/api', async (req, res) => {
        if (req.body.hasOwnProperty('url')) return fetchAndCache(req.body.url, res)
        else res.status(500)
    })

    //handle blog archive route
    server.get('/blog', async (req, res) => {
        if (dev) handle(req, res)
        else return renderAndCache(req, res)
    })

    //handle single blog route
    server.get('/blog/:slug/', async (req, res) => {
        if (dev) app.render(req, res, '/single-blog', {slug: req.params.slug})
        else return renderAndCacheDynamic(req, res, '/single-blog', {slug: req.params.slug})
    })

    //handle page route
    server.get('/:slug/', async (req, res) => {
        if (dev) app.render(req, res, '/page', {slug: req.params.slug})
        else return renderAndCacheDynamic(req, res, '/page', {slug: req.params.slug})
    })

    //let next.js handler handle everything else
    server.get('*', async (req, res) => {
        handle(req, res)
    })
})

server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    flushRedisCache()
    console.log(`> Ready on http://127.0.0.1:${port}`)
})


async function fetchAndCache(key, res) {
    const apiRedis = RedisModel.create('api-cache')
    const data = await apiRedis.get(`api-cache_${key}`)

    if (data !== false) {
        console.log(`serving from cache ${key}`);
        res.setHeader('x-cache', 'HIT');
        res.send(data);
        return
    }

    try {
        const apiData = await (await fetch(key)).json()

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(apiData)
            return
        }

        // Let's cache this page
        apiRedis.set(`api-cache_${key}`, apiData, expire)
        res.setHeader('x-cache', 'MISS')
        console.log(`Missed ${key}`)
        res.send(apiData)

    } catch (err) {
        res.status(500)
    }

}

/**
 * Render and cache simple route
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function renderAndCache(req, res) {
    const key = `ssr-cache_${req.path}`
    const ssrRedis = RedisModel.create('ssr-cache')
    const data = await ssrRedis.get(key)

    // If we have a page in the cache, let's serve it
    if (data !== false) {
        console.log(`serving from cache ${key}`);
        res.setHeader('x-cache', 'HIT');
        res.send(data);
        return
    }

    try {
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, req.path, req.query);

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html);
            return
        }

        // Let's cache this page
        ssrRedis.set(key, html, expire)
        res.setHeader('x-cache', 'MISS');
        console.log(`Missed ${key}`);
        res.send(html)

    } catch (err) {
        app.renderError(err, req, res, req.path, req.query)
    }
}


/**
 * Handle and cache dynamic route
 *
 * @param req
 * @param res
 * @param path
 * @param query
 * @returns {Promise<void>}
 */
async function renderAndCacheDynamic(req, res, path, query) {
    const key = `ssr-cache_${req.path}`
    const ssrRedis = RedisModel.create('ssr-cache')
    const data = await ssrRedis.get(key)

    // If we have a page in the cache, let's serve it
    if (data !== false) {
        console.log(`serving from cache ${key}`);
        res.setHeader('x-cache', 'HIT');
        res.send(data);
        return
    }

    try {
        //console.log(`key ${key} not found, rendering`);
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, path, query);

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html);
            return
        }

        // Let's cache this page
        ssrRedis.set(key, html, expire)
        res.setHeader('x-cache', 'MISS');
        console.log(`Missed ${key}`);
        res.send(html)

    } catch (err) {
        app.renderError(err, req, res, path, query)
    }
}

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
                    resolve((typeof result === 'string' && result.length > 0) ? result : false)
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
    },

    /**
     * Flush SSR cache
     * @param prefix
     */
    flushByPrefix(prefix) {
        return new Promise((resolve) => {
            client.keys(`${prefix}*`, (err, keys) => {
                if (keys.length > 0) {
                    client.del(keys, (err, amount) => {
                        resolve(amount)
                    })
                } else {
                    resolve(0)
                }
            })
        })

    }
}

function flushRedisCache() {
    const flushSsrCachePromise = RedisModel.flushByPrefix('ssr-cache')
    const flushApiCachePromise = RedisModel.flushByPrefix('api-cache')
    return Promise.all([flushSsrCachePromise, flushApiCachePromise]).then((results) => parseInt(results[0]) + parseInt(results[1]))
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