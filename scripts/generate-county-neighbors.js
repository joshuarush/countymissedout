const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'src', 'assets', 'texas-counties.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

const pathTags = svg.match(/<path[^>]*>/g) || [];
const centroids = {};

pathTags.forEach((tag) => {
  const idMatch = tag.match(/id="([^"]+)"/);
  const dMatch = tag.match(/d="([^"]+)"/);
  if (!idMatch || !dMatch) return;

  const id = idMatch[1];
  const numbers = dMatch[1].match(/-?\d*\.?\d+/g);
  if (!numbers || numbers.length < 2) return;

  let xSum = 0;
  let ySum = 0;
  let count = 0;

  for (let i = 0; i < numbers.length - 1; i += 2) {
    const x = Number(numbers[i]);
    const y = Number(numbers[i + 1]);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    xSum += x;
    ySum += y;
    count += 1;
  }

  if (count === 0) return;
  centroids[id] = {
    x: xSum / count,
    y: ySum / count
  };
});

const names = Object.keys(centroids);
const neighbors = {};

names.forEach((name) => {
  const origin = centroids[name];
  let nearest = null;
  let nearestDistance = Infinity;

  names.forEach((other) => {
    if (other === name) return;
    const target = centroids[other];
    const dx = origin.x - target.x;
    const dy = origin.y - target.y;
    const distance = Math.hypot(dx, dy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = other;
    }
  });

  neighbors[name] = nearest;
});

const centroidsPath = path.join(__dirname, '..', 'src', 'data', 'texas-county-centroids.json');
const neighborsPath = path.join(__dirname, '..', 'src', 'data', 'texas-county-neighbors.json');

fs.writeFileSync(centroidsPath, JSON.stringify(centroids, null, 2));
fs.writeFileSync(neighborsPath, JSON.stringify(neighbors, null, 2));

console.log(`Wrote ${names.length} centroids and neighbors.`);
