import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  ChartOptions,
  ChartData,
  ChartConfiguration,
  registerables,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { faker } from '@faker-js/faker';

// Register the zoom plugin and other Chart.js components
Chart.register(...registerables, zoomPlugin, ChartDataLabels);

interface StockData {
  date: string;
  price: number;
}

const generateStockData = (numPoints: number): StockData[] => {
  const stockData: StockData[] = [];
  const currentDate = new Date();

  for (let i = 0; i < numPoints; i++) {
    stockData.push({
      date: currentDate.toISOString(),
      price: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
    });
    currentDate.setMinutes(currentDate.getMinutes() - 5); // Subtract 5 minutes for each data point
  }

  return stockData.reverse();
};

const StockChart = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Generate fake stock data
        const stockData: StockData[] = generateStockData(100);
        const dates = stockData.map((data) => new Date(data.date));
        const prices = stockData.map((data) => data.price);

        const newChartData = {
          labels: dates,
          datasets: [
            {
              label: 'Stock Price',
              data: prices,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 0.6)',
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        };

        setChartData(newChartData);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        setLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Update every 60 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  useEffect(() => {
    // Check if chartRef and chart instance exist
    if (chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;

      // Update chart data and options
      chartInstance.data = chartData;
      chartInstance.update();
    }
  }, [chartData]); // Trigger update when chartData changes

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    animation: {
      duration: 0,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
      // Disable datalabels for this chart
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const chartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: chartData,
    options: chartOptions,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error}</p>;

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
      <h2>Real-Time Stock Chart</h2>
      <Line ref={chartRef} {...chartConfig} />
    </div>
  );
};

export default StockChart;
