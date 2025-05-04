import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#ffffff",
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#333",
      titleColor: "#fff",
      bodyColor: "#ddd",
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: "#ffffff", // x-axis labels
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: "#ffffff", // y-axis labels
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
  },
};

export function DailyStatsChart(props: {
  labels: Array<string>;
  learned: Array<number>;
  reviewed: Array<number>;
}) {
  const { labels, learned, reviewed } = props;

  const data = {
    labels,
    datasets: [
      {
        label: "Learned",
        data: learned,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Reviewed",
        data: reviewed,
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
