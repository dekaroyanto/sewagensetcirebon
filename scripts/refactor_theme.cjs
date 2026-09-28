const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../src/components/admin');

const mapping = [
    // Overlay special cases
    [/(?<!dark:)\bbg-slate-950\/80\b/g, 'bg-slate-900/20 dark:bg-slate-950/80'],
    [/(?<!dark:)\bbg-slate-950\/95\b/g, 'bg-slate-50/95 dark:bg-slate-950/95'],
    [/(?<!dark:)\bbg-slate-900\/60\b/g, 'bg-white/60 dark:bg-slate-900/60'],
    [/(?<!dark:)\bbg-slate-900\/80\b/g, 'bg-white/80 dark:bg-slate-900/80'],
    [/(?<!dark:)\bbg-slate-900\/95\b/g, 'bg-white/95 dark:bg-slate-900/95'],
    
    // Backgrounds
    [/(?<!dark:)\bbg-slate-950\b/g, 'bg-slate-50 dark:bg-slate-950'],
    [/(?<!dark:)\bbg-slate-900\b/g, 'bg-white dark:bg-slate-900'],
    [/(?<!dark:)\bbg-slate-800\b/g, 'bg-slate-100 dark:bg-slate-800'],
    [/(?<!dark:)\bbg-slate-700\b/g, 'bg-slate-200 dark:bg-slate-700'],
    
    // Text
    [/(?<!dark:)\btext-white\b/g, 'text-slate-900 dark:text-white'],
    [/(?<!dark:)\btext-slate-100\b/g, 'text-slate-800 dark:text-slate-100'],
    [/(?<!dark:)\btext-slate-300\b/g, 'text-slate-600 dark:text-slate-300'],
    [/(?<!dark:)\btext-slate-400\b/g, 'text-slate-500 dark:text-slate-400'],
    [/(?<!dark:)\btext-slate-500\b/g, 'text-slate-600 dark:text-slate-500'],
    
    // Borders
    [/(?<!dark:)\bborder-slate-800\/80\b/g, 'border-slate-200/80 dark:border-slate-800/80'],
    [/(?<!dark:)\bborder-slate-800\b/g, 'border-slate-200 dark:border-slate-800'],
    [/(?<!dark:)\bborder-slate-700\b/g, 'border-slate-300 dark:border-slate-700'],
    [/(?<!dark:)\bdivide-slate-800\b/g, 'divide-slate-200 dark:divide-slate-800'],
    
    // Hovers
    [/(?<!dark:)\bhover:bg-slate-800\b/g, 'hover:bg-slate-100 dark:hover:bg-slate-800'],
    [/(?<!dark:)\bhover:bg-slate-700\b/g, 'hover:bg-slate-200 dark:hover:bg-slate-700'],
    [/(?<!dark:)\bhover:text-white\b/g, 'hover:text-slate-900 dark:hover:text-white'],
    [/(?<!dark:)\bhover:text-slate-300\b/g, 'hover:text-slate-700 dark:hover:text-slate-300'],
    
    // Placeholders
    [/(?<!dark:)\bplaceholder-slate-600\b/g, 'placeholder-slate-400 dark:placeholder-slate-600'],
    
    // Others
    [/(?<!dark:)\bfrom-slate-900\b/g, 'from-white dark:from-slate-900'],
    [/(?<!dark:)\bfrom-slate-950\b/g, 'from-slate-50 dark:from-slate-950'],
    [/(?<!dark:)\bto-slate-950\b/g, 'to-slate-50 dark:to-slate-950'],
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directory);
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    mapping.forEach(([pattern, replacement]) => {
        content = content.replace(pattern, replacement);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
        updatedCount++;
    }
});

console.log(`Done. Updated ${updatedCount} files.`);
