const fs = require('fs');
const { Parser, transforms: { unwind } } = require('json2csv');

async function main() {
    const modules = [];
    fs.readdirSync('./public/securityinjections').forEach(file => {
        const name = file.replaceAll('_', ' ').substring(0, file.indexOf('.html')).split('-');
        const uri = `https://security-injections.clark.center/${file}`;
        modules.push({
            name: `${name[0]} ${name[1]}`,
            uri
        });
    })

    const fields = [
        'name', 'uri',
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(modules);

    // Save string to file
    fs.writeFileSync('./scripts/security-injections.csv', csv, (e) => {
        if(e) {
            console.error(e);
        } else {
            console.log('Done!');
        }
    });
}

main();