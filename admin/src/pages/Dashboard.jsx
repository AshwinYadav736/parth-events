
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const { token } = useAuth();

  const [totalLeads, setTotalLeads] = useState(0);
  const [monthlyLeads, setMonthlyLeads] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/leads",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setTotalLeads(data.length);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthCount = data.filter((lead) => {
        const date = new Date(lead.createdAt);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      }).length;

      setMonthlyLeads(monthCount);
    } catch (error) {
      console.error(error);
    }
  };

  const getPercentage = (value, max) => {
    if (max === 0) return 0;
    return Math.round((value / max) * 100);
  };

  const createData = (percent) => [
    { name: "filled", value: percent },
    { name: "empty", value: 100 - percent },
  ];

  const totalPercent = totalLeads > 0 ? 100 : 0;
  const monthPercent = getPercentage(monthlyLeads, totalLeads);

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Overview of your business insights</p>
      </div>

      <div className="charts-container">

        {/* TOTAL */}
        <div className="chart-card">
          <h3>Total Leads</h3>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <defs>
                  <linearGradient id="gradientTotal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="#434343" />
                  </linearGradient>
                </defs>

                <Pie
                  data={createData(totalPercent)}
                  dataKey="value"
                  innerRadius={75}
                  outerRadius={88}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  animationDuration={1200}
                >
                  <Cell fill="url(#gradientTotal)" />
                  <Cell fill="#f0f0f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <span className="main-number">{totalLeads}</span>
              <span className="percentage-text">
                {totalPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* MONTH */}
        <div className="chart-card">
          <h3>This Month</h3>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <defs>
                  <linearGradient id="gradientMonth" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#666666" />
                  </linearGradient>
                </defs>

                <Pie
                  data={createData(monthPercent)}
                  dataKey="value"
                  innerRadius={75}
                  outerRadius={88}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  animationDuration={1200}
                >
                  <Cell fill="url(#gradientMonth)" />
                  <Cell fill="#f0f0f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <span className="main-number">{monthlyLeads}</span>
              <span className="percentage-text">
                {monthPercent}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}