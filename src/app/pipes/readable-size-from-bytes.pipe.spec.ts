import { ReadableSizeFromBytesPipe } from './readable-size-from-bytes.pipe';

describe('ReadableSizeFromBytesPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableSizeFromBytesPipe();
    expect(pipe).toBeTruthy();
  });
});
