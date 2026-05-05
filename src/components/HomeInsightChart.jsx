import { useMemo, useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const numberFormatter = new Intl.NumberFormat("en-US");

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[1.2rem] border border-gold-500/20 bg-charcoal-950/96 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <p className="font-serif text-sm text-gold-300">{label}</p>
      <div className="mt-3 space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-3 text-xs text-white/80">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="tracking-[0.18em] uppercase text-white/52">
              {entry.name}
            </span>
            <span className="ml-auto font-medium text-white">
              {numberFormatter.format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeInsightChart = ({ chartData = {}, isPreview = false }) => {
  const [range, setRange] = useState("");

  const timeWindows = chartData.timeWindows?.length ? chartData.timeWindows : [
    { label: "90d", value: "90d" },
    { label: "30d", value: "30d" },
    { label: "7d", value: "7d" }
  ];
  
  const performanceWindowLabel = chartData.performanceWindowLabel || 'PERFORMANCE WINDOW';
  const axis = chartData.axis || {};

  useEffect(() => {
    if (chartData.defaultTimeWindow) setRange(chartData.defaultTimeWindow);
    else if (timeWindows.length > 0) setRange(timeWindows[0].value);
  }, [chartData.defaultTimeWindow, timeWindows]);

  const activeSeries = useMemo(() => {
    if (!chartData.series) return [];
    return chartData.series.filter(s => {
      if (!s.timeWindows || s.timeWindows.length === 0) return true;
      return s.timeWindows.includes(range);
    });
  }, [chartData.series, range]);

  const formattedData = useMemo(() => {
    const allX = new Set();
    activeSeries.forEach(s => s.data?.forEach(d => {
      if(d.x) allX.add(d.x);
    }));
    
    // Attempt to maintain original insertion order as much as possible, or natural sort
    const xLabels = Array.from(allX);
    
    const data = xLabels.map(x => {
      const point = { xLabel: x };
      activeSeries.forEach(s => {
        const match = s.data?.find(d => d.x === x);
        if (match) point[s.name] = Number(match.y);
      });
      return point;
    });
    
    return data;
  }, [activeSeries]);

  const getStrokeDasharray = (style) => {
    if (style === 'dashed') return '8 8';
    if (style === 'dotted') return '3 3';
    return '';
  };

  const getTickDensity = () => {
    if (axis.xTickDensity === '2') return 1;
    if (axis.xTickDensity === '5') return 4;
    if (axis.xTickDensity === '10') return 9;
    return 0; // all
  };

  if (!chartData.series || chartData.series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white/50 border border-white/10 rounded-[1.8rem] border-dashed">
        <p>No chart data configured.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/78">
            {performanceWindowLabel}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/52">
            {activeSeries.filter(s => s.showLegend !== false).map(s => (
              <div key={s.id || s.name} className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_18px_rgba(201,161,74,0.4)]" style={{ background: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        {timeWindows.length > 0 && (
          <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.03] p-1 overflow-x-auto max-w-full no-scrollbar">
            {timeWindows.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRange(item.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition ${
                  range === item.value
                    ? "bg-gold-500/12 text-gold-300"
                    : "text-white/52 hover:text-white/78"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 relative w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 14, right: 10, left: -18, bottom: axis.xLabel ? 20 : 0 }}
          >
            <defs>
              {activeSeries.map(s => (
                <linearGradient key={`fill-${s.id}`} id={`fill-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.34} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="xLabel"
              interval={getTickDensity()}
              tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
              label={axis.xLabel ? { value: axis.xLabel, position: 'bottom', fill: 'rgba(255,255,255,0.5)', fontSize: 11 } : undefined}
            />
            <YAxis
              domain={[
                axis.yMin ? Number(axis.yMin) : 'auto', 
                axis.yMax ? Number(axis.yMax) : 'auto'
              ]}
              tickCount={axis.yTickInterval ? undefined : 5}
              interval={0}
              ticks={axis.yTickInterval && axis.yMax ? 
                Array.from({length: Math.floor(Number(axis.yMax)/Number(axis.yTickInterval)) + 1}, (_, i) => i * Number(axis.yTickInterval)) 
                : undefined
              }
              tickFormatter={(value) => numberFormatter.format(value)}
              tick={{ fill: "rgba(255,255,255,0.36)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
              label={axis.yLabel ? { value: axis.yLabel, angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)', fontSize: 11 } : undefined}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "rgba(201,161,74,0.3)", strokeWidth: 1 }}
            />
            
            {activeSeries.map(s => (
              <Area
                key={s.id || s.name}
                type="monotone"
                dataKey={s.name}
                name={s.name}
                stroke={s.color}
                strokeWidth={s.thickness || 2}
                strokeDasharray={getStrokeDasharray(s.style)}
                fill={`url(#fill-${s.id})`}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#0B0B0B",
                  strokeWidth: 2,
                  fill: s.color,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HomeInsightChart;
