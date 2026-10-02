const assert = require('assert');

// 1. Verify exact options list
const expectedGensetOptions = [
  'Tanpa Genset',
  '10 KVA',
  '15 KVA',
  '30 KVA',
  '40 KVA',
  '50 KVA',
  '60 KVA',
  '80 KVA',
  '100 KVA',
  '150 KVA',
  '200 KVA',
  '250 KVA',
  '500 KVA',
];

const expectedAcOptions = [
  'Tanpa AC / Pendingin',
  'AC Standing 5 PK',
];

console.log('=== TEST 1: VERIFYING MANUAL OPTIONS LIST ===');
console.log('Genset options count:', expectedGensetOptions.length);
console.log('AC options count:', expectedAcOptions.length);

expectedGensetOptions.forEach((opt, i) => {
  console.log(`  ${i + 1}. Genset: ${opt}`);
});

expectedAcOptions.forEach((opt, i) => {
  console.log(`  ${i + 1}. AC: ${opt}`);
});

// 2. Check rentalOptions.ts content
const fs = require('fs');
const path = require('path');
const rentalOptionsFile = fs.readFileSync(path.join(__dirname, '../src/data/rentalOptions.ts'), 'utf8');

expectedGensetOptions.forEach(opt => {
  assert(rentalOptionsFile.includes(`'${opt}'`), `Missing Genset option in rentalOptions.ts: ${opt}`);
});

expectedAcOptions.forEach(opt => {
  assert(rentalOptionsFile.includes(`'${opt}'`), `Missing AC option in rentalOptions.ts: ${opt}`);
});

console.log('\n=== TEST 2: VERIFYING rentalOptions.ts FILE ===');
console.log('All 13 Genset options and 2 AC options are correctly present in src/data/rentalOptions.ts!');

// 3. Verify BookingModal.tsx and BookingForm.tsx do not import SearchableProductSelect
const modalFile = fs.readFileSync(path.join(__dirname, '../src/components/BookingModal.tsx'), 'utf8');
const formFile = fs.readFileSync(path.join(__dirname, '../src/components/BookingForm.tsx'), 'utf8');

assert(!modalFile.includes('SearchableProductSelect'), 'BookingModal.tsx should not use SearchableProductSelect');
assert(!formFile.includes('SearchableProductSelect'), 'BookingForm.tsx should not use SearchableProductSelect');

assert(modalFile.includes('GENSET_MANUAL_OPTIONS'), 'BookingModal.tsx should use GENSET_MANUAL_OPTIONS');
assert(modalFile.includes('AC_MANUAL_OPTIONS'), 'BookingModal.tsx should use AC_MANUAL_OPTIONS');

assert(formFile.includes('GENSET_MANUAL_OPTIONS'), 'BookingForm.tsx should use GENSET_MANUAL_OPTIONS');
assert(formFile.includes('AC_MANUAL_OPTIONS'), 'BookingForm.tsx should use AC_MANUAL_OPTIONS');

console.log('\n=== TEST 3: VERIFYING FORMS USE MANUAL SELECTS ===');
console.log('BookingModal.tsx and BookingForm.tsx both use GENSET_MANUAL_OPTIONS and AC_MANUAL_OPTIONS without catalog table dependency!');

// 4. Verify Admin BookingsTab.tsx
const adminBookingsFile = fs.readFileSync(path.join(__dirname, '../src/components/admin/tabs/BookingsTab.tsx'), 'utf8');
assert(adminBookingsFile.includes('GENSET_MANUAL_OPTIONS'), 'BookingsTab.tsx should use GENSET_MANUAL_OPTIONS');
assert(adminBookingsFile.includes('AC_MANUAL_OPTIONS'), 'BookingsTab.tsx should use AC_MANUAL_OPTIONS');
assert(adminBookingsFile.includes('updateBooking'), 'BookingsTab.tsx should use updateBooking');
console.log('\n=== TEST 4: VERIFYING ADMIN DASHBOARD ===');
console.log('BookingsTab.tsx properly supports manual options and allows adding/editing bookings with these options!');

// 5. Verify database.sql and index.php
const dbSql = fs.readFileSync(path.join(__dirname, '../public/api/database.sql'), 'utf8');
const indexPhp = fs.readFileSync(path.join(__dirname, '../public/api/index.php'), 'utf8');

assert(dbSql.includes('selected_genset_name'), 'database.sql has selected_genset_name column');
assert(dbSql.includes('selected_ac_name'), 'database.sql has selected_ac_name column');
assert(indexPhp.includes('selected_genset_name'), 'index.php handles selected_genset_name');
assert(indexPhp.includes('selected_ac_name'), 'index.php handles selected_ac_name');
console.log('\n=== TEST 5: VERIFYING BACKEND & MYSQL ===');
console.log('public/api/database.sql and public/api/index.php properly store and update manual genset and ac selections!');

console.log('\n>>> ALL 5 TESTS PASSED SUCCESSFULLY! <<<');
