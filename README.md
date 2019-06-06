# cypress-mongo-seeder

> A tool to quickly populate your mongo db from a set of .json files. The package prepared for seed database before each test on Cypress. You can use as a Cypress plugin or independently.

## Setup

```sh
$ npm install --save-dev cypress-mongo-seeder

or

$ yarn add --dev cypress-mongo-seeder
```

## Usage

### seedAll

Read all json files in specified directory and insert them to mongodb. (File names are collection names)

```javascript
seedAll: (
  mongoUri: string,
  dataFolder: string,
  dropCollection?: boolean
) => Promise<any>;
```

#### As a Cypress plugin

cypress/plugins/index.js

```javascript
const path = require('path');
const seeder = require('cypress-mongo-seeder');

const mongouri = 'mongodb://localhost:27017/dummy-db';
const folder = './data';
const dropCollections = true;

module.exports = on => {
  on('task', {
    'seed:database': () => {
      return seeder.seedAll(mongouri, folder, dropCollections);
    },
  });
};
```

### seedSingleCollection

Reads a json file and inserts content to mongo. (File name is collection name )

```javascript
seedSingleCollection: (
  mongoUri: string,
  fileAbsolutePath: string,
  dropCollection?: boolean
) => Promise<any>;
```

```javascript
const path = require('path');
const seeder = require('../build');

const mongouri = 'mongodb://localhost:27017/dummy-main';
const fileFullPath = path.resolve(__dirname + '/data/users.json');
const dropCollection = true;

seeder
  .seedSingleCollection(mongouri, fileFullPath, dropCollection)
  .then(seeded => {
    console.log('Seeded -> ', seeded);
  });
```

## Contributing

1. Fork the project
2. Add feature(s)
3. Add tests for it
4. Submit pull request

Enjoy!
