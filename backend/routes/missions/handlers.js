const {MissionConfigurationModel} = require('../../schemas/schema.js')


async function getConfigurationByMissionID(req, rep) {
    /*  Get mission configuration by missionID  */

    const missionID = req.params.missionID;
    if (!missionID)
        return {message: "You must supply a missionID!"};

    const missionConfig = await MissionConfigurationModel.findOne({missionID: missionID});
    return missionConfig;
}

async function getMissions(req, rep) {
    /* Get all missions */
    
    const documents = await MissionConfigurationModel.find().sort({createdAt: -1});
    return documents;
}

async function registerMission(req, rep) {
    /* Create a new mission configuration */
    try {
        const {missionID, metricsConfiguration} = req.body;
        if (!missionID || !metricsConfiguration)
            return {message: "You must supply a missionID and a metricsConfiguration!"}
        
        const flightConfiguration = new MissionConfigurationModel({
            missionID: missionID,
            metricsConfiguration: metricsConfiguration,
        });
        await flightConfiguration.save();
        return rep.status(201).send({message: "Mission configuration set up successfully!"})
    } catch(err) {
        console.log(err);
        return rep.status(400).send({message: "Failed ro register mission!"});
    }
}

module.exports = {getConfigurationByMissionID, getMissions, registerMission}