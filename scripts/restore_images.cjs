const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const itemsToRestore = [
  {
    targetFilename: 'sgc_01snapsave-app_384_20260929_125308_6c6eea.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/01. snapsave-app_3847561410914121238_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_02snapsave-app_385_20260929_125455_b42265.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/02. snapsave-app_3859820936279223180_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_03snapsave-app_375_20260929_125523_c1fcba.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/03. snapsave-app_3750437911247616599_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_04snapsave-app_374_20260929_125556_81d363.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/04. snapsave-app_3745075492031731774_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_05snapsave-app_374_20260929_125701_67e8ef.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/05. snapsave-app_3742137576468945984_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_06snapsave-app_362_20260929_125741_ebc73b.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/06. snapsave-app_3626978869783416506_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_071snapsave-app_3_20260929_125812_4caad6.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/07. 1 snapsave-app_3461992487613865749_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_072snapsave-app_3_20260929_125956_e4f33b.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/07. 2 snapsave-app_3461992487638859605_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_08snapsave-app_344_20260929_125831_3be313.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/08. snapsave-app_3448543074266389281_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_09snapsave-app_344_20260929_125906_64bfd5.jpg',
    sourcePath: 'C:/Users/deka/Downloads/SGC PHOTO/09. snapsave-app_3442887640864110584_6339160798.jpg'
  },
  {
    targetFilename: 'sgc_genset100Kva_20260929_022910_38452c.jpg',
    sourcePath: path.join(__dirname, '..', 'public', 'uploads', 'sgc_genset100Kva_20260928_155733_1e0c9f.jpg')
  },
  {
    targetFilename: 'sgc_ac1_20260929_023027_2e6cc3.jpg',
    sourcePath: path.join(__dirname, '..', 'public', 'uploads', 'sgc_ac1_20260928_155745_a700fb.jpg')
  }
];

async function run() {
  console.log('--- STARTING IMAGE RESTORATION ---');

  for (const item of itemsToRestore) {
    if (!fs.existsSync(item.sourcePath)) {
      console.error(`[ERROR] Source not found: ${item.sourcePath}`);
      continue;
    }

    // 1. Copy locally to public/uploads/
    const localDest = path.join(uploadsDir, item.targetFilename);
    fs.copyFileSync(item.sourcePath, localDest);
    console.log(`[LOCAL COPY] Copied to ${localDest}`);

    // 2. Upload to server via API
    const buffer = fs.readFileSync(item.sourcePath);
    const base64 = 'data:image/jpeg;base64,' + buffer.toString('base64');

    try {
      const res = await fetch('https://sewagensetcirebon.com/api/upload.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          custom_filename: item.targetFilename
        })
      });
      const data = await res.json();
      console.log(`[SERVER UPLOAD] ${item.targetFilename}: status=${data.status}, message=${data.message || ''}`);
    } catch (err) {
      console.error(`[SERVER UPLOAD ERROR] ${item.targetFilename}:`, err.message);
    }
  }

  console.log('\n--- VERIFYING ALL RESTORED IMAGES VIA HTTPS ---');
  for (const item of itemsToRestore) {
    const url = `https://sewagensetcirebon.com/uploads/${item.targetFilename}`;
    try {
      const res = await fetch(url);
      console.log(`[VERIFY] ${item.targetFilename} -> HTTP ${res.status}`);
    } catch (err) {
      console.error(`[VERIFY ERROR] ${item.targetFilename} -> ${err.message}`);
    }
  }

  console.log('\n--- RESTORATION COMPLETE ---');
}

run();
