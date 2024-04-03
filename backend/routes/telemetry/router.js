const {getLogsByID, saveTelemetryLog, getLogsCSV} = require('./handlers');


const telemetryRoutes = async (fastify, options) => {

    /* Get latest logs by missionID */
    fastify.get('/telemetry/:missionID', getLogsByID);

    /* Save telemetry log */
    fastify.post('/telemetry/add-log', saveTelemetryLog);

    /* Download all telemetry logs by missionID in csv format */
    fastify.get('/telemetry/csv/:missionID', getLogsCSV);
};

module.exports = telemetryRoutes;