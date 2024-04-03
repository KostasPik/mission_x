import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../api/api';
import { formatTimestamp } from '../utils/utils';
import Preloader from '../components/Preloader';
import './Missions.css'


export default function Missions () {

    const [missions, setMissions] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchFlights() {
        const response = await axiosInstance.get('/missions');
        setMissions(response?.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchFlights();
    }, [])


  return (
    <div className='page-container'>
      <h1 className='page-title title-with-line'>Missions</h1>
      {loading ? 
        <Preloader text={"Fetching missions..."}/> 
      : 
        <div className='missions-container'>
          {missions && missions.map((mission) => {
            return <div className='mission-card'>
              <h3>Mission ID: #{mission.missionID}</h3>
              <small className='created-at'>{formatTimestamp(mission.createdAt)}</small>
              <Link to={`/mission/${mission.missionID}`}>Mission Details</Link>
            </div>
          })}
        </div>
      }

      {(!loading && missions.length === 0) && <div>
        <h1>No missions found.</h1>
        </div>}

    </div>
  )
}
