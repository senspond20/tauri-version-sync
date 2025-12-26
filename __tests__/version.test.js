"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_fs_1 = require("node:fs");
const index_1 = require("../src/index");
// fs 모듈 모킹 (실제 파일 수정 방지)
vitest_1.vi.mock('node:fs', () => ({
    readFileSync: vitest_1.vi.fn(),
    writeFileSync: vitest_1.vi.fn(),
    existsSync: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)('tauri-version-sync test', () => {
    const mockNewVersion = '1.2.3';
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('package.json의 버전을 정확히 업데이트해야 한다', () => {
        const originalPkg = JSON.stringify({ name: 'test', version: '1.0.0' });
        node_fs_1.existsSync.mockReturnValue(true);
        node_fs_1.readFileSync.mockReturnValue(originalPkg);
        (0, index_1.syncVersion)(mockNewVersion);
        // writeFileSync가 호출될 때 전달된 인자 확인
        (0, vitest_1.expect)(node_fs_1.writeFileSync).toHaveBeenCalledWith(vitest_1.expect.stringContaining('package.json'), vitest_1.expect.stringContaining('"version": "1.2.3"'));
    });
    (0, vitest_1.it)('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE1', () => {
        const originalCargo = `
[package]
name = "void-app"
version = "0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();
        node_fs_1.existsSync.mockImplementation((path) => path.includes('Cargo.toml'));
        node_fs_1.readFileSync.mockReturnValue(originalCargo);
        (0, index_1.syncVersion)(mockNewVersion);
        // 정규표현식 결과 확인: [package] 버전은 바뀌고 [dependencies] 버전은 유지되어야 함
        const callArgs = node_fs_1.writeFileSync.mock.calls.find((call) => call[0].includes('Cargo.toml'));
        const savedContent = callArgs[1];
        (0, vitest_1.expect)(savedContent).toContain('version = "1.2.3"');
        (0, vitest_1.expect)(savedContent).toContain('tauri = { version = "1.0.0" }'); // 의존성 버전은 유지
    });
    (0, vitest_1.it)('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE2', () => {
        const originalCargo = `
[package]
name = "void-app"
version = "     0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();
        node_fs_1.existsSync.mockImplementation((path) => path.includes('Cargo.toml'));
        node_fs_1.readFileSync.mockReturnValue(originalCargo);
        (0, index_1.syncVersion)(mockNewVersion);
        const callArgs = node_fs_1.writeFileSync.mock.calls.find((call) => call[0].includes('Cargo.toml'));
        const savedContent = callArgs[1];
        (0, vitest_1.expect)(savedContent).toContain('version = "1.2.3"');
        (0, vitest_1.expect)(savedContent).toContain('tauri = { version = "1.0.0" }');
    });
    (0, vitest_1.it)('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE2', () => {
        const originalCargo = `
[package]
name = "void-app"
version =     "0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();
        node_fs_1.existsSync.mockImplementation((path) => path.includes('Cargo.toml'));
        node_fs_1.readFileSync.mockReturnValue(originalCargo);
        (0, index_1.syncVersion)(mockNewVersion);
        const callArgs = node_fs_1.writeFileSync.mock.calls.find((call) => call[0].includes('Cargo.toml'));
        const savedContent = callArgs[1];
        // console.log('Saved Content:', savedContent);
        // expect(savedContent).toContain('version = "1.2.3"');
        (0, vitest_1.expect)(savedContent).toContain('version =     "1.2.3"');
        (0, vitest_1.expect)(savedContent).toContain('tauri = { version = "1.0.0" }');
    });
});
//# sourceMappingURL=version.test.js.map