import fs from 'fs';
import { extname, basename } from 'path';

export const getJsonFiles = async (dir: string) => {
  const files = fs.readdirSync(dir);
  return files.map(file => `${dir}/${file}`).filter(isValidFile);
};

export const getFileContent = async (seedFilePath: string) => {
  if (!isValidFile(seedFilePath)) {
    return null;
  }

  const imported = await import(seedFilePath);
  const seedContent = imported.default;

  if (!seedContent || !Array.isArray(seedContent)) {
    return null;
  }

  return seedContent;
};

export const getCollectionName = (file: string) => {
  if (!isValidFile(file)) {
    return null;
  }
  const seedFileName = basename(file);
  return seedFileName.split('.')[0];
};

const isValidFile = (file: string) => {
  if (!fs.existsSync(file)) {
    return false;
  }
  if (extname(file) !== '.json') {
    return false;
  }

  return fs.statSync(file).size > 0;
};
