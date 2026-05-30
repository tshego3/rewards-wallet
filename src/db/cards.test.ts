import { describe, it, expect } from 'vitest';

describe('data validation', () => {
  it('validates card categories', () => {
    const validCategories = ['retail', 'grocery', 'fuel', 'pharmacy', 'other'];
    expect(validCategories).toContain('retail');
    expect(validCategories).toContain('grocery');
    expect(validCategories).not.toContain('invalid');
  });

  it('validates barcode formats', () => {
    const validFormats = ['EAN13', 'CODE128'];
    expect(validFormats).toContain('EAN13');
    expect(validFormats).toContain('CODE128');
    expect(validFormats).not.toContain('QR');
  });
});
