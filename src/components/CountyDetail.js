import React, { useEffect, useMemo, useState } from 'react';

const CountyDetail = ({ county, schools, privateCount }) => {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [county]);

  const visibleSchools = useMemo(() => {
    if (!schools || schools.length === 0) return [];
    const sorted = [...schools].sort((a, b) => a.name.localeCompare(b.name));
    if (showAll) return sorted;
    return sorted.slice(0, 6);
  }, [schools, showAll]);

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

  let privateSchoolMessage = null;
  if (hasPrivateData) {
    if (privateCount === 0 && count === 0) {
      privateSchoolMessage = 'This county has no accredited private schools and no voucher schools.';
    } else if (privateCount === 0 && count > 0) {
      privateSchoolMessage = `TEPSAC lists 0 accredited private schools here, but the voucher list shows ${count}.`;
    } else if (hasPrivateSchools) {
      const percent = Math.round((count / privateCount) * 100);
      privateSchoolMessage = `${count} voucher schools out of ${privateCount} accredited private schools (${percent}%).`;
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
      {privateSchoolMessage && (
        <div className="private-meta">
          <p>{privateSchoolMessage}</p>
          <p className="private-note">Private school counts use TEPSAC-accredited schools.</p>
        </div>
      )}
      {hasSchools && (
        <div className="county-schools">
          <h3>Participating schools</h3>
          <div className="school-grid">
            {visibleSchools.map((school) => (
              <div className="school-card" key={`${school.name}-${school.city}`}>
                <h4>{school.name}</h4>
                <p>{school.city}</p>
                <p className="school-meta">{school.grades}</p>
              </div>
            ))}
          </div>
          {schools.length > 6 && (
            <button
              className="ghost-button"
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show fewer schools' : `Show all ${schools.length} schools`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CountyDetail;
