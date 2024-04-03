const fastify = require('fastify')();
const mongoose = require('mongoose');
const telemetryRoutes = require('./routes/telemetry/router.js');
const flightConfigurationRoutes = require('./routes/missions/router.js');

require('dotenv').config();

/*  Start mongodb connection    */
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected."))
.catch(err => console.log("MongoDB connection error:", err));


/*  CORS fix    */
fastify.register(require('@fastify/cors'), {
    origin: true,
})


/* All routes should list for prefix /api */
fastify.register(telemetryRoutes, {prefix: '/api'});
fastify.register(flightConfigurationRoutes, {prefix: '/api'});

/*  Make fastify listen for requests */
fastify.listen({ port: parseInt(process.env.SERVER_PORT), host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
})