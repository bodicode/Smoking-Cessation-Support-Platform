'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function formatNumber(n: number) {
  return n.toLocaleString('vi-VN');
}

export function CigaretteChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 w-full">
      <h3 className="text-sky-700 font-bold text-lg mb-2">Số điếu thuốc mỗi ngày</h3>
      <div className="h-[220px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis label={{ value: "Điếu/ngày", angle: -90, position: "insideLeft" }} allowDecimals={false} />
            <Tooltip formatter={formatNumber} />
            <Line
              type="monotone"
              dataKey="cigarettes"
              stroke="#16a34a"
              strokeWidth={2.5}
              name="Điếu/ngày"
              dot={{ r: 4, fill: "#16a34a", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HealthChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <h3 className="text-sky-700 font-bold text-lg mb-2">Điểm sức khỏe mỗi ngày</h3>
      <div className="h-[220px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis label={{ value: "Sức khỏe", angle: -90, position: "insideLeft" }} domain={[0, 10]} />
            <Tooltip formatter={formatNumber} />
            <Line
              type="monotone"
              dataKey="health"
              stroke="#2563eb"
              strokeWidth={2.5}
              name="Điểm sức khỏe"
              dot={{ r: 4, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function SmokeFreeChart({ records }: { records: any[] }) {
  if (!records?.length)
    return <div className="text-gray-400 text-center py-8">Chưa có dữ liệu để vẽ biểu đồ.</div>;

  const data = [...records].sort(
    (a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime()
  ).map(rec => ({
    date: new Date(rec.record_date).toLocaleDateString("vi-VN"),
    cigarettes: rec.cigarettes_smoked,
    health: rec.health_score
  }));

  return (
    <div className="flex flex-col gap-7 rounded-2xl p-4">
      <CigaretteChart data={data} />
      <HealthChart data={data} />
    </div>
  );
}
