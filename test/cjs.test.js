import ExtractCssChunks from '../src';
import CJSExtractCssChunks from '../src/cjs';

describe('CJS', () => {
  it('should exported plugin', () => {
    expect(CJSExtractCssChunks).toEqual(ExtractCssChunks);
  });
});
