const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend');

// 1. UPDATE BookingForm.php
const bookingFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Bookings', 'Schemas', 'BookingForm.php');
const bookingFormContent = `<?php

namespace App\\Filament\\Resources\\Bookings\\Schemas;

use App\\Models\\Product;
use Filament\\Forms\\Components\\DatePicker;
use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TagsInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Schemas\\Schema;
use Illuminate\\Support\\Str;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('booking_code')
                    ->label('Kode Booking')
                    ->default(fn () => 'SGC-' . date('Ymd') . '-' . strtoupper(Str::random(4)))
                    ->required(),
                TextInput::make('full_name')
                    ->label('Nama Lengkap')
                    ->required(),
                TextInput::make('company_or_event')
                    ->label('Perusahaan / Nama Acara'),
                TextInput::make('phone')
                    ->label('Nomor WhatsApp / HP')
                    ->tel()
                    ->required(),
                Select::make('selected_genset_id')
                    ->label('Pilihan Genset')
                    ->options(fn () => Product::pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        if ($state) {
                            $product = Product::find($state);
                            if ($product) {
                                $set('selected_genset_name', $product->name);
                            }
                        }
                    }),
                TextInput::make('selected_genset_name')
                    ->label('Nama Unit Genset'),
                TextInput::make('unit_quantity')
                    ->label('Jumlah Unit Genset')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('ac_quantity')
                    ->label('Jumlah AC Standing (5 PK)')
                    ->required()
                    ->numeric()
                    ->default(0),
                Select::make('rental_type')
                    ->label('Tipe Sewa')
                    ->options([
                        'Harian / Acara' => 'Harian / Acara',
                        'Mingguan' => 'Mingguan',
                        'Bulanan' => 'Bulanan',
                        'Standby / Proyek' => 'Standby / Proyek',
                    ])
                    ->default('Harian / Acara')
                    ->required(),
                DatePicker::make('start_date')
                    ->label('Tanggal Mulai Sewa')
                    ->required(),
                TextInput::make('start_time')
                    ->label('Waktu Mulai')
                    ->default('08:00 WIB'),
                TextInput::make('duration')
                    ->label('Durasi Sewa')
                    ->default('1 Hari')
                    ->required(),
                Textarea::make('event_location')
                    ->label('Alamat Lengkap Lokasi Acara')
                    ->required()
                    ->columnSpanFull(),
                Select::make('district_cirebon')
                    ->label('Kecamatan / Wilayah')
                    ->options([
                        'Kejaksan (Kota Cirebon)' => 'Kejaksan (Kota Cirebon)',
                        'Kesambi (Kota Cirebon)' => 'Kesambi (Kota Cirebon)',
                        'Harjamukti (Kota Cirebon)' => 'Harjamukti (Kota Cirebon)',
                        'Lemahwungkuk (Kota Cirebon)' => 'Lemahwungkuk (Kota Cirebon)',
                        'Pekalipan (Kota Cirebon)' => 'Pekalipan (Kota Cirebon)',
                        'Kedawung (Kab. Cirebon)' => 'Kedawung (Kab. Cirebon)',
                        'Sumber (Kab. Cirebon)' => 'Sumber (Kab. Cirebon)',
                        'Plered (Kab. Cirebon)' => 'Plered (Kab. Cirebon)',
                        'Gunungjati (Kab. Cirebon)' => 'Gunungjati (Kab. Cirebon)',
                        'Mundu (Kab. Cirebon)' => 'Mundu (Kab. Cirebon)',
                        'Arjawinangun (Kab. Cirebon)' => 'Arjawinangun (Kab. Cirebon)',
                        'Palimanan (Kab. Cirebon)' => 'Palimanan (Kab. Cirebon)',
                        'Losari (Kab. Cirebon)' => 'Losari (Kab. Cirebon)',
                        'Ciledug (Kab. Cirebon)' => 'Ciledug (Kab. Cirebon)',
                        'Kanci / Astanajapura' => 'Kanci / Astanajapura',
                        'Wilayah Majalengka / Kuningan / Indramayu' => 'Wilayah Ciayumajakuning Lainnya',
                    ])
                    ->searchable()
                    ->required(),
                Select::make('package_type')
                    ->label('Paket Layanan')
                    ->options([
                        'Include BBM Solar & Operator' => 'Include BBM Solar & Operator',
                        'Unit Only (Genset + Kabel)' => 'Unit Only (Genset + Kabel)',
                        'Full Service All-in (BBM, Operator, Kabel, Teknisi)' => 'Full Service All-in (BBM, Operator, Kabel, Teknisi)',
                    ])
                    ->default('Include BBM Solar & Operator')
                    ->required(),
                TagsInput::make('additional_needs')
                    ->label('Kebutuhan Tambahan (Kabel, ATS, Operator dsb.)')
                    ->placeholder('Ketik item lalu tekan Enter')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->label('Catatan Khusus')
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Status Pesanan')
                    ->options([
                        'pending' => 'Pending (Menunggu Verifikasi)',
                        'confirmed' => 'Confirmed (Terkonfirmasi)',
                        'active' => 'Active (Sedang Berjalan)',
                        'completed' => 'Completed (Selesai)',
                        'cancelled' => 'Cancelled (Batal)',
                    ])
                    ->default('pending')
                    ->required(),
                TextInput::make('total_price')
                    ->label('Total Harga (Rp)')
                    ->numeric()
                    ->prefix('Rp '),
            ]);
    }
}
`;
fs.writeFileSync(bookingFormPath, bookingFormContent, 'utf8');
console.log('[OK] BookingForm.php updated');

// 2. UPDATE BookingsTable.php
const bookingsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Bookings', 'Tables', 'BookingsTable.php');
const bookingsTableContent = `<?php

namespace App\\Filament\\Resources\\Bookings\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class BookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('booking_code')
                    ->label('Kode Booking')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('full_name')
                    ->label('Nama Pemesan')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('WhatsApp')
                    ->searchable(),
                TextColumn::make('selected_genset_name')
                    ->label('Unit Genset')
                    ->searchable(),
                TextColumn::make('rental_type')
                    ->label('Tipe Sewa')
                    ->searchable(),
                TextColumn::make('start_date')
                    ->label('Tgl Sewa')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('district_cirebon')
                    ->label('Wilayah')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'info',
                        'active' => 'primary',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('total_price')
                    ->label('Total Harga')
                    ->formatStateUsing(fn ($state) => $state ? 'Rp ' . number_format($state, 0, ',', '.') : '-')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(bookingsTablePath, bookingsTableContent, 'utf8');
console.log('[OK] BookingsTable.php updated');

// 3. UPDATE BlogPostForm.php
const blogPostFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'BlogPosts', 'Schemas', 'BlogPostForm.php');
const blogPostFormContent = `<?php

namespace App\\Filament\\Resources\\BlogPosts\\Schemas;

use Filament\\Forms\\Components\\DatePicker;
use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TagsInput;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\Toggle;
use Filament\\Schemas\\Schema;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Judul Artikel')
                    ->required()
                    ->reactive(),
                TextInput::make('slug')
                    ->label('Slug URL')
                    ->required(),
                Select::make('category')
                    ->label('Kategori')
                    ->options([
                        'Tips & Panduan' => 'Tips & Panduan',
                        'Seputar Genset' => 'Seputar Genset',
                        'Event & Proyek' => 'Event & Proyek',
                        'Berita Cirebon' => 'Berita Cirebon',
                    ])
                    ->default('Tips & Panduan')
                    ->required(),
                DatePicker::make('date')
                    ->label('Tanggal Publikasi')
                    ->default(now()),
                TextInput::make('read_time')
                    ->label('Estimasi Baca')
                    ->default('5 Menit Baca')
                    ->required(),
                TextInput::make('author')
                    ->label('Penulis')
                    ->default('Tim SewaGenset Cirebon')
                    ->required(),
                TextInput::make('image')
                    ->label('URL Gambar Banner Artikel')
                    ->url()
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('summary')
                    ->label('Ringkasan Singkat')
                    ->rows(2)
                    ->columnSpanFull()
                    ->required(),
                TagsInput::make('tags')
                    ->label('Tag / Kata Kunci')
                    ->placeholder('Ketik tag lalu tekan Enter')
                    ->columnSpanFull(),
                Textarea::make('content')
                    ->label('Konten Artikel (Pisahkan antar paragraf dengan Enter 2x)')
                    ->rows(12)
                    ->columnSpanFull()
                    ->required()
                    ->formatStateUsing(function ($state) {
                        if (is_array($state)) {
                            return implode("\n\n", $state);
                        }
                        return $state;
                    })
                    ->dehydrateStateUsing(function ($state) {
                        if (is_string($state)) {
                            return array_values(array_filter(
                                array_map('trim', explode("\n", str_replace("\r", "", $state))),
                                fn ($p) => $p !== ''
                            ));
                        }
                        return is_array($state) ? $state : [];
                    }),
                Toggle::make('is_published')
                    ->label('Publikasikan')
                    ->default(true)
                    ->required(),
            ]);
    }
}
`;
fs.writeFileSync(blogPostFormPath, blogPostFormContent, 'utf8');
console.log('[OK] BlogPostForm.php updated');

// 4. UPDATE BlogPostsTable.php
const blogPostsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'BlogPosts', 'Tables', 'BlogPostsTable.php');
const blogPostsTableContent = `<?php

namespace App\\Filament\\Resources\\BlogPosts\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\IconColumn;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class BlogPostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Judul Artikel')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->searchable(),
                TextColumn::make('date')
                    ->label('Tanggal')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('author')
                    ->label('Penulis')
                    ->searchable(),
                IconColumn::make('is_published')
                    ->label('Tayang')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(blogPostsTablePath, blogPostsTableContent, 'utf8');
console.log('[OK] BlogPostsTable.php updated');

// 5. UPDATE GalleryItemForm.php
const galleryItemFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'GalleryItems', 'Schemas', 'GalleryItemForm.php');
const galleryItemFormContent = `<?php

namespace App\\Filament\\Resources\\GalleryItems\\Schemas;

use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TagsInput;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\Toggle;
use Filament\\Schemas\\Schema;

class GalleryItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Judul Acara / Proyek')
                    ->required(),
                Select::make('category')
                    ->label('Kategori Acara')
                    ->options([
                        'Pernikahan & Resepsi' => 'Pernikahan & Resepsi',
                        'Konser & Festival' => 'Konser & Festival',
                        'Pabrik & Industri' => 'Pabrik & Industri',
                        'Proyek & Konstruksi' => 'Proyek & Konstruksi',
                        'Pemerintahan & Event' => 'Pemerintahan & Event',
                        'Rumah Sakit & Darurat' => 'Rumah Sakit & Darurat',
                    ])
                    ->required(),
                TextInput::make('location')
                    ->label('Lokasi Acara')
                    ->required(),
                TextInput::make('genset_used')
                    ->label('Genset yang Digunakan')
                    ->required(),
                TextInput::make('image')
                    ->label('URL Foto Dokumentasi')
                    ->url()
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('client')
                    ->label('Nama Klien / EO'),
                TextInput::make('duration')
                    ->label('Durasi'),
                TextInput::make('peak_load')
                    ->label('Beban Puncak (kVA / Watt)'),
                TagsInput::make('equipment_included')
                    ->label('Peralatan & Aksesoris yang Disertakan')
                    ->placeholder('Ketik item lalu tekan Enter')
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->label('Deskripsi Penyelenggaraan')
                    ->rows(3)
                    ->columnSpanFull(),
                Textarea::make('highlight_quote')
                    ->label('Testimoni / Sorotan Singkat')
                    ->rows(2)
                    ->columnSpanFull(),
                Toggle::make('is_featured')
                    ->label('Tampilkan di Beranda')
                    ->default(true)
                    ->required(),
            ]);
    }
}
`;
fs.writeFileSync(galleryItemFormPath, galleryItemFormContent, 'utf8');
console.log('[OK] GalleryItemForm.php updated');

// 6. UPDATE GalleryItemsTable.php
const galleryItemsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'GalleryItems', 'Tables', 'GalleryItemsTable.php');
const galleryItemsTableContent = `<?php

namespace App\\Filament\\Resources\\GalleryItems\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\IconColumn;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class GalleryItemsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Judul Proyek / Acara')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->searchable(),
                TextColumn::make('location')
                    ->label('Lokasi')
                    ->searchable(),
                TextColumn::make('genset_used')
                    ->label('Genset Digunakan')
                    ->searchable(),
                TextColumn::make('client')
                    ->label('Klien')
                    ->searchable(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(galleryItemsTablePath, galleryItemsTableContent, 'utf8');
console.log('[OK] GalleryItemsTable.php updated');

// 7. UPDATE ProductForm.php
const productFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Products', 'Schemas', 'ProductForm.php');
const productFormContent = `<?php

namespace App\\Filament\\Resources\\Products\\Schemas;

use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\Toggle;
use Filament\\Schemas\\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama Produk / Tipe Genset')
                    ->required(),
                Select::make('product_type')
                    ->label('Kategori Produk')
                    ->options([
                        'genset' => 'Genset Silent (Diesel)',
                        'ac' => 'AC Standing 5 PK',
                        'paket' => 'Paket Sewa Lengkap',
                        'aksesoris' => 'Kabel Power & Aksesoris',
                    ])
                    ->default('genset')
                    ->required(),
                TextInput::make('price')
                    ->label('Harga Sewa (Rp)')
                    ->required()
                    ->numeric()
                    ->prefix('Rp '),
                TextInput::make('capacity_kva')
                    ->label('Kapasitas (kVA)')
                    ->numeric(),
                TextInput::make('image_url')
                    ->label('URL Gambar Produk')
                    ->url()
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->label('Deskripsi & Spesifikasi')
                    ->rows(4)
                    ->columnSpanFull(),
                TextInput::make('sort_order')
                    ->label('Urutan Tampilan')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_available')
                    ->label('Tersedia untuk Disewa')
                    ->default(true)
                    ->required(),
            ]);
    }
}
`;
fs.writeFileSync(productFormPath, productFormContent, 'utf8');
console.log('[OK] ProductForm.php updated');

// 8. UPDATE ProductsTable.php
const productsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Products', 'Tables', 'ProductsTable.php');
const productsTableContent = `<?php

namespace App\\Filament\\Resources\\Products\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\IconColumn;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Unit')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('product_type')
                    ->label('Kategori')
                    ->badge()
                    ->searchable(),
                TextColumn::make('capacity_kva')
                    ->label('Kapasitas (kVA)')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('price')
                    ->label('Harga Sewa')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state, 0, ',', '.'))
                    ->sortable(),
                IconColumn::make('is_available')
                    ->label('Tersedia')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(productsTablePath, productsTableContent, 'utf8');
console.log('[OK] ProductsTable.php updated');

// 9. UPDATE TestimonialForm.php
const testimonialFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Testimonials', 'Schemas', 'TestimonialForm.php');
const testimonialFormContent = `<?php

namespace App\\Filament\\Resources\\Testimonials\\Schemas;

use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\Toggle;
use Filament\\Schemas\\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama Klien')
                    ->required(),
                TextInput::make('role')
                    ->label('Peran / Jabatan')
                    ->default('Klien'),
                TextInput::make('company_or_event')
                    ->label('Perusahaan / Nama Acara')
                    ->required(),
                TextInput::make('location')
                    ->label('Lokasi (Kota / Wilayah)')
                    ->required(),
                Select::make('rating')
                    ->label('Rating Bintang')
                    ->options([
                        5 => '⭐⭐⭐⭐⭐ (5 Bintang)',
                        4 => '⭐⭐⭐⭐ (4 Bintang)',
                        3 => '⭐⭐⭐ (3 Bintang)',
                        2 => '⭐⭐ (2 Bintang)',
                        1 => '⭐ (1 Bintang)',
                    ])
                    ->default(5)
                    ->required(),
                TextInput::make('date')
                    ->label('Tanggal Testimoni')
                    ->default(fn () => now()->translatedFormat('d M Y')),
                TextInput::make('genset_used')
                    ->label('Genset yang Digunakan'),
                Select::make('avatar_bg')
                    ->label('Warna Avatar')
                    ->options([
                        'bg-amber-500' => 'Amber (Kuning Emas)',
                        'bg-blue-500' => 'Blue (Biru)',
                        'bg-emerald-500' => 'Emerald (Hijau)',
                        'bg-purple-500' => 'Purple (Ungu)',
                        'bg-rose-500' => 'Rose (Merah)',
                    ])
                    ->default('bg-amber-500'),
                Textarea::make('comment')
                    ->label('Ulasan / Komentar')
                    ->rows(4)
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('verified')
                    ->label('Klien Terverifikasi')
                    ->default(true)
                    ->required(),
                Toggle::make('is_active')
                    ->label('Tampilkan di Website')
                    ->default(true)
                    ->required(),
            ]);
    }
}
`;
fs.writeFileSync(testimonialFormPath, testimonialFormContent, 'utf8');
console.log('[OK] TestimonialForm.php updated');

// 10. UPDATE TestimonialsTable.php
const testimonialsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Testimonials', 'Tables', 'TestimonialsTable.php');
const testimonialsTableContent = `<?php

namespace App\\Filament\\Resources\\Testimonials\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\IconColumn;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class TestimonialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Klien')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('company_or_event')
                    ->label('Perusahaan / Acara')
                    ->searchable(),
                TextColumn::make('location')
                    ->label('Lokasi')
                    ->searchable(),
                TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => str_repeat('⭐', (int) $state))
                    ->sortable(),
                TextColumn::make('genset_used')
                    ->label('Genset Digunakan')
                    ->searchable(),
                IconColumn::make('verified')
                    ->label('Verified')
                    ->boolean(),
                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                TextColumn::make('date')
                    ->label('Tanggal'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(testimonialsTablePath, testimonialsTableContent, 'utf8');
console.log('[OK] TestimonialsTable.php updated');

// 11. UPDATE FaqForm.php
const faqFormPath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Faqs', 'Schemas', 'FaqForm.php');
const faqFormContent = `<?php

namespace App\\Filament\\Resources\\Faqs\\Schemas;

use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Forms\\Components\\Toggle;
use Filament\\Schemas\\Schema;

class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category')
                    ->label('Kategori Pertanyaan')
                    ->options([
                        'Umum' => 'Umum',
                        'Pemesanan & Harga' => 'Pemesanan & Harga',
                        'Teknis & Kapasitas' => 'Teknis & Kapasitas',
                        'Layanan' => 'Layanan',
                    ])
                    ->default('Umum')
                    ->required(),
                TextInput::make('sort_order')
                    ->label('Urutan')
                    ->required()
                    ->numeric()
                    ->default(0),
                Textarea::make('question')
                    ->label('Pertanyaan (FAQ)')
                    ->rows(2)
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('answer')
                    ->label('Jawaban Lengkap')
                    ->rows(4)
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('is_active')
                    ->label('Aktif Ditampilkan')
                    ->default(true)
                    ->required(),
            ]);
    }
}
`;
fs.writeFileSync(faqFormPath, faqFormContent, 'utf8');
console.log('[OK] FaqForm.php updated');

// 12. UPDATE FaqsTable.php
const faqsTablePath = path.join(backendDir, 'app', 'Filament', 'Resources', 'Faqs', 'Tables', 'FaqsTable.php');
const faqsTableContent = `<?php

namespace App\\Filament\\Resources\\Faqs\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\IconColumn;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class FaqsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->searchable(),
                TextColumn::make('question')
                    ->label('Pertanyaan')
                    ->searchable()
                    ->limit(60)
                    ->weight('bold'),
                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
`;
fs.writeFileSync(faqsTablePath, faqsTableContent, 'utf8');
console.log('[OK] FaqsTable.php updated');

console.log('ALL Filament forms & tables successfully updated!');
