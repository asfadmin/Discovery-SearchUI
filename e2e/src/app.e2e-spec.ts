import { browser, element, by} from 'protractor';
import { AppPage } from './app.po';

describe('Open the link', () => {
  let page: AppPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    browser.get('url');
    browser.sleep(2000);
    page = new AppPage();
  });

  it('should present viewpoint', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('ASF Data Portal');
  });
});
