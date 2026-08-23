const fs = require('fs');
let content = fs.readFileSync('app/order/_data/menuData.ts', 'utf8');

content = content.replace('image: string;', 'image?: string;');

const duplicated = [
  '/assets/Image1.jpg',
  '/assets/Image2.jpg',
  '/assets/Image3.jpg',
  '/assets/Image4.jpg',
  '/assets/Image5.jpg',
  '/assets/Image6.jpg',
  '/assets/CoffeMagic.jpg',
  '/assets/Sweet&Cream.jpg',
  '/assets/MatchaPisthacio.jpg'
];

duplicated.forEach(img => {
  const regex = new RegExp(`image:\\s*'${img}',?\\s*`, 'g');
  content = content.replace(regex, '');
});

fs.writeFileSync('app/order/_data/menuData.ts', content);
