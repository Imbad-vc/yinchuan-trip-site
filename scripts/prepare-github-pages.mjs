import {readdir, readFile, writeFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/client/', import.meta.url));
const basePath = '/yinchuan-trip-site';
const textExtensions = new Set(['.html', '.js', '.rsc']);

async function updateDirectory(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await updateDirectory(path);
    } else if (textExtensions.has(extname(entry.name))) {
      const source = await readFile(path, 'utf8');
      const updated = source.replaceAll('/yinchuan.png', `${basePath}/yinchuan.png`);
      if (updated !== source) await writeFile(path, updated);
    }
  }
}

await updateDirectory(outputDirectory);
