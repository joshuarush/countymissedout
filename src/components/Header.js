import React from 'react';

const Header = ({ countiesWithout }) => (
  <header className="hero" id="top">
    <div className="hero-inner">
      <p className="eyebrow">No School Choices</p>
      <h1>
        {countiesWithout.toLocaleString()} Texas counties.
        <span className="hero-emphasis"> Zero voucher schools.</span>
      </h1>
      <p className="hero-subtext">
        Texas promised school choice. Rural families got a voucher scam that skips their county entirely.
      </p>
      <div className="hero-actions">
        <a className="cta-button" href="#lookup">Check your county</a>
        <a className="ghost-button" href="#map">See the map</a>
      </div>
    </div>
  </header>
);

export default Header;
