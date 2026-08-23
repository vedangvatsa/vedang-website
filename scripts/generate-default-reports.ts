import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function generateDefault(fileName: string, outputName: string, count = 1000) {
  const outputPath = path.join(PUBLIC_DIR, outputName);
  if (fs.existsSync(outputPath) && !process.env.FORCE_REPORTS) {
    console.log(`Skipping ${outputName} (already exists).`);
    return;
  }

  const filePath = path.join(PUBLIC_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Source file ${filePath} does not exist.`);
    return;
  }
  
  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);
  console.log(`Loaded ${data.length} reports from ${fileName}`);
  
  // The datasets are already sorted by citations/date, so just take the top ones
  const defaultList = data.slice(0, count);
  
  fs.writeFileSync(outputPath, JSON.stringify(defaultList), 'utf8');
  console.log(`Generated ${defaultList.length} default reports to ${outputName}`);
}

try {
  generateDefault('ai-reports-data.json', 'ai-reports-default.json');
  generateDefault('web3-reports-data.json', 'web3-reports-default.json');
  console.log('Successfully pre-generated default report library JSON files.');
} catch (err) {
  console.error('Error pre-generating default reports:', err);
  process.exit(1);
}
