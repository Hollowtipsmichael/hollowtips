"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const GOLD = "#D4AF37";
const COLORS = ["#D4AF37", "#A6E22E", "#FF4FA3", "#FF8A3D", "#3BD6C6"];

const tooltipStyle = {
  background: "#141414",
  border: "1px solid #262626",
  borderRadius: 12,
  color: "#f5f5f0",
  fontSize: 12,
};

export function ScansLineChart({
  data,
}: {
  data: { day: string; scans: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#26262680" />
        <XAxis dataKey="day" stroke="#8a8a82" fontSize={11} tickLine={false} />
        <YAxis stroke="#8a8a82" fontSize={11} allowDecimals={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: GOLD, strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="scans"
          stroke={GOLD}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: GOLD }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DevicePieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (data.length === 0)
    return <p className="py-16 text-center text-sm text-muted">No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StatusBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#26262680" vertical={false} />
        <XAxis dataKey="name" stroke="#8a8a82" fontSize={11} tickLine={false} />
        <YAxis stroke="#8a8a82" fontSize={11} allowDecimals={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff08" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
