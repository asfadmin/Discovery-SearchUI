import { FiltersMenuModule } from './filters-menu.module';

describe('FiltersMenuModule', () => {
  let filtersMenuModule: FiltersMenuModule;

  beforeEach(() => {
    filtersMenuModule = new FiltersMenuModule();
  });

  it('should create an instance', () => {
    expect(filtersMenuModule).toBeTruthy();
  });
});
