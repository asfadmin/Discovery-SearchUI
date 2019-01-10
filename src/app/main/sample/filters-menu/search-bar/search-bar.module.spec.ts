import { SearchBarModule } from './search-bar.module';

describe('SearchBarModule', () => {
  let searchBarModule: SearchBarModule;

  beforeEach(() => {
    searchBarModule = new SearchBarModule();
  });

  it('should create an instance', () => {
    expect(searchBarModule).toBeTruthy();
  });
});
