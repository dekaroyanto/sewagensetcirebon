const fs = require('fs');
const path = require('path');

const consoleRoutesPath = path.resolve(__dirname, '..', '..', 'sewagensetcirebon-backend', 'routes', 'console.php');
let content = `<?php

use Illuminate\\Foundation\\Inspiring;
use Illuminate\\Support\\Facades\\Artisan;
use App\\Console\\Commands\\TestCrud;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('test:crud', function () {
    $cmd = new TestCrud();
    $cmd->setOutput($this->output);
    $cmd->handle();
});
`;

fs.writeFileSync(consoleRoutesPath, content, 'utf8');
console.log('Cleanly updated routes/console.php with double backslashes');
