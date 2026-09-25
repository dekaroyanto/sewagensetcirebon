const fs = require('fs');
const path = require('path');

const testPath = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend', 'tests', 'Feature', 'ComprehensiveCrudTest.php');

const phpCode = `<?php

namespace Tests\\Feature;

use App\\Models\\BlogPost;
use App\\Models\\Booking;
use App\\Models\\CompanySetting;
use App\\Models\\Faq;
use App\\Models\\GalleryItem;
use App\\Models\\Product;
use App\\Models\\Testimonial;
use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class ComprehensiveCrudTest extends TestCase
{
    public function test_api_products_get()
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'count', 'data']);
    }

    public function test_api_product_detail()
    {
        $product = Product::first();
        if ($product) {
            $response = $this->getJson('/api/products/' . $product->id);
            $response->assertStatus(200)
                     ->assertJson(['success' => true]);
        }
    }

    public function test_api_gallery_get()
    {
        $response = $this->getJson('/api/gallery');
        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'count', 'data']);
    }

    public function test_api_testimonials_get_and_post()
    {
        $getRes = $this->getJson('/api/testimonials');
        $getRes->assertStatus(200);

        $postRes = $this->postJson('/api/testimonials', [
            'name' => 'Budi Testimonial',
            'role' => 'Klien',
            'company_or_event' => 'Pernikahan Budi & Ani',
            'location' => 'Kejaksan, Cirebon',
            'rating' => 5,
            'comment' => 'Sewa genset berjalan sangat lancar dan memuaskan.',
            'genset_used' => 'Genset Silent 60 kVA',
        ]);
        $postRes->assertStatus(201)
                ->assertJson(['success' => true]);
    }

    public function test_api_faqs_get()
    {
        $response = $this->getJson('/api/faqs');
        $response->assertStatus(200);
    }

    public function test_api_blogs_get_and_content_is_array()
    {
        $response = $this->getJson('/api/blogs');
        $response->assertStatus(200);
        $data = $response->json('data');
        if (count($data) > 0) {
            $first = $data[0];
            $this->assertIsArray($first['content'], 'Blog content must be an array of strings for React to map over.');
            $this->assertIsArray($first['tags'], 'Blog tags must be an array of strings.');
        }
    }

    public function test_api_company_get()
    {
        $response = $this->getJson('/api/company');
        $response->assertStatus(200);
    }

    public function test_api_booking_post()
    {
        $response = $this->postJson('/api/bookings', [
            'fullName' => 'Dewi Sartika',
            'companyOrEvent' => 'Gathering Komunitas Cirebon',
            'phone' => '08987654321',
            'selectedGensetName' => 'Genset Silent 80 kVA',
            'unitQuantity' => 1,
            'acQuantity' => 2,
            'rentalType' => 'Harian / Acara',
            'startDate' => '2026-10-15',
            'startTime' => '09:00 WIB',
            'duration' => '1 Hari',
            'eventLocation' => 'Grage City Mall Cirebon',
            'districtCirebon' => 'Pekalipan (Kota Cirebon)',
            'packageType' => 'Include BBM Solar & Operator',
            'additionalNeeds' => ['Kabel 50m', 'Operator Standby'],
            'notes' => 'Tolong koordinasi dengan pengelola gedung.',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_dashboard_accessible()
    {
        $user = User::first();
        if ($user) {
            $response = $this->actingAs($user)->get('/admin');
            $response->assertStatus(200);
        }
    }

    public function test_filament_resource_pages_render_without_array_to_string_errors()
    {
        $user = User::first();
        if (!$user) {
            return;
        }

        // 1. Booking edit page
        $booking = Booking::first();
        if ($booking) {
            $response = $this->actingAs($user)->get("/admin/bookings/{$booking->id}/edit");
            $response->assertStatus(200);
        }

        // 2. BlogPost edit page
        $blog = BlogPost::first();
        if ($blog) {
            $response = $this->actingAs($user)->get("/admin/blog-posts/{$blog->id}/edit");
            $response->assertStatus(200);
        }

        // 3. GalleryItem edit page
        $gallery = GalleryItem::first();
        if ($gallery) {
            $response = $this->actingAs($user)->get("/admin/gallery-items/{$gallery->id}/edit");
            $response->assertStatus(200);
        }

        // 4. Product edit page
        $product = Product::first();
        if ($product) {
            $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");
            $response->assertStatus(200);
        }

        // 5. Testimonial edit page
        $testimonial = Testimonial::first();
        if ($testimonial) {
            $response = $this->actingAs($user)->get("/admin/testimonials/{$testimonial->id}/edit");
            $response->assertStatus(200);
        }

        // 6. Faq edit page
        $faq = Faq::first();
        if ($faq) {
            $response = $this->actingAs($user)->get("/admin/faqs/{$faq->id}/edit");
            $response->assertStatus(200);
        }

        // 7. CompanySetting edit page
        $setting = CompanySetting::first();
        if ($setting) {
            $response = $this->actingAs($user)->get("/admin/company-settings/{$setting->id}/edit");
            $response->assertStatus(200);
        }
    }
}
`;

fs.writeFileSync(testPath, phpCode, 'utf8');
console.log('Created ComprehensiveCrudTest.php');
