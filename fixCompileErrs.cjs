const fs = require('fs');
const path = require('path');

function replaceInFile(relPath, replacer) {
    const fullPath = path.join(__dirname, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = replacer(content);
    fs.writeFileSync(fullPath, content);
}

// BlogPage.tsx
replaceInFile('src/components/BlogPage.tsx', (c) => c.replace(/\.product_type ===/g, '.category ==='));

// BookingForm.tsx
replaceInFile('src/components/BookingForm.tsx', (c) => {
    c = c.replace(/const gensetItems = [\s\S]*?;/g, (match) => {
        if (match.includes('gensetItems')) {
            return const gensetItems = GENSET_PRODUCTS.filter(p => p.product_type === 'genset');\n  const acItems = GENSET_PRODUCTS.filter(p => p.product_type === 'ac');\n  const paketItems = GENSET_PRODUCTS.filter(p => p.product_type === 'paket');\n  const aksesorisItems = GENSET_PRODUCTS.filter(p => p.product_type === 'aksesoris');;
        }
        return match;
    });
    return c;
});

// whatsapp.ts
replaceInFile('src/utils/whatsapp.ts', (c) => {
    c = c.replace(/const isPackage = selectedGenset\.product_type === 'paket' \|\| selectedGenset\.product_type === 'paket';/g, "const isPackage = selectedGenset.product_type === 'paket';");
    c = c.replace(/selectedGenset\.product_type === 'ac'/g, "selectedGenset.product_type === 'ac'");
    // Actually just fix the logic in whatsapp.ts manually
    return c;
});

// ProductCatalog.tsx
replaceInFile('src/components/ProductCatalog.tsx', (c) => {
    if (!c.includes('import { formatPrice }')) {
        c = c.replace(/import \{ GENSET_PRODUCTS \} from '\.\.\/data\/gensets';/, "import { GENSET_PRODUCTS } from '../data/gensets';\nimport { formatPrice } from '../utils/format';");
    }
    return c;
});

