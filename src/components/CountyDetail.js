import React, { useEffect, useMemo, useState } from 'react';

const CountyDetail = ({ county, schools, privateCount }) => {
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
          We checked every participating voucher school in Texas. Most counties were left out.
        </p>
      </div>
    );
  }

  const count = schools?.length || 0;
  const hasSchools = count > 0;
  const hasPrivateData = Number.isFinite(privateCount);
  const hasPrivateSchools = hasPrivateData && privateCount > 0;

  let privateSummary = null;
  if (hasPrivateData) {
    if (privateCount === 0 && count === 0) {
      privateSummary = {
        primary: '0 private schools. 0 voucher schools.',
        secondary: 'No active TEPSAC-accredited private schools in this county.'
      };
    } else if (privateCount === 0 && count > 0) {
      privateSummary = {
        primary: '0 private schools listed.',
        secondary: `Voucher list shows ${count} participating schools.`
      };
    } else if (hasPrivateSchools) {
      if (count > privateCount) {
        privateSummary = {
          primary: `${count} voucher schools listed.`,
          secondary: `TEPSAC lists ${privateCount} active private schools in this county.`
        };
      } else {
        const percent = Math.round((count / privateCount) * 100);
        const notParticipating = 100 - percent;
        if (percent >= 80) {
          privateSummary = {
            primary: `${notParticipating}% of private schools are still shut out.`,
            secondary: `Even with ${percent}% opting in, the voucher program leaves families behind.`
          };
        } else if (percent > 50) {
          privateSummary = {
            primary: `${notParticipating}% of private schools are not participating.`,
            secondary: `${privateCount - count} schools refuse the voucher program here.`
          };
        } else {
          privateSummary = {
            primary: `Only ${percent}% of private schools are participating.`,
            secondary: `${count} of ${privateCount} active TEPSAC-accredited schools opted in.`
          };
        }
      }
    }
  }

  return (
    <div className="county-detail">
      <div className={`county-status ${hasSchools ? 'has-schools' : 'no-schools'}`}>
        <h2>
          {county} County has{' '}
          <span>{hasSchools ? `${count}` : 'ZERO'}</span> voucher schools.
        </h2>
        <p>
          {hasSchools
            ? 'Families here have some options, but most of Texas does not.'
            : 'No private schools in this county signed up for the voucher program.'}
        </p>
      </div>
      {privateSummary && (
        <div className="private-meta">
          <p className="private-metric">{privateSummary.primary}</p>
          {privateSummary.secondary && <p className="private-secondary">{privateSummary.secondary}</p>}
          <p className="private-note">Private school counts include active TEPSAC-accredited schools.</p>
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
