const fs = require('fs');

fs.copyFile('../.env', './.env', (err) => {
  if (err) throw err;
  console.log('.env file was copied to project root');
});
