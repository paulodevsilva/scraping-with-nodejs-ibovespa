require('dotenv').config({ silent: true });

const scraping = require('./services/scraping')

const main = async () => {
    require('./services/bot');
    require('./db/firebase');

    await scraping()

};

main();
