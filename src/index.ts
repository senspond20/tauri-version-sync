import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export function syncVersion(newVersion: string) {
  const root = process.cwd();
  
  const paths = {
    pkg: resolve(root, 'package.json'),
    tauri: resolve(root, 'src-tauri/tauri.conf.json'),
    cargo: resolve(root, 'src-tauri/Cargo.toml')
  };

  // 1. package.json
  if (existsSync(paths.pkg)) {
    const pkg = JSON.parse(readFileSync(paths.pkg, 'utf8'));
    pkg.version = newVersion;
    writeFileSync(paths.pkg, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`package.json updated to ${newVersion}`);
  }

  // 2. tauri.conf.json
  if (existsSync(paths.tauri)) {
    const tauri = JSON.parse(readFileSync(paths.tauri, 'utf8'));
    tauri.version = newVersion;
    writeFileSync(paths.tauri, JSON.stringify(tauri, null, 2) + '\n');
    console.log(`tauri.conf.json updated to ${newVersion}`);
  }

  // 3. Cargo.toml
  if (existsSync(paths.cargo)) {
    let cargo = readFileSync(paths.cargo, 'utf8');
    cargo = cargo.replace(/^(version\s*=\s*")([^"]*)(")/m, `$1${newVersion}$3`);
    writeFileSync(paths.cargo, cargo);
    console.log(`Cargo.toml updated to ${newVersion}`);
  }
}