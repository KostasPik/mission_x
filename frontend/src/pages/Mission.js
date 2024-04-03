import React, { useEffect, useState, useMemo } from 'react'
import axiosInstance from '../api/api'
import { Link, useParams } from 'react-router-dom';
import { formatTimestamp, formatMeasurementTitle } from '../utils/utils';
import LineChart from '../components/LineChart';
import './Mission.css'

export default function Mission() {

    const {missionID} = useParams();
    const [missionConfiguration, setMissionConfiguration] = useState(null);
    const [missionData, setMissionData] = useState(null);
    const [loading, setLoading] = useState(true);

    /* USED FOR CONFIGURING THE PANELS/NUMBERS BEGIN */

    const lines = useMemo(() => {
        const lineKeys = [];
        if (missionConfiguration) {
            Object.keys(missionConfiguration.metricsConfiguration).forEach(key => {
                const representation = missionConfiguration.metricsConfiguration[key].representation;
                if (representation === 'line') {
                    lineKeys.push(key);
                }
            });
        }
        return lineKeys;
    }, [missionConfiguration]);

    const numbers = useMemo(() => {
        const numberKeys = [];
        if (missionConfiguration) {
            Object.keys(missionConfiguration.metricsConfiguration).forEach(key => {
                const representation = missionConfiguration.metricsConfiguration[key].representation;
                if (representation === 'number') {
                    numberKeys.push(key);
                }
            });
        }
        return numberKeys;
    }, [missionConfiguration]);

    /* USED FOR CONFIGURING THE PANELS/NUMBERS END */

    async function fetchMissionConfiguration() {
        const response = await axiosInstance.get(`/missions/configuration/${missionID}`);
        setMissionConfiguration(response?.data);
    }

    async function fetchMissionData() {
        const response = await axiosInstance.get(`/telemetry/${missionID}`);
        setMissionData(response?.data);
        setLoading(false);
    }

    async function downloadCSV() {
        const response = await axiosInstance.get(`/telemetry/csv/${missionID}`);
        const csvData = response?.data
        const filename = `${missionID}_telemetry_data.csv`;
        const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /* fetches missionConfiguration */
    useEffect(() => {
        if (!missionConfiguration)
            fetchMissionConfiguration();
    }, [])

    /* once mission configuration is avaiable start getting logs */
    useEffect(() => {
        if (!missionConfiguration)
            return

        fetchMissionData();
        const intervalID = setInterval(fetchMissionData, 250);
        return () => clearInterval(intervalID);

    }, [missionConfiguration])

if (!loading && missionData && missionData.length > 0)
  return (
    <div className='page-container'>
        
        <div className='mission-control-links'>
            <Link to='#' onClick={downloadCSV} className='border-link'>Download CSV</Link>
            <Link to='/' className='border-link'>Back to missions</Link>
        </div>

        <h1 className='page-title title-with-line'>Mission: #{missionID}</h1>
        <div className='mission-text-metrics'>
            {(missionData && numbers) && numbers.map(numberKey => {
                return <h4>{formatMeasurementTitle(numberKey)}: {missionData[0].metrics[numberKey]} {missionConfiguration.metricsConfiguration[numberKey]?.units}</h4>
            })}
            <h4>Last Update On: {formatTimestamp(missionData[0].timestamp)}</h4>
        </div>
        <div className='mission-charts'>
            {(missionData && lines) && lines.map(key => {
                return <LineChart missionData={missionData.map(data => ({
                    values: data.metrics[key],
                    timestamp: data.timestamp
                }))} title={formatMeasurementTitle(key)} units={missionConfiguration.metricsConfiguration[key].units} startingTimestamp={missionData[0].timestamp}/>
            })}
        </div>
    </div>
  )
}
