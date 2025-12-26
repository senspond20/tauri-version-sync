#!/usr/bin/env node
import { syncVersion } from './index.js';

const version = process.argv[2];

if (!version) {
  console.error('❌ Usage: tauri-version-sync <version>');
  process.exit(1);
}

try {
  syncVersion(version);
  console.log('🚀 All versions synchronized successfully!');
} catch (err: any) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}