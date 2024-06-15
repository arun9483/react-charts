import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, ChartData, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { faker } from '@faker-js/faker';

Chart.register(...registerables, ChartDataLabels);

interface PopulationData {
  year: number;
  china: number;
  india: number;
  usa: number;
}

// Generate mock population data
const generatePopulationData = (): PopulationData[] => {
  const data: PopulationData[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 10; i >= 1; i--) {
    const year = currentYear - i;
    data.push({
      year,
      china: faker.number.int({ min: 1300000000, max: 1400000000 }),
      india: faker.number.int({ min: 1200000000, max: 1400000000 }),
      usa: faker.number.int({ min: 300000000, max: 350000000 }),
    });
  }

  return data;
};

const PopulationChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>();

  useEffect(() => {
    const populationData = generatePopulationData();

    const data: ChartData<'bar'> = {
      labels: populationData.map((d) => d.year.toString()),
      datasets: [
        {
          label: 'China',
          data: populationData.map((d) => d.china),
          backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'India',
          data: populationData.map((d) => d.india),
          backgroundColor: 'rgba(127, 127, 127, 0.8)', // Green
          borderColor: 'rgba(127, 127, 127, 1)',
          borderWidth: 1,
        },
        {
          label: 'USA',
          data: populationData.map((d) => d.usa),
          backgroundColor: 'rgba(255, 159, 64, 0.8)', // Orange
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
    setChartData(data);
  }, []);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Population',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      // Disable datalabels for this chart
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div
      style={{
        width: '800px',
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2>Population Chart</h2>
      {chartData && <Bar data={chartData} options={chartOptions} />}
    </div>
  );
};

export default PopulationChart;
