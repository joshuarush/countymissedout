import React, { useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import CountySearch from './components/CountySearch';
import CountyDetail from './components/CountyDetail';
import StatsSection from './components/StatsSection';
import TexasMap from './components/TexasMap';
import InfoSection from './components/InfoSection';
import ComparisonSection from './components/ComparisonSection';
import RepresentativeSection from './components/RepresentativeSection';
import Footer from './components/Footer';
import schoolsByCounty from './data/schools-by-county.json';
import texasCounties from './data/texas-counties.json';
import privateSchoolsByCounty from './data/private-schools-by-county.json';
import countyNeighbors from './data/texas-county-neighbors.json';

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState(null);

  const countyCounts = useMemo(() => {
    const counts = {};
    texasCounties.forEach((county) => {
      counts[county] = schoolsByCounty[county]?.length || 0;
    });
    return counts;
  }, []);

  const totalSchools = useMemo(() => {
    return Object.values(schoolsByCounty).reduce((sum, list) => sum + list.length, 0);
  }, []);

  const countiesWithSchools = useMemo(() => {
    return Object.values(countyCounts).filter((count) => count > 0).length;
  }, [countyCounts]);

  const countiesWithout = texasCounties.length - countiesWithSchools;

  const countyRanks = useMemo(() => {
    const entries = texasCounties.map((county) => ({
      county,
      count: countyCounts[county] || 0
    }));
    const sorted = [...entries].sort((a, b) => a.count - b.count);
    const total = sorted.length;
    const rankMap = {};
    sorted.forEach((entry, index) => {
      const bottomPercent = Math.max(1, Math.round(((index + 1) / total) * 100));
      const topPercent = Math.max(1, Math.round(((total - index) / total) * 100));
      rankMap[entry.county] = {
        count: entry.count,
        bottomPercent,
        topPercent
      };
    });
    return rankMap;
  }, [countyCounts]);

  const metroShare = useMemo(() => {
    const metroRegions = new Set([
      'Houston Area',
      'Dallas-Fort Worth',
      'Austin Area',
      'San Antonio Area'
    ]);
    let metroCount = 0;
    let total = 0;
    Object.values(schoolsByCounty).forEach((list) => {
      list.forEach((school) => {
        total += 1;
        if (metroRegions.has(school.region)) metroCount += 1;
      });
    });
    return total === 0 ? 0 : Math.round((metroCount / total) * 100);
  }, []);

  const stats = [
    {
      label: 'Counties with zero schools accepting vouchers',
      value: countiesWithout
    },
    {
      label: 'Counties with any schools accepting vouchers',
      value: countiesWithSchools
    },
    {
      label: 'Schools accepting vouchers statewide',
      value: totalSchools
    },
    {
      label: 'Schools concentrated in big metros',
      value: metroShare,
      suffix: '%'
    }
  ];

  const selectedSchools = selectedCounty ? schoolsByCounty[selectedCounty] || [] : [];
  const selectedPrivateCount = selectedCounty ? privateSchoolsByCounty[selectedCounty] ?? null : null;
  const selectedNeighbor = selectedCounty ? countyNeighbors[selectedCounty] : null;
  const selectedNeighborCount = selectedNeighbor ? countyCounts[selectedNeighbor] ?? 0 : null;
  const selectedRank = selectedCounty ? countyRanks[selectedCounty] ?? null : null;

  return (
    <div className="App">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="background-orb orb-three" />

      <Header countiesWithout={countiesWithout} />

      <main>
        <section className="lookup-section">
          <div className="lookup-grid">
            <CountySearch
              counties={texasCounties}
              onSelect={setSelectedCounty}
              selectedCounty={selectedCounty}
            />
            <CountyDetail
              county={selectedCounty}
              schools={selectedSchools}
              privateCount={selectedPrivateCount}
              neighborCounty={selectedNeighbor}
              neighborCount={selectedNeighborCount}
              rankInfo={selectedRank}
            />
          </div>
        </section>

        <StatsSection stats={stats} />

        <TexasMap
          countyCounts={countyCounts}
          selectedCounty={selectedCounty}
          onSelect={setSelectedCounty}
        />

        <InfoSection />

        <ComparisonSection />

        <RepresentativeSection
          selectedCounty={selectedCounty}
          selectedCount={selectedSchools.length}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
