const fastify = require('fastify')({ logger: true, bodyLimit: 9999999 })
const fastifyMultipart = require('@fastify/multipart')
const path = require('path')
const fs = require('fs')
fastify.register(fastifyMultipart, { attachFieldsToBody: true, limits: 9999999 })

fastify.post('/upload', async (req, reply) => {
    // Access uploaded files using field names
    const file = await req.body.file.toBuffer()
    // Process the files as needed
    // ...

    fs.writeFile(path.join(__dirname, 'uploads', req.body.file.filename), await req.body.file.toBuffer(), (err, data) => {
        if(err) return res.code(500).send('error')
        else return res.send(req.body.file.filename + ' uploaded.')
    });


    
})

fastify.register(require('@fastify/static'), { root: path.join(__dirname, 'static') });

fastify.get('/uploads/:id', (req, res) => {
    fs.access(`uploads/${req.params.id}`, err => {
        if(err) return res.code(404).send('no file found')
        else{
            res.header('Content-Disposition', 'attachment; filename=' + req.params.id);
            res.sendFile('uploads/' + req.params.id)
        }
    })
})

fastify.listen({ port: 80, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
})
