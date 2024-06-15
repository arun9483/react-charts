import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { faker } from '@faker-js/faker';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary Chart.js components
Chart.register(...registerables, ChartDataLabels);

interface IceCreamData {
  flavor: string;
  likedBy: number;
}

// Utility function to generate realistic ice-cream flavors
const generateRealisticFlavors = (numFlavors: number): string[] => {
  const availableFlavors = [
    'Vanilla',
    'Chocolate',
    'Strawberry',
    'Mint Chocolate Chip',
    'Cookie Dough',
    'Rocky Road',
    'Pistachio',
    'Coffee',
    'Mango',
    'Lemon',
    'Butter Pecan',
    'Cookies and Cream',
    'Salted Caramel',
    'Peach',
    'Raspberry Ripple',
    'Cherry',
    'Coconut',
    'Banana',
    'Maple Walnut',
    'Blackberry',
    'Green Tea',
  ];

  return Array.from(
    { length: numFlavors },
    () =>
      availableFlavors[
        faker.number.int({ min: 0, max: availableFlavors.length - 1 })
      ]
  );
};

// Utility function to generate random survey data for ice-cream flavors
const generateSurveyData = (
  numFlavors: number,
  numPeople: number
): IceCreamData[] => {
  const flavors = generateRealisticFlavors(numFlavors);
  const data: IceCreamData[] = flavors.map((flavor) => ({
    flavor,
    likedBy: faker.number.int({ min: 0, max: numPeople }),
  }));
  return data;
};

// Utility function to generate random colors
const generateColors = (numColors: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(
      `rgba(${faker.number.int({
        min: 0,
        max: 255,
      })}, ${faker.number.int({
        min: 0,
        max: 255,
      })}, ${faker.number.int({ min: 0, max: 255 })}, 0.7)`
    );
  }
  return colors;
};

const IceCreamFlavourChartDoughnut = () => {
  const [chartData, setChartData] = useState<ChartData<'doughnut'>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Define the number of flavors and number of people in the survey
    const numFlavors = 7;
    const numPeople = 100;

    // Generate survey data
    const surveyData = generateSurveyData(numFlavors, numPeople);
    const labels = surveyData.map((data) => data.flavor);
    const likedBy = surveyData.map((data) => data.likedBy);
    const colors = generateColors(numFlavors);

    const data: ChartData<'doughnut'> = {
      labels,
      datasets: [
        {
          label: 'Ice Cream Flavor Liked By (%)',
          data: likedBy,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, []);

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw !== null ? context.raw : '';
            const total = context.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage = ((Number(value) / total) * 100).toFixed(2);
            return `${label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        color: '#fff',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce(
            (acc: number, val: number) => acc + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return `${
            context.chart.data.labels[context.dataIndex]
          }: ${percentage}%`;
        },
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
      <h2>Favorite Ice-Cream Flavors</h2>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default IceCreamFlavourChartDoughnut;
