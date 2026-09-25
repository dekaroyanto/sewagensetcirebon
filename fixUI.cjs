const fs = require('fs');
const path = require('path');

function processFile(relPath, replacer) {
    const fullPath = path.join(__dirname, relPath);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = replacer(content);
    fs.writeFileSync(fullPath, content);
    console.log('Processed', relPath);
}

processFile('src/components/BookingForm.tsx', (c) => {
    return c.replace(/\.category ===/g, '.product_type ===');
});

processFile('src/components/BookingModal.tsx', (c) => {
    return c.replace(/\.category ===/g, '.product_type ===');
});

processFile('src/components/CatalogPage.tsx', (c) => {
    c = c.replace(/\|\|\s*\(product\.tag && product\.tag\.toLowerCase\(\)\.includes\(query\)\)/g, '');
    c = c.replace(/\{product\.tag && \([\s\S]*?\}\)/g, '');
    c = c.replace(/product\.category ===/g, 'product.product_type ===');
    return c;
});

processFile('src/components/ProductCatalog.tsx', (c) => {
    c = c.replace(/\|\|\s*product\.engineBrand\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)/g, '');
    c = c.replace(/\|\|\s*product\.idealFor\.some\([\s\S]*?\)/g, '');
    c = c.replace(/\|\|\s*product\.kva\.toString\(\)\.includes\(searchQuery\)/g, '');
    
    // Remove badges/kVA header parts
    c = c.replace(/\{product\.tag && \([\s\S]*?\}\)/g, '');
    c = c.replace(/<p className="text-xs text-slate-500 mt-0\.5">\{product\.engineBrand\}<\/p>/g, '');
    
    // The kVA block
    c = c.replace(/<div className="text-right shrink-0">[\s\S]*?<\/div>\s*<\/div>/g, '</div>');
    
    // The "Rekomendasi Pemakaian" block
    c = c.replace(/<div className="text-xs text-slate-600 pt-1">[\s\S]*?<\/ul>\s*<\/div>/g, '');
    
    // The Daya Output block
    c = c.replace(/<div className="grid grid-cols-2 gap-2 text-xs">[\s\S]*?<\/div>\s*<\/div>/g, '');

    // Price
    c = c.replace(/\{product\.startingPriceEstimate\}/g, '{formatPrice(product.price)}');
    
    c = c.replace(/product\.category ===/g, 'product.product_type ===');
    return c;
});

processFile('src/components/CatalogTeaserSection.tsx', (c) => {
    c = c.replace(/\.category ===/g, '.product_type ===');
    c = c.replace(/\{product\.tag && \([\s\S]*?\}\)/g, '');
    
    // Remove the specs grid
    c = c.replace(/<div className="grid grid-cols-2 gap-2 text-xs mt-3">[\s\S]*?<\/div>\s*<\/div>/g, '');
    
    // Remove idealFor block
    c = c.replace(/<div className="text-xs text-slate-600 pt-1">[\s\S]*?<\/ul>\s*<\/div>/g, '');
    
    // Remove kVA block
    c = c.replace(/<div className="text-right shrink-0">[\s\S]*?<\/div>\s*<\/div>/g, '</div>');
    
    // Remove engineBrand
    c = c.replace(/<p className="text-xs text-slate-500 mt-0\.5 line-clamp-1">\{product\.engineBrand\}<\/p>/g, '');
    return c;
});

processFile('src/utils/whatsapp.ts', (c) => {
    c = c.replace(/\.category ===/g, '.product_type ===');
    c = c.replace(/\{product\.startingPriceEstimate \?  \(Estimasi: \$\{product\.startingPriceEstimate\}\) : ''\}/g, '');
    return c;
});

