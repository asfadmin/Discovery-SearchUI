import { GranuleListModule } from './granule-list.module';

describe('GranuleListModule', () => {
  let granuleListModule: GranuleListModule;

  beforeEach(() => {
    granuleListModule = new GranuleListModule();
  });

  it('should create an instance', () => {
    expect(granuleListModule).toBeTruthy();
  });
});
