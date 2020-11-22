const fs = require('fs');
const { argv } = require('process');
const moment = require('moment')();

if(process.argv.length !=3){
    console.log('How to Use:');
    console.log('node add_migration.js [MIGRATION_NAME]');
}else{
    const currentTime = moment.format('YYYY-MM-DD-h-mm-ss');
    const name = currentTime + '-' + argv[2] ;
    const path = `../db/migrations/${name}.js`;
    fs.writeFile(path,"",()=>{});
    console.log('Created file: ' + name);
}