import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesChart = ({ range }) => {
  const data7d = [
    { date: "Oct 28", sales: 142000 },
    { date: "Oct 29", sales: 158000 },
    { date: "Oct 30", sales: 165000 },
    { date: "Oct 31", sales: 172000 },
    { date: "Nov 1", sales: 168000 },
    { date: "Nov 2", sales: 178000 },
    { date: "Nov 3", sales: 184520 },
  ];

  const data30d = [
    { date: "Oct 5", sales: 132000 },
    { date: "Oct 12", sales: 148000 },
    { date: "Oct 19", sales: 155000 },
    { date: "Oct 26", sales: 168000 },
    { date: "Nov 2", sales: 178000 },
    { date: "Nov 3", sales: 184520 },
  ];

  const data = range === "7d" ? data7d : data30d;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;