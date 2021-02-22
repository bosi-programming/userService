import { encrypt, decrypt } from './encryption';

describe('Test encryption function', () => {
  test('Encrypt and decrypt functions', () => {
    expect(decrypt(encrypt('test'))).toBe('test');
  });

  test('Encrypt and decrypt functions', () => {
    expect(decrypt(encrypt('banana'))).not.toBe('test');
  });
});
