import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { syncVersion } from '../src/index';

// fs 모듈 모킹 (실제 파일 수정 방지)
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

describe('tauri-version-sync test', () => {
  const mockNewVersion = '1.2.3';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('package.json의 버전을 정확히 업데이트해야 한다', () => {
    const originalPkg = JSON.stringify({ name: 'test', version: '1.0.0' });
    (existsSync as any).mockReturnValue(true);
    (readFileSync as any).mockReturnValue(originalPkg);

    syncVersion(mockNewVersion);

    // writeFileSync가 호출될 때 전달된 인자 확인
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.stringContaining('"version": "1.2.3"')
    );
  });

  it('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE1', () => {
    const originalCargo = `
[package]
name = "void-app"
version = "0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();

    (existsSync as any).mockImplementation((path: string) => path.includes('Cargo.toml'));
    (readFileSync as any).mockReturnValue(originalCargo);

    syncVersion(mockNewVersion);

    // 정규표현식 결과 확인: [package] 버전은 바뀌고 [dependencies] 버전은 유지되어야 함
    const callArgs = (writeFileSync as any).mock.calls.find((call: any) => call[0].includes('Cargo.toml'));
    const savedContent = callArgs[1];

    expect(savedContent).toContain('version = "1.2.3"');
    expect(savedContent).toContain('tauri = { version = "1.0.0" }'); // 의존성 버전은 유지
  });

it('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE2', () => {
    const originalCargo = `
[package]
name = "void-app"
version = "     0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();

    (existsSync as any).mockImplementation((path: string) => path.includes('Cargo.toml'));
    (readFileSync as any).mockReturnValue(originalCargo);

    syncVersion(mockNewVersion);

    const callArgs = (writeFileSync as any).mock.calls.find((call: any) => call[0].includes('Cargo.toml'));
    const savedContent = callArgs[1];

    expect(savedContent).toContain('version = "1.2.3"');
    expect(savedContent).toContain('tauri = { version = "1.0.0" }'); 
  });

it('Cargo.toml의 [package] 버전만 정확히 업데이트해야 한다: CASE2', () => {
    const originalCargo = `
[package]
name = "void-app"
version =     "0.1.0"

[dependencies]
tauri = { version = "1.0.0" }
    `.trim();

    (existsSync as any).mockImplementation((path: string) => path.includes('Cargo.toml'));
    (readFileSync as any).mockReturnValue(originalCargo);

    syncVersion(mockNewVersion);

    const callArgs = (writeFileSync as any).mock.calls.find((call: any) => call[0].includes('Cargo.toml'));
    const savedContent = callArgs[1];

    // console.log('Saved Content:', savedContent);
    // expect(savedContent).toContain('version = "1.2.3"');
    expect(savedContent).toContain('version =     "1.2.3"');
    expect(savedContent).toContain('tauri = { version = "1.0.0" }'); 
  });

});