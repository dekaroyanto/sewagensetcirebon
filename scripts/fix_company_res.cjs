const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend');
const resFile = path.join(backendDir, 'app', 'Filament', 'Resources', 'CompanySettings', 'CompanySettingResource.php');

const cleanResource = `<?php

namespace App\\Filament\\Resources\\CompanySettings;

use App\\Filament\\Resources\\CompanySettings\\Pages\\CreateCompanySetting;
use App\\Filament\\Resources\\CompanySettings\\Pages\\EditCompanySetting;
use App\\Filament\\Resources\\CompanySettings\\Pages\\ListCompanySettings;
use App\\Filament\\Resources\\CompanySettings\\Schemas\\CompanySettingForm;
use App\\Filament\\Resources\\CompanySettings\\Tables\\CompanySettingsTable;
use App\\Models\\CompanySetting;
use BackedEnum;
use Filament\\Resources\\Resource;
use Filament\\Schemas\\Schema;
use Filament\\Support\\Icons\\Heroicon;
use Filament\\Tables\\Table;
use UnitEnum;

class CompanySettingResource extends Resource
{
    protected static ?string $model = CompanySetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Pengaturan Kontak';

    protected static UnitEnum|string|null $navigationGroup = 'Pengaturan';

    protected static ?string $modelLabel = 'Pengaturan Perusahaan';

    protected static ?string $recordTitleAttribute = 'key';

    public static function form(Schema $schema): Schema
    {
        return CompanySettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CompanySettingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCompanySettings::route('/'),
            'create' => CreateCompanySetting::route('/create'),
            'edit' => EditCompanySetting::route('/{record}/edit'),
        ];
    }
}
`;

fs.writeFileSync(resFile, cleanResource, 'utf8');
console.log('Fixed CompanySettingResource.php');
