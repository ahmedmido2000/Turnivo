import React, { useState, useEffect } from 'react';
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
import { getHomeDashboardData } from '../../api/generalSiteApi';

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
  const [chartDataState, setChartDataState] = useState({
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        label: 'In progress',
        data: new Array(14).fill(0),
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
        data: new Array(14).fill(0),
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
        data: new Array(14).fill(0),
        borderColor: '#F59331',
        backgroundColor: '#F59331',
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 4,
      }
    ],
  });

  const [legendData, setLegendData] = useState([
    { label: 'In progress', color: '#4F617D', value: 0, trend: 'stable' },
    { label: 'Canceled', color: '#292760', value: 0, trend: 'stable' },
    { label: 'Finished', color: '#F59331', value: 0, trend: 'stable' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const response = await getHomeDashboardData(token);
        
        if (response.status === 1 && response.data && response.data[0]) {
          const apiData = response.data[0];
          const monthsOrder = ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'];
          
          const inProgressData = [];
          const canceledData = [];
          const finishedData = [];
          const labels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

          monthsOrder.forEach(month => {
            const mData = apiData[month] || { progress: 0, cancel: 0, complete: 0 };
            inProgressData.push(parseInt(mData.progress) || 0);
            canceledData.push(parseInt(mData.cancel) || 0);
            finishedData.push(parseInt(mData.complete) || 0);
          });

          setChartDataState(prev => ({
            ...prev,
            datasets: [
              { ...prev.datasets[0], data: inProgressData },
              { ...prev.datasets[1], data: canceledData },
              { ...prev.datasets[2], data: finishedData },
            ]
          }));

          // Calculate current values and trends (comparing last 2 points if helpful, but for now just showing actuals)
          setLegendData([
            { label: 'In progress', color: '#4F617D', value: inProgressData[inProgressData.length - 1], trend: inProgressData[inProgressData.length - 1] >= inProgressData[inProgressData.length - 2] ? 'up' : 'down' },
            { label: 'Canceled', color: '#292760', value: canceledData[canceledData.length - 1], trend: canceledData[canceledData.length - 1] >= canceledData[canceledData.length - 2] ? 'up' : 'down' },
            { label: 'Finished', color: '#F59331', value: finishedData[finishedData.length - 1], trend: finishedData[finishedData.length - 1] >= finishedData[finishedData.length - 2] ? 'up' : 'down' }
          ]);
        }
      } catch (error) {
        console.error("Error fetching jobs chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center py-5">Loading...</div>;

  const data = chartDataState;

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
  const legendItems = legendData;

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