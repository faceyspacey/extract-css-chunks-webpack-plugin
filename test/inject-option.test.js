/* global page, document, getComputedStyle */

const { setup: setupDevServer } = require('jest-dev-server');

describe('insert-options', () => {
  describe('insert-string', () => {
    beforeAll(async () => {
      await setupDevServer({
        command:
          'webpack-dev-server test/cases/insert-string/src/index.js --config test/cases/insert-string/webpack.config.e2e.js',
        port: 5000,
        launchTimeout: 10000,
      });
      await page.goto('http://localhost:5000/');
    });
    it('style preload was injected into body', async () => {
      // preloaded1 + main + inject
      await expect(await page.$$eval('[type="text/css"]', links => links.length)).toEqual(3);
      // inject
      await expect(await page.$$eval('[rel="preload"]', preloads => preloads.length)).toEqual(1);
    });

    it('body background style was not set', async () => {
      const bodyStyle = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue('background-color')
      );

      await expect(bodyStyle).toBe('rgb(255, 0, 0)');
    });
  });

  describe('insert-function', () => {
    beforeAll(async () => {
      await setupDevServer({
        command: `webpack-dev-server test/cases/insert-function/src/index.js --config test/cases/insert-function/webpack.config.e2e.js`,
        port: 3001,
        launchTimeout: 15000,
      });
      await page.goto('http://localhost:3001/');
    });
    it('style preload was injected into body', async () => {
      // preloaded1 + main + inject
      await expect(await page.$$eval('[type="text/css"]', links => links.length)).toEqual(3);
      // inject
      await expect(await page.$$eval('[rel="preload"]', preloads => preloads.length)).toEqual(1);
    });

    it('body background style was not set', async () => {
      await page.waitFor(4000);
      const bodyStyle = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue('background-color')
      );

      await expect(bodyStyle).toBe('rgb(255, 0, 0)');
    });
  });

  afterAll(() => {
    // eslint-disable-next-line
    const childProcess = require('child_process').exec;
    childProcess(`kill $(lsof -t -i:3001)`);
    childProcess(`kill $(lsof -t -i:5000)`);
  });
});
