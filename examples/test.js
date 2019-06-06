const seeder = require('../build');

const mongouri = 'mongodb://localhost:27017/dummy-main';
const folder = './examples/data';

(async () => {
  const seeded = await seeder.seedAll(mongouri, folder);
  console.log('Seeded -> ', seeded);
  process.exit(0);
})();
