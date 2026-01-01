"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskAnalytics as TaskAnalyticsData } from "@/lib/api/tasks";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export const TaskAnalytics = ({ data }: { data: TaskAnalyticsData }) => {
  const statusData = [
    { name: "Todo", value: data.todoTasks, color: COLORS[0] },
    { name: "In Progress", value: data.inProgressTasks, color: COLORS[1] },
    { name: "Completed", value: data.completedTasks, color: COLORS[2] },
  ];

  const priorityData = data.priorityBreakdown.map((item) => ({
    name: item.priority,
    value: item._count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard title="Total Tasks" value={data.totalTasks} />
        <MetricCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          trend="+5%"
        />
        <MetricCard
          title="Todo"
          value={data.todoTasks}
          color="text-slate-500"
        />
        <MetricCard title="Overdue" value={0} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.1}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  opacity={0.1}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  color = "text-foreground",
  trend,
}: {
  title: string;
  value: string | number;
  color?: string;
  trend?: string;
}) => (
  <Card className="bg-muted/10">
    <CardContent className="space-y-1 p-4">
      <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </div>
      <div className="flex items-baseline justify-between">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        {trend && (
          <div className="text-[10px] font-bold text-emerald-600">{trend}</div>
        )}
      </div>
    </CardContent>
  </Card>
);
