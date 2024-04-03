import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import './LineChart.css'


Chart.register(CategoryScale, LinearScale, LineElement, PointElement);

const LineChart = ({missionData, title, units, startingTimestamp, lineColor='rgba(75,192,192,1)'}) => {

  const data = {
    labels: Array(missionData.length).fill(''),
    datasets: [
      {
        label: {title},
        // data: [65, 59, 80, 81, 56, 55, 40],
        data: [...missionData.slice(0, 10).flatMap(doc => doc.values)].reverse(),
        fill: false,
        borderColor: lineColor,
        tension: 0.1
      }
    ]
  };

  const options = {
    animation: {
        duration: 0,
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          color: '#F2F3F5'
        },
        ticks: {
            display: false,
        }
      },
      y: {
        type: 'linear',
        grid: {
          color: '#F2F3F5'
        }
      },
    },
      };

  return (
    <div>
        <h3 className='chart-title'>{title}</h3>
        <h4 className='chart-title'>{missionData[0].values} {units}</h4>
        <Line data={data} options={options} style={{width: 400, height: 400}} />
    </div>
  );
};

export default LineChart;
