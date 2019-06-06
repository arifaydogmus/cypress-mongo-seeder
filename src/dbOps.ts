import mongo from 'mongodb';
import { find } from 'lodash';
import { json2mongo } from './json2mongo';

let client: mongo.MongoClient;

export const connectToDB = async (uri: string) => {
  let connectionString = 'mongodb://localhost/seed_db';

  const hasScheme =
    uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');

  if (uri && !hasScheme) {
    connectionString = `mongodb://${uri}`;
  } else if (uri && hasScheme) {
    connectionString = uri;
  }
  try {
    client = await mongo.MongoClient.connect(connectionString, {
      useNewUrlParser: true,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const isCollectionExists = async (name: string) => {
  if (!client.isConnected()) {
    console.log('Mongo client not connected!');
    return false;
  }
  const dbCollections = await client
    .db()
    .listCollections()
    .toArray();
  return Boolean(find(dbCollections, { name }));
};

export const insert = async (
  collection: string,
  content: object[],
  drop: boolean = true
) => {
  if (content.length < 1) {
    return false;
  }
  if (!client.isConnected()) {
    console.log('Not inserted. Reason: Mongo client not connected!');
    return false;
  }

  try {
    let isDropped = false;
    const isExists = await isCollectionExists(collection);

    if (drop && isExists) {
      isDropped = await client.db().dropCollection(collection);
      if (!isDropped) {
        console.log(`Collection ${collection} couldn't be dropped.`);
        return false;
      }
    }

    if (!isExists || isDropped) {
      await client.db().createCollection(collection);
    }

    const data = content.map((val: object) => {
      return json2mongo(val);
    });

    const inserted = await client
      .db()
      .collection(collection)
      .insertMany(data, { bypassDocumentValidation: true });

    return inserted.insertedCount > 0;
  } catch (e) {
    console.log(e);
    return false;
  }
};
