const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, 'bibliotek-sn.xlsx'));
const ws = wb.Sheets['Bibliotek'];
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

const headers = rawData[0];
const books = rawData.slice(1).filter(row => row[0]).map(row => ({
  tittel: row[0] || '',
  forfatter: row[1] || '',
  sjanger: row[2] || '',
  spraak: row[3] || '',
  eierform: row[4] || '',
  kjoept: row[5] || '',
  eier: row[6] || '',
  notater: row[7] || '',
  lestNora: row[8] === 'TRUE' || row[8] === true,
  lestSara: row[9] === 'TRUE' || row[9] === true
}));

const outputPath = path.join(__dirname, '..', 'src', 'data', 'books.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));
console.log(`Wrote ${books.length} books to ${outputPath}`);
