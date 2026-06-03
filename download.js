const fs = require('fs');

fetch('https://simplemaps.com/static/svg/in/in.svg', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0.4896.127 Safari/537.36'
  }
}).then(res => res.text()).then(svg => {
  fs.writeFileSync('c:/xampp/htdocs/1Bridge/src/pages/Home/india-map.svg', svg);
  console.log('SVG Downloaded!');
}).catch(console.error);
