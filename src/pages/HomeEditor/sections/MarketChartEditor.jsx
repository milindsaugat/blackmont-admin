import React, { useState } from 'react';
import { Trash2, Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const yAxisTicks = [0, 1000, 2000, 3000, 4000, 5000, 6000];

const formatK = (value) => (value === 0 ? '0' : `${value / 1000}k`);

const formatValueK = (value) => {
  const formatted = (Number(value) / 1000).toFixed(2).replace(/\.?0+$/, '');
  return `${formatted}k`;
};

const formatGrowth = (value) => {
  if (!Number.isFinite(value)) return null;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

const normalizeChartData = (dataPoints = []) => {
  const yearlyPoints = dataPoints
    .map((point) => ({
      ...point,
      year: String(point.year || point.label || '').trim(),
      value: Number(point.value),
      label: point.label && !/^\d{4}$/.test(String(point.label))
        ? point.label
        : 'Year High USD',
      growthPercent:
        point.growthPercent !== undefined && point.growthPercent !== null
          ? Number(point.growthPercent)
          : point.previousYearChange !== undefined && point.previousYearChange !== null
            ? Number(point.previousYearChange)
            : undefined,
    }))
    .filter((point) => /^\d{4}$/.test(point.year) && Number.isFinite(point.value));

  return yearlyPoints.map((point, index) => {
    const previous = yearlyPoints[index - 1]?.value;
    const computedGrowth =
      previous && Number.isFinite(previous)
        ? ((point.value - previous) / previous) * 100
        : undefined;

    return {
      ...point,
      growthPercent: Number.isFinite(point.growthPercent)
        ? point.growthPercent
        : computedGrowth,
    };
  });
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;
  const growth = formatGrowth(point.growthPercent);

  return (
    <div style={{
      minWidth: 190, border: '1px solid rgba(212,175,55,0.24)',
      background: 'rgba(10,10,11,0.96)', borderRadius: 12, padding: '12px 14px',
      boxShadow: '0 18px 50px rgba(0,0,0,0.45)', color: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, background: '#F9E076', display: 'inline-block' }} />
        <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.58)' }}>
          {point.label || 'Year High USD'}
        </span>
      </div>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1, color: '#F9E076', fontFamily: 'var(--font-heading)' }}>
        {formatValueK(point.value)}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)' }}>
        {growth ? `${growth} vs previous year` : 'Baseline year'}
      </div>
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
        {point.year}
      </div>
    </div>
  );
};

const MarketBarPreview = ({ dataPoints = [], chartTitle = 'Year High USD' }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const chartData = normalizeChartData(dataPoints);

  if (!chartData.length) {
    return (
      <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
        No yearly chart data configured.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.52)', fontSize: 12 }}>
          <span style={{ width: 10, height: 10, background: '#C9A14A', display: 'inline-block', boxShadow: '0 0 18px rgba(201,161,74,0.35)' }} />
          {chartTitle || 'Year High USD'}
        </div>
        <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: 10, letterSpacing: '0.28em' }}>USD</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 18, left: 0, bottom: 8 }} onMouseLeave={() => setActiveIndex(null)}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="year" interval={0} tick={{ fill: 'rgba(255,255,255,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={[0, 6000]} ticks={yAxisTicks} tickFormatter={formatK} tick={{ fill: 'rgba(255,255,255,0.36)', fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,161,74,0.05)' }} />
            <Bar dataKey="value" name={chartTitle || 'Year High USD'} radius={[7, 7, 0, 0]} maxBarSize={54} onMouseEnter={(_, index) => setActiveIndex(index)}>
              {chartData.map((entry, index) => (
                <Cell key={entry.year} fill={activeIndex === index ? '#F9E076' : '#9B7417'} fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.72} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DataRow = ({ point, index, onRemove, onUpdate }) => (
  <div
    className="card transition-base"
    style={{
      display: 'grid', gridTemplateColumns: '32px minmax(80px, 0.9fr) minmax(120px, 1.4fr) minmax(90px, 1fr) minmax(90px, 1fr) 32px', alignItems: 'center', gap: 12,
      padding: '14px 20px', borderRadius: 'var(--radius-md)',
    }}
  >
    <div style={{
      width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--gold-10)', border: '1px solid var(--gold-20)',
      fontSize: 11, color: 'var(--gold)', fontWeight: 700, flexShrink: 0,
      fontFamily: 'var(--font-mono)',
    }}>
      {index + 1}
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Calendar size={14} color="var(--text-muted)" />
      <input className="input-field" value={point.year || ''} onChange={(e) => onUpdate(index, { year: e.target.value })} placeholder="2016" style={{ height: 36 }} />
    </div>
    <input className="input-field" value={point.label || ''} onChange={(e) => onUpdate(index, { label: e.target.value })} placeholder="Year High USD" style={{ height: 36 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DollarSign size={14} color="var(--gold)" />
      <input className="input-field" type="number" value={point.value ?? ''} onChange={(e) => onUpdate(index, { value: e.target.value })} placeholder="1380" style={{ height: 36 }} />
    </div>
    <input className="input-field" type="number" value={point.growthPercent ?? ''} onChange={(e) => onUpdate(index, { growthPercent: e.target.value })} placeholder="Auto %" style={{ height: 36 }} />

    <button
      onClick={() => onRemove(index)}
      style={{
        background: 'none', border: 'none', color: 'var(--text-disabled)', cursor: 'pointer',
        padding: 6, borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', display: 'flex',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.background = 'rgba(255,85,85,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; e.currentTarget.style.background = 'none'; }}
      title="Remove data point"
    >
      <Trash2 size={15} />
    </button>
  </div>
);

export default function MarketChartEditor({ data = {}, onChange }) {
  const [yearInput, setYearInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [labelInput, setLabelInput] = useState('Year High USD');

  const dataPoints = data.chartData || [];

  const handleAdd = () => {
    if (!yearInput.trim() || !valueInput.trim()) return;
    const newPoints = [
      ...dataPoints,
      {
        year: yearInput.trim(),
        value: Number(valueInput),
        label: labelInput.trim() || 'Year High USD',
        seriesLabel: labelInput.trim() || 'Year High USD',
        unit: 'USD',
        currency: 'USD',
        __localId: Date.now(),
      },
    ];
    onChange({ chartData: newPoints });
    setYearInput('');
    setValueInput('');
    setLabelInput('Year High USD');
  };

  const handleRemove = (index) => {
    const newPoints = dataPoints.filter((_, i) => i !== index);
    onChange({ chartData: newPoints });
  };

  const handleUpdate = (index, patch) => {
    const newPoints = dataPoints.map((point, i) => (
      i === index ? { ...point, ...patch } : point
    ));
    onChange({ chartData: newPoints });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const canAdd = yearInput.trim() && valueInput.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 'var(--radius-md)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--gold-10)', border: '1px solid var(--gold-20)',
        }}>
          <TrendingUp size={18} color="var(--gold)" />
        </div>
        <div>
          <h4 className="typo-h3" style={{ margin: 0 }}>Chart Configuration</h4>
          <p className="typo-small" style={{ marginTop: 2 }}>Update the chart's titles and data points.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-4)', background: 'var(--bg-surface)', padding: 'var(--sp-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
        <div>
          <label className="field-label">Chart Title</label>
          <input type="text" value={data.chartTitle || ''} onChange={e => onChange({ chartTitle: e.target.value })} placeholder="Year High USD" className="input-field" />
        </div>
        <div>
          <label className="field-label">Chart Subtitle</label>
          <input type="text" value={data.chartSubtitle || ''} onChange={e => onChange({ chartSubtitle: e.target.value })} placeholder="Net purchases showing..." className="input-field" />
        </div>
        <div>
          <label className="field-label">Chart Badge</label>
          <input type="text" value={data.chartBadge || ''} onChange={e => onChange({ chartBadge: e.target.value })} placeholder="MARKET INSIGHT" className="input-field" />
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--sp-6)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr auto', gap: 'var(--sp-4)', alignItems: 'end' }}>
          <div>
            <label className="field-label">Year</label>
            <input
              type="text"
              value={yearInput}
              onChange={e => setYearInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 2016"
              className="input-field"
            />
          </div>

          <div>
            <label className="field-label">Series Label</label>
            <input
              type="text"
              value={labelInput}
              onChange={e => setLabelInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Year High USD"
              className="input-field"
            />
          </div>

          <div>
            <label className="field-label">Amount / Value</label>
            <input
              type="number"
              value={valueInput}
              onChange={e => setValueInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 1500"
              className="input-field"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="gold-btn"
            style={{ height: 44, padding: '0 20px', borderRadius: 'var(--radius-md)' }}
          >
            <Plus size={16} />
            ADD
          </button>
        </div>
      </div>

      {dataPoints.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5) var(--sp-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <span className="typo-label">
              {dataPoints.length} Data Point{dataPoints.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', maxHeight: 320, overflowY: 'auto' }}>
            {dataPoints.map((point, index) => (
              <DataRow
                key={point._id || point.__localId || index}
                point={point}
                index={index}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {dataPoints.length === 0 && (
        <div style={{
          padding: '48px var(--sp-6)', textAlign: 'center',
          border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-active)',
        }}>
          <TrendingUp size={32} color="var(--text-disabled)" style={{ marginBottom: 12 }} />
          <p className="typo-small" style={{ margin: 0 }}>
            No data points yet. Add a year and value above to get started.
          </p>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <h4 className="typo-label" style={{ margin: 0 }}>Chart Live Preview</h4>
          <span className="typo-caption">Updates instantly</span>
        </div>
        <div style={{
          background: 'var(--bg-surface)', padding: 'var(--sp-8) var(--sp-5)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)',
        }}>
          <div style={{ height: 400, width: '100%' }}>
            <MarketBarPreview dataPoints={dataPoints} chartTitle={data.chartTitle || 'Year High USD'} />
          </div>
        </div>
      </div>
    </div>
  );
}
