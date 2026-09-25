const fs = require('fs');
const path = require('path');

const commandFile = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend', 'app', 'Console', 'Commands', 'TestCrud.php');

const phpCode = `<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Booking;
use App\Models\BlogPost;
use App\Models\GalleryItem;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\CompanySetting;
use Illuminate\Support\Str;

class TestCrud extends Command
{
    protected $signature = 'test:crud';
    protected $description = 'Test all CRUD operations across all models';

    public function handle()
    {
        $this->info('=== STARTING COMPREHENSIVE CRUD TEST ===');

        // 1. PRODUCT CRUD
        try {
            $this->info('Testing Product CRUD...');
            $product = Product::create([
                'name' => 'Genset Test Silent 20 kVA',
                'product_type' => 'genset',
                'price' => 1200000,
                'capacity_kva' => 20,
                'description' => 'Unit testing genset.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
                'is_available' => true,
                'sort_order' => 99,
            ]);
            $this->line("  [OK] Create Product ID: {$product->id}");

            $found = Product::find($product->id);
            $this->line("  [OK] Read Product: {$found->name}");

            $found->update(['price' => 1350000]);
            $this->line("  [OK] Update Product new price: {$found->fresh()->price}");

            $found->delete();
            $this->line("  [OK] Delete Product successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] Product CRUD: " . $e->getMessage());
        }

        // 2. BOOKING CRUD
        try {
            $this->info('Testing Booking CRUD...');
            $booking = Booking::create([
                'booking_code' => 'TEST-' . strtoupper(Str::random(6)),
                'full_name' => 'Budi Santoso',
                'company_or_event' => 'PT Cirebon Maju',
                'phone' => '08123456789',
                'selected_genset_id' => null,
                'selected_genset_name' => 'Genset Silent 50 kVA',
                'unit_quantity' => 1,
                'ac_quantity' => 2,
                'rental_type' => 'Harian / Acara',
                'start_date' => now()->format('Y-m-d'),
                'start_time' => '08:00 WIB',
                'duration' => '1 Hari',
                'event_location' => 'Hotel Aston Cirebon',
                'district_cirebon' => 'Kedawung',
                'package_type' => 'Include BBM Solar & Operator',
                'additional_needs' => ['Kabel 50m', 'Operator Standby'],
                'notes' => 'Harap standby 2 jam sebelum acara.',
                'status' => 'pending',
                'total_price' => 2500000,
            ]);
            $this->line("  [OK] Create Booking ID: {$booking->id}");

            $found = Booking::find($booking->id);
            $this->line("  [OK] Read Booking code: {$found->booking_code}, needs: " . json_encode($found->additional_needs));

            $found->update(['status' => 'confirmed']);
            $this->line("  [OK] Update Booking status: {$found->fresh()->status}");

            $found->delete();
            $this->line("  [OK] Delete Booking successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] Booking CRUD: " . $e->getMessage());
        }

        // 3. BLOG POST CRUD
        try {
            $this->info('Testing BlogPost CRUD...');
            $blog = BlogPost::create([
                'title' => 'Panduan Memilih Genset untuk Acara Outdoor Cirebon',
                'slug' => 'panduan-memilih-genset-outdoor-cirebon-' . rand(100, 999),
                'summary' => 'Ringkasan panduan memilih kapasitas genset.',
                'category' => 'Tips & Panduan',
                'date' => now()->format('Y-m-d'),
                'read_time' => '4 Menit Baca',
                'author' => 'Tim SewaGenset Cirebon',
                'image' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
                'tags' => ['Genset', 'Event', 'Tips'],
                'content' => ['Paragraf satu penjelasan genset.', 'Paragraf dua kebutuhan kVA.'],
                'is_published' => true,
            ]);
            $this->line("  [OK] Create BlogPost ID: {$blog->id}");

            $found = BlogPost::find($blog->id);
            $this->line("  [OK] Read BlogPost: {$found->title}, tags: " . json_encode($found->tags));

            $found->update(['read_time' => '6 Menit Baca']);
            $this->line("  [OK] Update BlogPost: {$found->fresh()->read_time}");

            $found->delete();
            $this->line("  [OK] Delete BlogPost successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] BlogPost CRUD: " . $e->getMessage());
        }

        // 4. GALLERY ITEM CRUD
        try {
            $this->info('Testing GalleryItem CRUD...');
            $gallery = GalleryItem::create([
                'title' => 'Dokumentasi Konser Musik Cirebon Timur',
                'category' => 'Konser & Festival',
                'location' => 'Stadion Bima Cirebon',
                'genset_used' => '2x Genset Silent 150 kVA Synchronize',
                'image' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
                'client' => 'Event Organizer Cirebon',
                'duration' => '2 Hari',
                'peak_load' => '220 kVA',
                'equipment_included' => ['2 Unit Genset 150 kVA', 'Panel Sync ATS', 'Kabel Power 200m'],
                'description' => 'Supply kelistrikan panggung utama sound & lighting 100.000 Watt.',
                'highlight_quote' => 'Listrik stabil tanpa kedip selama konser.',
                'is_featured' => true,
            ]);
            $this->line("  [OK] Create GalleryItem ID: {$gallery->id}");

            $found = GalleryItem::find($gallery->id);
            $this->line("  [OK] Read GalleryItem: {$found->title}");

            $found->update(['duration' => '3 Hari']);
            $this->line("  [OK] Update GalleryItem: {$found->fresh()->duration}");

            $found->delete();
            $this->line("  [OK] Delete GalleryItem successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] GalleryItem CRUD: " . $e->getMessage());
        }

        // 5. TESTIMONIAL CRUD
        try {
            $this->info('Testing Testimonial CRUD...');
            $testi = Testimonial::create([
                'name' => 'Hendra Wijaya',
                'role' => 'Project Manager',
                'company_or_event' => 'Pembangunan Pabrik Arjawinangun',
                'location' => 'Arjawinangun, Cirebon',
                'rating' => 5,
                'date' => '25 Sep 2026',
                'comment' => 'Pelayanan sangat profesional, genset tiba tepat waktu.',
                'genset_used' => 'Genset Silent 100 kVA',
                'avatar_bg' => 'bg-emerald-500',
                'verified' => true,
                'is_active' => true,
            ]);
            $this->line("  [OK] Create Testimonial ID: {$testi->id}");

            $found = Testimonial::find($testi->id);
            $this->line("  [OK] Read Testimonial: {$found->name}");

            $found->update(['rating' => 5]);
            $this->line("  [OK] Update Testimonial: {$found->fresh()->name}");

            $found->delete();
            $this->line("  [OK] Delete Testimonial successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] Testimonial CRUD: " . $e->getMessage());
        }

        // 6. FAQ CRUD
        try {
            $this->info('Testing FAQ CRUD...');
            $faq = Faq::create([
                'category' => 'Teknis & Kapasitas',
                'question' => 'Berapa kVA genset yang saya perlukan?',
                'answer' => 'Kapasitas dihitung berdasarkan total daya (Watt) dikali 1.25 s/d 1.5 untuk lonjakan beban.',
                'sort_order' => 99,
                'is_active' => true,
            ]);
            $this->line("  [OK] Create FAQ ID: {$faq->id}");

            $found = Faq::find($faq->id);
            $this->line("  [OK] Read FAQ: {$found->question}");

            $found->update(['sort_order' => 100]);
            $this->line("  [OK] Update FAQ: {$found->fresh()->sort_order}");

            $found->delete();
            $this->line("  [OK] Delete FAQ successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] FAQ CRUD: " . $e->getMessage());
        }

        // 7. COMPANY SETTINGS CRUD
        try {
            $this->info('Testing CompanySetting CRUD...');
            CompanySetting::set('test_key', 'test_value');
            $val = CompanySetting::get('test_key');
            $this->line("  [OK] Read CompanySetting: test_key = {$val}");
            CompanySetting::where('key', 'test_key')->delete();
            $this->line("  [OK] Delete CompanySetting successfully");
        } catch (\\Throwable $e) {
            $this->error("  [FAIL] CompanySetting CRUD: " . $e->getMessage());
        }

        $this->info('=== ALL MODEL CRUD TESTS FINISHED ===');
        return 0;
    }
}
`;

fs.writeFileSync(commandFile, phpCode, 'utf8');
console.log('Successfully wrote TestCrud.php');
