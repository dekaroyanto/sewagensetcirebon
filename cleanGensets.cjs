const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'gensets.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The objects are exported in an array. We can use a regex replacement or 
// write a simple parser, but since it's just TS objects, we can strip lines that start with specific keys.
// The keys to remove are: created_at, updated_at, category, categoryLabel, tag, kva, kw, pk, btu, phase, engineBrand, noiseLevel, idealFor, startingPriceEstimate, image

const lines = content.split('\n');
const keysToRemove = [
  'created_at:', 'updated_at:', '// Compatibility helpers', 
  'category:', 'categoryLabel:', 'tag:', 'kva:', 'kw:', 'pk:', 'btu:', 
  'phase:', 'engineBrand:', 'noiseLevel:', 'startingPriceEstimate:', 'image:'
];

let inIdealFor = false;
const cleanedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  if (trimmed.startsWith('idealFor: [')) {
    inIdealFor = true;
    continue;
  }
  if (inIdealFor) {
    if (trimmed.endsWith('],') || trimmed === ']') {
      inIdealFor = false;
    }
    continue;
  }
  
  let shouldRemove = false;
  for (const key of keysToRemove) {
    if (trimmed.startsWith(key)) {
      shouldRemove = true;
      break;
    }
  }
  
  if (!shouldRemove) {
    cleanedLines.push(line);
  }
}

fs.writeFileSync(filePath, cleanedLines.join('\n'));
console.log('Cleaned gensets.ts');
