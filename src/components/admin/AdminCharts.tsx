"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rupees } from "@/lib/billing/gst";
import type { MessagePoint, RevenuePoint, SignupPoint } from "@/components/admin/admin-chart-types";

export type { MessagePoint, RevenuePoint, SignupPoint };

const TOOLTIP_STYLE = {
  background: "#121833",
  border: "1px solid rgba(125,82,255,0.28)",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
};

function tick(day: string) {
  return day.slice(5);
}

export function AdminRevenueChart({ series }: { series: RevenuePoint[] }) {
  const motion = false;
  const data = series.map((p) => ({
    day: tick(p.day),
    rupees: Number(p.revenueMinor || 0) / 100,
  }));
  return (
    <div className="h-[148px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="adminRevStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6c3cff" />
              <stop offset="55%" stopColor="#ff5ca8" />
              <stop offset="100%" stopColor="#ff8a3d" />
            </linearGradient>
            <linearGradient id="adminRevFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7d52ff" stopOpacity={0.55} />
              <stop offset="70%" stopColor="#ff5ca8" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#ff8a3d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            cursor={{ stroke: "rgba(125,82,255,0.35)" }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [rupees(Math.round(Number(value) * 100)), "Captured"]}
          />
          <Area
            type="monotone"
            dataKey="rupees"
            stroke="url(#adminRevStroke)"
            strokeWidth={2.25}
            fill="url(#adminRevFill)"
            isAnimationActive={motion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminSignupBars({ series }: { series: SignupPoint[] }) {
  const motion = false;
  const data = series.map((p) => ({ day: tick(p.day), n: p.n }));
  return (
    <div className="h-[88px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" hide />
          <YAxis hide domain={[0, "auto"]} />
          <Tooltip
            cursor={{ fill: "rgba(56,189,248,0.08)" }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [Number(value), "New customers"]}
          />
          <Bar
            dataKey="n"
            fill="#38bdf8"
            radius={[4, 4, 0, 0]}
            isAnimationActive={motion}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminMessageBars({ series }: { series: MessagePoint[] }) {
  const motion = false;
  const data = series.map((p) => ({
    day: tick(p.day),
    Email: p.email,
    SMS: p.sms,
    WhatsApp: p.whatsapp,
  }));
  return (
    <div className="h-[96px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="Email" stackId="m" fill="#7d52ff" maxBarSize={16} isAnimationActive={motion} />
          <Bar dataKey="SMS" stackId="m" fill="#ff8a3d" maxBarSize={16} isAnimationActive={motion} />
          <Bar
            dataKey="WhatsApp"
            stackId="m"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
            isAnimationActive={motion}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminProviderRing({ enabled, total }: { enabled: number; total: number }) {
  const motion = false;
  const off = Math.max(0, total - enabled);
  const data = [
    { name: "Enabled", value: enabled },
    { name: "Not enabled", value: off },
  ];
  if (total <= 0) {
    return <div className="h-[108px] w-[108px] shrink-0" aria-hidden />;
  }
  return (
    <div className="relative h-[108px] w-[108px] shrink-0" style={{ width: 108, height: 108 }}>
      <PieChart width={108} height={108}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={36}
          outerRadius={50}
          startAngle={90}
          endAngle={-270}
          stroke="none"
          isAnimationActive={motion}
        >
          <Cell fill="#22c55e" />
          <Cell fill="rgba(255,255,255,0.08)" />
        </Pie>
      </PieChart>
      <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-sm text-white">
        {enabled}/{total}
      </p>
    </div>
  );
}
