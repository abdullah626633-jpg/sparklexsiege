const fs = require('fs');

let content = fs.readFileSync('src/data/products.ts', 'utf8');

// Star Dust Bracelet removal
const starDustRegex = /\{\s*id: 'prod-star-dust-bracelet',[\s\S]*?\},/g;
content = content.replace(starDustRegex, '');

// Starry Bloom Set removal
const starryBloomRegex = /\{\s*id: 'prod-starry-bloom-set',[\s\S]*?\},/g;
content = content.replace(starryBloomRegex, '');

fs.writeFileSync('src/data/products.ts', content);
