import { encrypt, decrypt } from './encryption';

describe('Test encryption function', () => {
  test('Encrypt and decrypt functions', () => {
    expect(decrypt(encrypt('test', 'banana'), 'banana')).toBe('test');
  });

  test('Encrypt and decrypt functions', () => {
    expect(decrypt(encrypt('banana', 'banana'), 'banana')).not.toBe('test');
  });
});
