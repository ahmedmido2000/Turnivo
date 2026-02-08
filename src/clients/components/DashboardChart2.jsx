import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const DashboardChart2 = () => {
  // Data for the chart based on the image
  const labels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'In progress',
        data: [5, 8, 13, 10, 7, 12, 15, 11, 9, 14, 18, 16, 13, 10],
        borderColor: '#4F617D',
        backgroundColor: '#4F617D',
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 4,
      },
      {
        label: 'Canceled',
        data: [15, 18, 22, 20, 25, 30, 28, 32, 35, 30, 25, 20, 18, 15],
        borderColor: '#292760',
        backgroundColor: '#292760',
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 4,
      },
      {
        label: 'Finished',
        data: [10, 15, 20, 25, 30, 35, 40, 42, 45, 42, 40, 38, 35, 30],
        borderColor: '#F59331',
        backgroundColor: '#F59331',
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 4,
      }
    ],
  };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    datalabels: {
      display: false, // 🔥 الحل
    },
  },
  scales: {
    y: {
      min: 0,
      max: 50,
      position: 'right',
      ticks: {
        stepSize: 10,
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)', 
      }
    },
    x: {
      grid: {
        display: false,
      }
    }
  }
};


  // Custom legend items with values
  const legendItems = [
    { 
      label: 'In progress', 
      color: '#4F617D',
      value: 13,
      trend: 'up' // up, down, or stable
    },
    { 
      label: 'Canceled', 
      color: '#292760',
      value: 16,
      trend: 'down'
    },
    { 
      label: 'Finished', 
      color: '#F59331',
      value: 24,
      trend: 'up'
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Title on the left */}
        <h2 className="charts-title">Jobs for 2025</h2>
        
        {/* Custom legend on the right */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {legendItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Label at the top */}
              <span style={{ fontSize: '10px', marginBottom: '1px', color:'#556987', fontWeight:'400' }}>{item.label}</span>
              
              {/* Value, arrow, and circle at the bottom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {/* Arrow icon based on trend */}
                {item.trend === 'up' ? (
                  <MovingOutlinedIcon 
                    style={{ 
                      color: '#2DCA72',
                      fontSize: '14px'
                    }} 
                  />
                ) : (
                  <TrendingDownOutlinedIcon 
                    style={{ 
                      color: '#FF3B30',
                      fontSize: '14px'
                    }} 
                  />
                )}
                
                {/* Number value */}
                <span style={{ fontSize: '14px', color:'#000000', fontWeight:'500' }}>{item.value}</span>
                
                {/* Colored circle */}
                <div 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: item.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart in the middle */}
      <div style={{ height: '200px', flex: 1, margin: '0 20px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart2;