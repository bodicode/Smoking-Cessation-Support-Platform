'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';
import Loading from '../common/Loading';

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
            <XAxis
              dataKey="date"
              fontSize={12}
              tickFormatter={(date: string) => {
                // Ưu tiên parse dạng yyyy-MM-dd
                let d = new Date(date);
                if (!isNaN(d.getTime())) {
                  // Lấy ngày/tháng, bỏ năm
                  const day = d.getDate().toString().padStart(2, '0');
                  const month = (d.getMonth() + 1).toString().padStart(2, '0');
                  return `${day}-${month}`;
                }
                // Nếu không parse được, thử tách thủ công
                // Hỗ trợ cả dạng dd/MM/yyyy
                const parts = date.split(/[/-]/);
                if (parts.length >= 2) {
                  return `${parts[0]}-${parts[1]}`;
                }
                return date;
              }}
            />
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
            <XAxis
              dataKey="date"
              fontSize={12}
              tickFormatter={(date: string) => {
                let d = new Date(date);
                if (!isNaN(d.getTime())) {
                  const day = d.getDate().toString().padStart(2, '0');
                  const month = (d.getMonth() + 1).toString().padStart(2, '0');
                  return `${day}-${month}`;
                }
                const parts = date.split(/[/-]/);
                if (parts.length >= 2) {
                  return `${parts[0]}-${parts[1]}`;
                }
                return date;
              }}
            />
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

export function PlanStageTrendChart({ stages }: { stages: any[] }) {
  if (!stages?.length) return null;
  return (
    <div className="flex flex-col gap-7 rounded-2xl p-4">
      <h3 className="font-bold text-3xl mb-3 text-[#01613B] text-center">Biểu đồ số điếu/ngày theo từng giai đoạn</h3>
      {stages.map((stage) => {
        const maxY = Math.max(
          stage.max_cigarettes_per_day ?? 0,
          ...stage.chart_data.map((d: any) => d.cigarettes_smoked)
        );
        return (
          <div key={stage.stage_id} className="mb-8 bg-white rounded-xl shadow p-4">
            <div className="font-semibold text-sky-700 mb-2">
              Giai đoạn {stage.stage_order}: {stage.title}
            </div>
            <div className="h-[280px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stage.chart_data} margin={{ top: 30, right: 10, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickFormatter={(date: string) => {
                      const d = new Date(date);
                      if (!isNaN(d.getTime())) {
                        return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                      }
                      return date.slice(0, 5);
                    }}
                  />
                  <YAxis
                    label={{ value: "Điếu/ngày", angle: -90, position: "insideLeft" }}
                    allowDecimals={false}
                    domain={[
                      0,
                      (dataMax: number) =>
                        Math.max(
                          dataMax,
                          stage.max_cigarettes_per_day ? stage.max_cigarettes_per_day + 1 : 0
                        ),
                    ]}
                  />
                  <Tooltip formatter={formatNumber} />
                  {typeof stage.max_cigarettes_per_day === 'number' && maxY > stage.max_cigarettes_per_day && (
                    <ReferenceArea
                      y1={stage.max_cigarettes_per_day}
                      y2={maxY}
                      strokeOpacity={0}
                      fill="#fee2e2"
                      fillOpacity={0.5}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="cigarettes_smoked"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    name="Điếu/ngày"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          key={payload.date}
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={payload.exceeded_limit ? "#ef4444" : "#16a34a"}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={(props: any) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          key={payload.date + "-active"}
                          cx={cx}
                          cy={cy}
                          r={7}
                          fill={payload.exceeded_limit ? "#ef4444" : "#16a34a"}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                  />
                  {typeof stage.max_cigarettes_per_day === 'number' && (
                    <ReferenceLine
                      y={stage.max_cigarettes_per_day}
                      stroke="#ef4444"
                      strokeDasharray="6 3"
                      label={{
                        value: `Giới hạn: ${stage.max_cigarettes_per_day}`,
                        position: 'insideTop',
                        fill: '#ef4444',
                        fontSize: 12,
                        dy: 10,
                      }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SmokeFreeChart({ records, stages }: { records: any[], stages: any[] }) {
  const [loadingCharts, setLoadingCharts] = useState(false);

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
      {loadingCharts && <div className="my-8"><Loading color="#fff" /></div>}
      {stages && stages.length > 0 && (
        <PlanStageTrendChart stages={stages} />
      )}
    </div>
  );
}
