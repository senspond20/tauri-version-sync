## Tauri Version Sync

Tauri Version Sync is a high-precision automation utility designed to eliminate version fragmentation in Tauri applications. 
Due to its hybrid architecture, a Tauri project operates across three distinct ecosystems, each with its own configuration lifecycle:

- Node.js Layer: package.json (Dependency and metadata management)
- Tauri Framework Layer: tauri.conf.json (Bundling and framework-specific specs)
- Rust Core Layer: Cargo.toml (Compile-time package information)

A mismatch between these layers during the release process can lead to critical failures: update check inconsistencies, corrupted binary metadata, and CI/CD pipeline breakage. This utility mitigates these risks through automated synchronization.

## Key Features
### 1. High-Precision Regex Mapping (Cargo.toml)
Unlike naive string replacement, this tool utilizes advanced regular expressions with the m (multiline) flag. It specifically targets the version field within the [package] section while ensuring that version strings in the [dependencies] or [workspace] sections remain untouched.

### 2. Integrity Validation
Before initiating any write operations, the module performs integrity checks using node:fs's existsSync. This ensures the tool remains safe to use even in non-standard project structures or monorepo environments.

### 3. Formatting Preservation (Pretty Print)
The tool maintains architectural hygiene by using null, 2 indentation for JSON serialization and ensuring trailing newlines (\n) are preserved. This prevents unnecessary "dirty diffs" in version control and maintains readability.

## 🚀 Getting Started

### Install
```bash
# Install as a dev dependency
npm install --save-dev @rgbitsoft/tauri-version-sync
```
or 

```bash
pnpm add -D @rgbitsoft/tauri-version-sync
```

### How to Use

```bash
#  sync to your development version
npx tauri-version-sync 1.0.5
```

### Easy to Use
+ package.json
```json
"scripts": {
    "tvs": "tauri-version-sync"
},
"devDependencies": {
    "tauri-version-sync": "^1.0.1" 
}
```

```bash
pnpm tvs 1.0.6
```

