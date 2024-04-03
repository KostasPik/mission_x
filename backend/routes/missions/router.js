const {getConfigurationByMissionID, registerMission, getMissions} = require('./handlers');

const flightConfigurationRoutes = async (fastify, options) => {

    /* Get configuration of mission by missionID */
    fastify.get('/missions/configuration/:missionID', getConfigurationByMissionID);

    /* Get all missions */
    fastify.get('/missions', getMissions)
    
    /* Register a new flight */
    fastify.post('/missions/register', registerMission)
};

module.exports = flightConfigurationRoutes;