const fs = require('fs');
const content = fs.readFileSync('app/order/_data/menuData.ts', 'utf8');
const matches = content.match(/image:\s*'([^']+)'/g);
const counts = {};
if (matches) {
  matches.forEach(m => {
    const img = m.match(/'([^']+)'/)[1];
    counts[img] = (counts[img] || 0) + 1;
  });
}
console.log(counts);
