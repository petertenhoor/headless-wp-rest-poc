const express = require('express')
const next = require('next')
const compression = require("compression")
const cors = require('cors')

const server = express()
const dev = process.env.NODE_ENV !== 'production'
const app = next({dir: '.', dev})
const handle = app.getRequestHandler()
const port = process.argv[2] ? process.argv[2] : 3000

server.use(compression({threshold: 0}))
server.use(cors())

app.prepare().then(() => {
    server.get('/_next/*', (req, res) => handle(req, res))
    server.get('/posts', (req, res) => handle(req, res))
    server.get('/post/:slug/', (req, res) => app.render(req, res, '/post', {slug: req.params.slug}))
    server.get('/:slug/', (req, res) => app.render(req, res, '/page', {slug: req.params.slug}))
    server.get('*', (req, res) => handle(req, res))
})

server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
})