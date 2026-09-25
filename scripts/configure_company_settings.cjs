const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend');

// 1. CompanySettingForm.php
const formFile = path.join(backendDir, 'app', 'Filament', 'Resources', 'CompanySettings', 'Schemas', 'CompanySettingForm.php');
const formContent = `<?php

namespace App\\Filament\\Resources\\CompanySettings\\Schemas;

use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Textarea;
use Filament\\Schemas\\Schema;

class CompanySettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('key')
                    ->label('Kunci Pengaturan (Key)')
                    ->required()
                    ->helperText('Contoh: company_name, phone_number, whatsapp_number, address, email, operating_hours'),
                Select::make('group')
                    ->label('Grup')
                    ->options([
                        'general' => 'Umum (General)',
                        'contact' => 'Kontak & Alamat',
                        'social' => 'Media Sosial',
                    ])
                    ->default('general')
                    ->required(),
                Textarea::make('value')
                    ->label('Nilai Pengaturan (Value)')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
`;
fs.writeFileSync(formFile, formContent, 'utf8');

// 2. CompanySettingsTable.php
const tableFile = path.join(backendDir, 'app', 'Filament', 'Resources', 'CompanySettings', 'Tables', 'CompanySettingsTable.php');
const tableContent = `<?php

namespace App\\Filament\\Resources\\CompanySettings\\Tables;

use Filament\\Actions\\BulkActionGroup;
use Filament\\Actions\\DeleteAction;
use Filament\\Actions\\DeleteBulkAction;
use Filament\\Actions\\EditAction;
use Filament\\Tables\\Columns\\TextColumn;
use Filament\\Tables\\Table;

class CompanySettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Kunci (Key)')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('value')
                    ->label('Nilai Pengaturan')
                    ->searchable()
                    ->limit(60),
                TextColumn::make('group')
                    ->label('Grup')
                    ->badge(),
                TextColumn::make('updated_at')
                    ->label('Terakhir Diubah')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
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
fs.writeFileSync(tableFile, tableContent, 'utf8');

// 3. CompanySettingResource.php (Navigation Label)
const resFile = path.join(backendDir, 'app', 'Filament', 'Resources', 'CompanySettings', 'CompanySettingResource.php');
let resContent = fs.readFileSync(resFile, 'utf8');
if (!resContent.includes('$navigationLabel')) {
    resContent = resContent.replace(
        /class CompanySettingResource extends Resource\s*\{/,
        `class CompanySettingResource extends Resource\n{\n    protected static ?string $navigationLabel = 'Pengaturan Kontak';\n    protected static ?string $navigationGroup = 'Pengaturan';\n    protected static ?string $modelLabel = 'Pengaturan Perusahaan';`
    );
    fs.writeFileSync(resFile, resContent, 'utf8');
}

console.log('[OK] CompanySetting resource updated with labels, table, form and delete action!');
