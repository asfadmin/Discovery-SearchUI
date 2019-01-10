import { PlatformSelectorModule } from './platform-selector.module';

describe('PlatformSelectorModule', () => {
  let platformSelectorModule: PlatformSelectorModule;

  beforeEach(() => {
    platformSelectorModule = new PlatformSelectorModule();
  });

  it('should create an instance', () => {
    expect(platformSelectorModule).toBeTruthy();
  });
});
