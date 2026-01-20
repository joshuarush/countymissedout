import React, { useEffect, useState } from 'react';

const useCountUp = (target, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime;
    let rafId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextValue = Math.floor(progress * target);
      setValue(nextValue);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
};

const StatCard = ({ label, value, suffix = '', prefix = '', formatter }) => {
  const displayValue = useCountUp(value);
  const output = formatter ? formatter(displayValue) : displayValue.toLocaleString();

  return (
    <div className="stat-card">
      <div className="stat-value">
        {prefix}{output}{suffix}
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
};

const StatsSection = ({ stats }) => (
  <section className="stats-section">
    <div className="section-heading">
      <h2>Voucher reality check</h2>
      <p>These numbers show who really gets "choice" - and who gets nothing.</p>
    </div>
    <div className="stats-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  </section>
);

export default StatsSection;
