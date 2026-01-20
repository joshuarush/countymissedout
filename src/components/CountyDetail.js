import React, { useEffect, useMemo, useState } from 'react';

const CountyDetail = ({ county, schools, privateCount, neighborCounty, neighborCount, rankInfo }) => {
  const [showSchools, setShowSchools] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowSchools(false);
    setShowAll(false);
  }, [county]);

  const visibleSchools = useMemo(() => {
    if (!schools || schools.length === 0 || !showSchools) return [];
    const sorted = [...schools].sort((a, b) => a.name.localeCompare(b.name));
    if (showAll) return sorted;
    return sorted.slice(0, 4);
  }, [schools, showAll, showSchools]);

  if (!county) {
    return (
      <div className="county-detail empty">
        <h2>Select a county to see the truth.</h2>
        <p>
          We checked every school accepting vouchers in Texas. Most counties were left out.
        </p>
      </div>
    );
  }

  const count = schools?.length || 0;
  const hasSchools = count > 0;
  const hasPrivateData = Number.isFinite(privateCount);
  const hasPrivateSchools = hasPrivateData && privateCount > 0;
  const hasNeighbor = Boolean(neighborCounty);

  let privateSummary = null;
  if (hasPrivateData) {
    if (privateCount === 0 && count === 0) {
      privateSummary = {
        primary: '0 private schools. 0 schools accepting vouchers.',
        secondary: 'No private school options to choose from.'
      };
    } else if (privateCount === 0 && count > 0) {
      privateSummary = {
        primary: '0 private schools listed.',
        secondary: `Voucher list shows ${count} schools accepting vouchers.`
      };
    } else if (hasPrivateSchools) {
      if (count > privateCount) {
        privateSummary = {
          primary: `${count} schools accepting vouchers listed.`,
          secondary: `Private school directory lists only ${privateCount} in this county.`
        };
      } else {
        const percent = Math.round((count / privateCount) * 100);
        const notParticipating = 100 - percent;
        if (count === 0) {
          privateSummary = {
            primary: '0 schools accepting vouchers.',
            secondary: `${privateCount} private schools opted out.`
          };
        } else if (percent >= 80) {
          privateSummary = {
            primary: `${notParticipating}% of private schools are still refusing vouchers.`,
            secondary: `Even here, ${percent}% participation leaves families without real choice.`
          };
        } else if (percent > 50) {
          privateSummary = {
            primary: `${notParticipating}% of private schools are not participating.`,
            secondary: `${count} of ${privateCount} accept vouchers.`
          };
        } else {
          privateSummary = {
            primary: `Only ${percent}% of private schools accept vouchers.`,
            secondary: `${notParticipating}% refuse the voucher program.`
          };
        }
      }
    }
  }

  let neighborSummary = null;
  if (hasNeighbor && Number.isFinite(neighborCount)) {
    if (neighborCount > count) {
      neighborSummary = `Nearby ${neighborCounty} County has ${neighborCount} schools accepting vouchers — ${neighborCount - count} more than here.`;
    } else if (neighborCount < count) {
      neighborSummary = `Nearby ${neighborCounty} County has only ${neighborCount} schools accepting vouchers. Families outside this county are shut out.`;
    } else {
      neighborSummary = `Nearby ${neighborCounty} County has the same number of schools accepting vouchers. No extra options across the county line.`;
    }
  }

  let rankSummary = null;
  if (rankInfo) {
    if (rankInfo.topPercent <= 15) {
      rankSummary = `Top ${rankInfo.topPercent}% for voucher access — proof the program is concentrated in a handful of counties.`;
    } else {
      rankSummary = `Bottom ${rankInfo.bottomPercent}% for voucher access statewide.`;
    }
  }

  return (
    <div className="county-detail">
      <div className={`county-status ${hasSchools ? 'has-schools' : 'no-schools'}`}>
        <h2>
          {county} County has{' '}
          <span>{hasSchools ? `${count}` : 'ZERO'}</span> schools accepting vouchers.
        </h2>
        <p>
          {hasSchools
            ? 'Families here have some options, but most of Texas does not.'
            : 'No private schools in this county signed up for vouchers.'}
        </p>
      </div>
      {privateSummary && (
        <div className="private-meta">
          <p className="private-metric">{privateSummary.primary}</p>
          {privateSummary.secondary && <p className="private-secondary">{privateSummary.secondary}</p>}
          <p className="private-note">Private school counts come from accredited private school listings.</p>
        </div>
      )}
      {(neighborSummary || rankSummary) && (
        <div className="comparison-meta">
          {rankSummary && <p className="comparison-line">{rankSummary}</p>}
          {neighborSummary && <p className="comparison-line">{neighborSummary}</p>}
        </div>
      )}
      {hasSchools && (
        <div className="county-schools">
          <div className="school-header">
            <h3>Participating schools</h3>
            <button
              className="ghost-button"
              type="button"
              onClick={() => setShowSchools((prev) => !prev)}
            >
              {showSchools ? 'Hide schools' : 'Show schools'}
            </button>
          </div>
          {showSchools && (
            <>
              <div className="school-grid">
                {visibleSchools.map((school) => (
                  <div className="school-card" key={`${school.name}-${school.city}`}>
                    <h4>{school.name}</h4>
                    <p>{school.city}</p>
                    <p className="school-meta">{school.grades}</p>
                  </div>
                ))}
              </div>
              {schools.length > 4 && (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? 'Show fewer schools' : `Show all ${schools.length} schools`}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CountyDetail;
