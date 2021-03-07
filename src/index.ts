import { resolve } from 'path';
import { getJsonFiles, getFileContent, getCollectionName } from './fileOps';
import { connectToDB, insert } from './dbOps';

let willDropCollection: boolean;

const seedAFile = async (seedFile: string) => {
  const collection = getCollectionName(seedFile);
  const seedContent = getFileContent(seedFile);
  if (!collection || !seedContent) {
    console.log('Skipping ', collection || seedFile);
    return;
  }
  console.log('Seeding ', collection);
  await insert(collection, seedContent, willDropCollection);
  return;
};

export const seedAll = async (
  mongoUri: string,
  dataFolder: string,
  dropCollection: boolean = true
) => {
  willDropCollection = dropCollection;
  try {
    const seedsFolder = resolve(dataFolder);
    const seedFiles = getJsonFiles(seedsFolder);
    await connectToDB(mongoUri);
    await Promise.all(seedFiles.map(seedAFile));
    return true;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const seedSingleCollection = async (
  mongoUri: string,
  fileAbsolutePath: string,
  dropCollection: boolean = true
) => {
  willDropCollection = dropCollection;
  try {
    await connectToDB(mongoUri);
    await seedAFile(fileAbsolutePath);
    return true;
  } catch (e) {
    console.log(e);
    return e;
  }
};
