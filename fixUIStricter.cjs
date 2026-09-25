const fs = require('fs');
const path = require('path');

function processFile(relPath, replacer) {
    const fullPath = path.join(__dirname, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = replacer(content);
    fs.writeFileSync(fullPath, content);
}

processFile('src/types.ts', (c) => {
    // We can simply remove the extra properties in the Product interface manually later. 
    return c;
});

// For BookingForm.tsx and BookingModal.tsx, simply change .category === to .product_type ===
processFile('src/components/BookingForm.tsx', (c) => c.replace(/\.category/g, '.product_type'));
processFile('src/components/BookingModal.tsx', (c) => c.replace(/\.category/g, '.product_type'));

// whatsapp.ts
processFile('src/utils/whatsapp.ts', (c) => {
    c = c.replace(/\.category ===/g, '.product_type ===');
    c = c.replace(/\{product\.startingPriceEstimate \?  \(Estimasi: \$\{product\.startingPriceEstimate\}\) : ''\}/g, '');
    return c;
});

// ProductCatalog.tsx - strictly replace just the error lines
processFile('src/components/ProductCatalog.tsx', (c) => {
    c = c.replace(/\|\|\s*product\.engineBrand\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\s*\|\|\s*product\.idealFor\.some\([\s\S]*?\)\s*\|\|\s*product\.kva\.toString\(\)\.includes\(searchQuery\)/g, '');
    c = c.replace(/product\.category ===/g, 'product.product_type ===');
    c = c.replace(/\{product\.startingPriceEstimate\}/g, '{formatPrice(product.price)}');
    
    // Remove <p className="text-xs text-slate-500 mt-0.5">{product.engineBrand}</p>
    c = c.replace(/<p className="text-xs text-slate-500 mt-0\.5">\{product\.engineBrand\}<\/p>/g, '');
    
    // Replace product.tag rendering block carefully
    c = c.replace(/\{product\.tag && \([\s\S]*?\{product\.tag\}[\s\S]*?<\/span>[\s\S]*?\)\}/g, '');
    return c;
});

// CatalogPage.tsx
processFile('src/components/CatalogPage.tsx', (c) => {
    c = c.replace(/\|\|\s*\(product\.tag && product\.tag\.toLowerCase\(\)\.includes\(query\)\)/g, '');
    c = c.replace(/product\.category ===/g, 'product.product_type ===');
    c = c.replace(/<span className="bg-amber-100 text-amber-800 text-xs px-2 py-0\.5 rounded-full font-bold shadow-xs">\{product\.categoryLabel\}<\/span>/g, '');
    c = c.replace(/\{product\.tag && \([\s\S]*?\{product\.tag\}[\s\S]*?<\/span>[\s\S]*?\)\}/g, '');
    return c;
});

// CatalogTeaserSection.tsx
processFile('src/components/CatalogTeaserSection.tsx', (c) => {
    c = c.replace(/\.category ===/g, '.product_type ===');
    c = c.replace(/\{product\.tag && \([\s\S]*?\{product\.tag\}[\s\S]*?<\/span>[\s\S]*?\)\}/g, '');
    c = c.replace(/<p className="text-xs text-slate-500 mt-0\.5 line-clamp-1">\{product\.engineBrand\}<\/p>/g, '');
    return c;
});

