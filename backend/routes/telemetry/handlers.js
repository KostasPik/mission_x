const {MissionTelemetryModel} = require('../../schemas/schema');
const {convertToCSV} = require('../../utils/utils.js');

/*  Number of logs to serve client */
const LOG_LIMIT = 10;

/* Serves LOG_LIMIT latest logs */
async function getLogsByID(req, rep) {
    try {
        const missionID = req.params.missionID;
        if (!missionID) {
            return { message: 'You must supply a missionID!' };
        }        
        const logs = await MissionTelemetryModel.find({ missionID: missionID }, {_id: 0})
            .sort({ timestamp: -1 })
            .limit(LOG_LIMIT)
            .lean()
            .exec();
        return logs;

    } catch (error) {
        rep.code(500).send({ success: false, error: error.message });
    }
}

/*  Saves a log for a given missionID   */
async function saveTelemetryLog(req, rep) {
    try {
        const {missionID, timestamp, metrics} = req.body;

        const missionLog = new MissionTelemetryModel({
            missionID,
            timestamp,
            metrics
        });

        await missionLog.save()
        rep.status(201).send({ message: 'Mission telemetry log saved successfully.' });
    } catch (error) {
        console.error(error);
        rep.status(500).send({ message: 'Internal server error.' });
    }
}


async function getLogsCSV(req, rep) {
    const missionID = req.params.missionID;
    
    if (!missionID)
        return {message: 'You must supply a missionID'}

    const telemetryData = await MissionTelemetryModel.find({missionID: missionID}, {_id: 0})
    .sort({timestamp: -1})
    .lean()
    .exec();

    const csvData = convertToCSV(telemetryData);
    rep.header('Content-Type', 'text/csv');
    rep.header('Content-Disposition', `attachment; filename="${missionID}_telemetry_data.csv"`);
    rep.send(csvData);
}

module.exports = {getLogsByID, getLogsCSV, saveTelemetryLog}