import React from 'react';

const InfoSection = () => (
  <section className="info-section">
    <div className="section-heading">
      <h2>The voucher scam skips rural Texas</h2>
      <p>
        Lawmakers promised freedom and choices. The reality? Most counties have no participating schools at all.
      </p>
    </div>
    <div className="info-grid">
      <div className="info-card">
        <h3>Choice for the wealthy</h3>
        <p>
          Voucher dollars are clustered in big metro areas. Rural families are asked to subsidize schools they cannot reach.
        </p>
      </div>
      <div className="info-card">
        <h3>Public dollars, private rules</h3>
        <p>
          Voucher schools can pick and choose students. Local public schools still serve everyone with less funding.
        </p>
      </div>
      <div className="info-card">
        <h3>Communities left behind</h3>
        <p>
          When a county has zero voucher schools, the "choice" promise is an empty headline. Texans deserve better.
        </p>
      </div>
    </div>
  </section>
);

export default InfoSection;
