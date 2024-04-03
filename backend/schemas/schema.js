const mongoose = require('mongoose');


/* Not yet used for something but may be useful in the future */
const _missionStatus = ['active', 'inactive', 'deleted']


/* 
Configures how values are displayed on the frontend (e.g as a simple number/ as a linechart...).
Keys having representation 'line', will be displayed in a line chart.
Keys having representation 'number', will be displayed as a number.
*/
const _representationOfMetricValues = ['number', 'line'];

/* MissionID schema */
const _missionIDSchema = {
    type: String,
    match: /^[A-Z0-9]{7}$/,
    required: true,
    uppercase: true,
}

/* 
This is an object that includes the configuration for a set of metrics.
    missionID:              The ID of the mission. Should be unique in this collection!
    description:            (optional) A simple description of the mission. 
    status:                 The status of the mission.
    createdAt:              When mission configuration was inserted in the db
    metricsConfiguration:   Used for knowing how to display each value in the frontnend panel (e.g. in a linechart).
*/
const MissionConfigurationSchema = new mongoose.Schema({
    missionID: {
        ..._missionIDSchema,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: _missionStatus,
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    metricsConfiguration: {
        type: Map,
        of: {
            representation: {
                type: String,
                enum: _representationOfMetricValues,
                required: true,
            },
            units: { // units for value (e.g m/s, m, volts...)
                type: String,
                required: false,
            },
            _id: false,
        },
        _id: false
    }
}, {
    versionKey: false,
})

/* 
This is an object that holds the logs recorded for a given missionID and a given time instance. 
    missionID:      The ID of the mission.
    timestamp:      The timestamp of the mission telemetry log.
    metrics:        Object containing all the telemetry data of the mission as key-value pairs.
*/
const MissionTelemetrySchema = new mongoose.Schema({
    missionID: _missionIDSchema,
    timestamp: {
        type: Number,
        required: true,
    },
    metrics: {
        type: Map,
        of: {
            type: Number,
        },
        required: true,
        _id: false,
    },
}, {
    versionKey: false,
});

/* Telemetry logs are queried by the missionID and sorted by timestamp (e.g. we serve the latest 10 mission logs) */
MissionTelemetrySchema.index({
    missionID: 1,
    timestamp: -1,
})

MissionConfigurationSchema.index({
    createdAt: -1,
})


const MissionTelemetryModel = mongoose.model('Telemetry', MissionTelemetrySchema);
const MissionConfigurationModel = mongoose.model('Configuration', MissionConfigurationSchema);

module.exports = {MissionTelemetryModel, MissionConfigurationModel};