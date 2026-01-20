import React, { useEffect, useState } from 'react';
import partyData from '../data/partychecker.json';

const RepresentativeSection = ({ selectedCounty, selectedCount }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [representative, setRepresentative] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `https://rws.capitol.texas.gov/api/MatchAddress?Address=${encodeURIComponent(address)}&City=${encodeURIComponent(city)}&Zip=${encodeURIComponent(zip)}&DistType=A`
      );

      if (!response.ok) throw new Error('Failed to fetch representative data');

      const data = await response.json();
      const houseRep = data.House?.[0]?.Member;
      const district = data.House?.[0]?.District;

      if (!houseRep) throw new Error('No representative found for this address');

      const partyInfo = partyData.find((entry) => entry.district === district);
      if (!partyInfo) throw new Error('Unable to determine representative party');

      setRepresentative({
        name: `${houseRep.firstName} ${houseRep.lastName}`,
        phone: `(512) ${houseRep.capitolPhone.slice(0, 3)}-${houseRep.capitolPhone.slice(3)}`,
        formalName: houseRep.formalName.replace('Representative ', ''),
        lastName: houseRep.lastName,
        party: partyInfo.party,
        district
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setRepresentative(null);
    setAddress('');
    setCity('');
    setZip('');
    setError(null);
  };

  useEffect(() => {
    if (!representative) return;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, [representative]);

  const countyLine = selectedCounty
    ? `My county (${selectedCounty}) has ${selectedCount || 0} voucher school${selectedCount === 1 ? '' : 's'}.`
    : 'Most Texas counties have zero voucher schools.';

  if (representative) {
    const isDemocrat = representative.party === 'D';

    return (
      <section className="representative-section">
        <div className="representative-card">
          {isDemocrat ? (
            <>
              <h2>You are represented by Democrat {representative.formalName}.</h2>
              <p>Thank them for standing against the voucher scam and ask them to keep fighting.</p>
            </>
          ) : (
            <>
              <h2>You are represented by Republican {representative.formalName}.</h2>
              <p>Ask them to vote NO on vouchers and protect rural Texas communities.</p>
            </>
          )}

          <div className="rep-actions">
            <a className="cta-button" href={`tel:${representative.phone}`}>
              Call Rep. {representative.formalName}
            </a>
            <button className="ghost-button" type="button" onClick={resetForm}>
              Check another address
            </button>
          </div>

          <div className="script-container">
            <h3>Call script</h3>
            <p>
              Hello, my name is [Your Name] and I am a constituent in zip code {zip}.
              {' '}I am calling about the voucher scam. {countyLine}
              {' '}Public dollars should stay in our public schools, not be diverted to private schools that can pick and choose students.
              {' '}Please stand against vouchers and protect our local schools.
            </p>
          </div>

          <p className="verification-link">
            <a href="https://wrm.capitol.texas.gov/" target="_blank" rel="noopener noreferrer">
              Verify your representative
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="representative-section">
      <div className="representative-card">
        <h2>Find your Texas House representative</h2>
        <p>Enter your address and ask them to stand up for every county left behind.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Street Address"
            className="representative-input"
          />
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="City"
            className="representative-input"
          />
          <input
            type="text"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            placeholder="ZIP Code *"
            className="representative-input"
          />
          <button type="submit" className="cta-button" disabled={!zip}>
            Find Representative
          </button>
        </form>
        {error && <p className="form-error">{error}</p>}
      </div>
    </section>
  );
};

export default RepresentativeSection;
