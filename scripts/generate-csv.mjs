import fs from 'fs';
import path from 'path';

const dir = import.meta.dirname || process.cwd() + '/scripts';

const contentDataStr = fs.readFileSync(path.join(dir, '../src/data/content-data.ts'), 'utf-8');
const seasonMapStr = fs.readFileSync(path.join(dir, '../src/data/season-map.ts'), 'utf-8');

function extractArray(str) {
  const match = str.match(/export const \w+(?:: \w+\[\])? = (\[[\s\S]*?\]);/);
  if (match && match[1]) {
    // using Function instead of eval
    return new Function('return ' + match[1])(); 
  }
  return [];
}

const contentData = extractArray(contentDataStr);
const seasonMap = extractArray(seasonMapStr);

function jsonToCsv(items) {
  if (!items || !items.length) return '';
  const headers = Object.keys(items[0]);
  const rows = items.map(item => 
    headers.map(header => {
      let val = item[header];
      if (val === undefined || val === null) val = '';
      val = String(val).replace(/"/g, '""'); 
      if (val.search(/("|,|\n)/g) >= 0) {
        val = `"${val}"`;
      }
      return val;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

fs.writeFileSync(path.join(dir, '../public/data/content_data.csv'), jsonToCsv(contentData));
fs.writeFileSync(path.join(dir, '../public/data/season_map.csv'), jsonToCsv(seasonMap));

console.log('CSV files generated in /public/data');
