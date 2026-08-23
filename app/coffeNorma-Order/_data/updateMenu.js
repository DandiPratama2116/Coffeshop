const fs = require('fs');
const file = '/Users/dandipratama/Documents/Website Profile Norma/CaffeNorma/app/coffeNorma-Order/_data/menuData.ts';
let content = fs.readFileSync(file, 'utf8');

// Add subCategory to the interface
content = content.replace('category: string;', 'category: string;\n  subCategory?: string;');

const lines = content.split('\n');
let currentSubCategory = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/\/\/ Page \d+(?:-\d+)?: (.+)/);
  if (match) {
    currentSubCategory = match[1].trim();
    // For Non-Coffee, Mocktails, Pastry, maybe we skip or use them?
    // Let's use all of them except if it matches the main category exactly
  }
  
  if (line.includes('{ id:') && currentSubCategory) {
    // Inject subCategory before category
    lines[i] = line.replace(/category: '([^']+)'/, `category: '$1', subCategory: '${currentSubCategory}'`);
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Updated menuData.ts');
