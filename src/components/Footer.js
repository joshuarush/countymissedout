import React from 'react';

const Footer = () => (
  <footer className="site-footer">
    <div>
      <h3>No School Choices</h3>
      <p>Tracking which Texas counties were left with zero voucher schools.</p>
    </div>
    <div>
      <p>
        Data source: <a href="https://finder.educationfreedom.texas.gov" target="_blank" rel="noopener noreferrer">Texas Education Freedom</a> vendor list.
      </p>
      <p>
        Private school counts: <a href="https://www.tepsac.org/" target="_blank" rel="noopener noreferrer">TEPSAC accredited schools</a> (active listings).
      </p>
      <p className="footer-small">Built to spotlight the voucher scam, not to sell anything.</p>
    </div>
  </footer>
);

export default Footer;
