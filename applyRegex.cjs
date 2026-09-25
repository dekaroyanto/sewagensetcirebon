const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'gensets.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The objects end with description: \...\, followed by created_at: and other properties, ending with   }
// We can use a regex to match from created_at: to just before   }
const regex = /,\s*created_at:[\s\S]*?(?=\n\s+\})/g;

content = content.replace(regex, '');

fs.writeFileSync(filePath, content);
console.log('Regex applied!');
