import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DashboardChart1 = () => {
  const data = [
    { label: 'Finished', value: 13, color: '#292760' },
    { label: 'Canceled', value: 13, color: '#4F617D' },
    { label: 'In progress', value: 13, color: '#F59331' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

 const chartData = {
  labels: data.map(item => item.label),
  datasets: [
    {
      data: data.map(item => item.value),
      backgroundColor: data.map(item => item.color),
      borderWidth: 0,
      cutout: '65%',
      hoverOffset: 20,
      hoverBorderWidth: 3,
      hoverBorderColor: '#fff',
      hoverBackgroundColor: data.map(item => item.color),
    },
  ],
};

const options = {
  responsive: true,
  animation: {
    duration: 400,
    easing: 'easeOutQuart',
  },
  onHover: (event, activeElements) => {
    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
  },
  plugins: {
    legend: { display: false },
    tooltip: { 
      enabled: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#fff',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed;
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: { weight: '600', size: 11 },
      formatter: (value) => `${Math.round((value / total) * 100)}%`,
    },
  },
};

  return (
    <div className="func-card">
      {/* Header */}
      <div className="func-header">
        <h4 className='charts-title'>Functionalities</h4>
        <span className="dots">•••</span>
      </div>

      <div className="func-body">
        {/* Chart */}
        <div className="donut-wrapper" style={{ position: 'relative', width: '200px', height: '200px' }}>
          <Doughnut data={chartData} options={options} />
          {/* Center Text */}
          <div className='shadow rounded-circle d-flex align-items-center justify-content-center flex-column'
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              height: '110px',
              width: '110px',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <div className="center-number m-0" style={{ fontSize: '28px', fontWeight: 'bold' }}>{total}</div>
            <div className="center-label" style={{ fontSize: '14px', color: '#666' }}>Job</div>
          </div>
        </div>

        {/* Legend */}
        <div className="func-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item flex-column">
              <span className="label">{item.label}</span>
              <div className="d-flex align-items-center">
                <span
                    className="dot"
                    style={{ backgroundColor: item.color }}
                />
                <span className="value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardChart1;