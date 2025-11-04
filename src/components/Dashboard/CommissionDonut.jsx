import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Farmers", value: 65, color: "hsl(142, 71%, 45%)" }, // green-600
  { name: "Buyers", value: 35, color: "hsl(221, 83%, 53%)" }, // blue-600
];

const CommissionDonut = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            formatter={(value, entry) => `${entry.payload.name}: ${entry.payload.value}%`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommissionDonut;