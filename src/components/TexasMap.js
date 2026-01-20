import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as TexasSvg } from '../assets/texas-counties.svg';

const TexasMap = ({ countyCounts, selectedCounty, onSelect }) => {
  const wrapperRef = useRef(null);
  const [hoveredCounty, setHoveredCounty] = useState(null);

  const activeCounty = hoveredCounty || selectedCounty;
  const activeCount = activeCounty ? countyCounts[activeCounty] || 0 : null;

  const countyClassMap = useMemo(() => {
    const map = {};
    const getBucket = (count) => {
      if (count >= 10) return 'map-bucket-10plus';
      const safeCount = Math.max(0, Math.min(9, Number(count) || 0));
      return `map-bucket-${safeCount}`;
    };

    Object.keys(countyCounts).forEach((county) => {
      map[county] = getBucket(countyCounts[county]);
    });
    return map;
  }, [countyCounts]);

  useEffect(() => {
    const svg = wrapperRef.current?.querySelector('svg');
    if (!svg) return;
    const paths = svg.querySelectorAll('path[id]');
    paths.forEach((path) => {
      const county = path.getAttribute('id');
      if (!county) return;
      const baseClass = countyClassMap[county] || 'no-schools';
      path.classList.remove(
        'map-bucket-0',
        'map-bucket-1',
        'map-bucket-2',
        'map-bucket-3',
        'map-bucket-4',
        'map-bucket-5',
        'map-bucket-6',
        'map-bucket-7',
        'map-bucket-8',
        'map-bucket-9',
        'map-bucket-10plus',
        'is-selected'
      );
      path.classList.add(baseClass);
      if (county === selectedCounty) {
        path.classList.add('is-selected');
      }
    });
  }, [countyClassMap, selectedCounty]);

  const handleMapEvent = (event) => {
    const target = event.target.closest('path[id]');
    if (!target) return null;
    return target.getAttribute('id');
  };

  const handleClick = (event) => {
    const county = handleMapEvent(event);
    if (county) {
      onSelect(county);
    }
  };

  const handleMove = (event) => {
    const county = handleMapEvent(event);
    if (county && county !== hoveredCounty) {
      setHoveredCounty(county);
    }
  };

  const handleLeave = () => {
    setHoveredCounty(null);
  };

  return (
    <section className="map-section" id="map">
      <div className="section-heading">
        <h2>Where vouchers disappear</h2>
        <p>Darker counties have fewer schools accepting vouchers.</p>
      </div>
      <div
        className="map-wrapper"
        ref={wrapperRef}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <TexasSvg className="texas-map" aria-label="Texas county voucher access map" role="img" />
      </div>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-swatch map-bucket-0" />
          Fewest schools accepting vouchers
        </div>
        <div className="legend-item">
          <span className="legend-swatch map-bucket-10plus" />
          Most schools accepting vouchers
        </div>
        <div className="legend-item">
          <span className="legend-swatch is-selected" />
          Selected county
        </div>
      </div>
      <div className="map-status">
        {activeCounty ? (
          <p>
            {activeCounty} County: <strong>{activeCount}</strong> school{activeCount === 1 ? '' : 's'} accepting vouchers.
          </p>
        ) : (
          <p>Hover a county to see details.</p>
        )}
      </div>
    </section>
  );
};

export default TexasMap;
