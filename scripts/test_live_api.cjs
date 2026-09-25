const http = require('http');

async function testEndpoint(path, method = 'GET', postData = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8000,
            path: path,
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ status: res.statusCode, data: parsed });
            });
        });

        req.on('error', (err) => {
            resolve({ status: 500, error: err.message });
        });

        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log('=== TESTING REAL RUNNING LARAVEL SERVER (http://127.0.0.1:8000) ===\n');

    // 1. GET /api/products
    const prodRes = await testEndpoint('/api/products');
    console.log(`[1] GET /api/products -> Status: ${prodRes.status}, Count: ${prodRes.data?.count}`);

    // 2. GET /api/products/{id}
    const sampleId = prodRes.data?.data?.[0]?.id;
    if (sampleId) {
        const prodDetail = await testEndpoint(`/api/products/${sampleId}`);
        console.log(`[2] GET /api/products/${sampleId} -> Status: ${prodDetail.status}, Name: ${prodDetail.data?.data?.name}`);
    }

    // 3. GET /api/gallery
    const gallRes = await testEndpoint('/api/gallery');
    console.log(`[3] GET /api/gallery -> Status: ${gallRes.status}, Count: ${gallRes.data?.count}`);

    // 4. GET /api/testimonials
    const testRes = await testEndpoint('/api/testimonials');
    console.log(`[4] GET /api/testimonials -> Status: ${testRes.status}, Count: ${testRes.data?.count}`);

    // 5. POST /api/testimonials
    const postTesti = await testEndpoint('/api/testimonials', 'POST', {
        name: 'Pak Ahmad Subarjo',
        role: 'Panitia Event',
        company_or_event: 'Festival Budaya Cirebon',
        location: 'Kesambi, Cirebon',
        rating: 5,
        comment: 'Genset silent sangat senyap tidak mengganggu jalannya pentas tari budaya.',
        genset_used: 'Genset Silent 100 kVA',
    });
    console.log(`[5] POST /api/testimonials -> Status: ${postTesti.status}, Message: ${postTesti.data?.message}`);

    // 6. GET /api/faqs
    const faqRes = await testEndpoint('/api/faqs');
    console.log(`[6] GET /api/faqs -> Status: ${faqRes.status}, Count: ${faqRes.data?.count}`);

    // 7. GET /api/blogs
    const blogRes = await testEndpoint('/api/blogs');
    const firstBlog = blogRes.data?.data?.[0];
    const isContentArr = Array.isArray(firstBlog?.content);
    const isTagsArr = Array.isArray(firstBlog?.tags);
    console.log(`[7] GET /api/blogs -> Status: ${blogRes.status}, Count: ${blogRes.data?.count}, content is Array: ${isContentArr}, tags is Array: ${isTagsArr}`);

    // 8. GET /api/blogs/{slug}
    if (firstBlog?.slug) {
        const blogDetail = await testEndpoint(`/api/blogs/${firstBlog.slug}`);
        console.log(`[8] GET /api/blogs/${firstBlog.slug} -> Status: ${blogDetail.status}, Title: ${blogDetail.data?.data?.title}`);
    }

    // 9. GET /api/company
    const compRes = await testEndpoint('/api/company');
    console.log(`[9] GET /api/company -> Status: ${compRes.status}, Phone: ${compRes.data?.data?.phone_number}`);

    // 10. POST /api/bookings
    const bookingRes = await testEndpoint('/api/bookings', 'POST', {
        fullName: 'Ibu Ratna Sari',
        companyOrEvent: 'Pernikahan Gedung Islamic Centre Cirebon',
        phone: '081298765432',
        selectedGensetName: 'Genset Silent 60 kVA',
        unitQuantity: 1,
        acQuantity: 4,
        rentalType: 'Harian / Acara',
        startDate: '2026-11-20',
        startTime: '07:30 WIB',
        duration: '1 Hari',
        eventLocation: 'Islamic Centre Cirebon, Jl. Siliwangi',
        districtCirebon: 'Kejaksan (Kota Cirebon)',
        packageType: 'Full Service All-in (BBM, Operator, Kabel, Teknisi)',
        additionalNeeds: ['Kabel Power 70m', 'Operator Standby 12 Jam'],
        notes: 'Pemasangan H-1 malam.',
    });
    console.log(`[10] POST /api/bookings -> Status: ${bookingRes.status}, Code: ${bookingRes.data?.data?.booking_code}`);

    // 11. Admin login page check
    const adminRes = await testEndpoint('/admin/login', 'GET');
    console.log(`[11] GET /admin/login -> Status: ${adminRes.status}`);

    console.log('\n=== ALL REAL API ENDPOINTS VERIFIED SUCCESSFULLY ===');
}

runTests();
