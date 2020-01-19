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
    it('stylesheet was injected into body', async () => {
      await page.waitFor(3000);
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);

      await expect(bodyHTML.indexOf('type="text/css"') > 0).toBe(true);
    });

    it('body background style set correctly', async () => {
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
    it('stylesheet was injected into body', async () => {
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);

      await expect(bodyHTML.indexOf('type="text/css"') > 0).toBe(true);
    });

    it('body background style set correctly', async () => {
      await page.waitFor(4000);
      const bodyStyle = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue('background-color')
      );

      await expect(bodyStyle).toBe('rgb(255, 0, 0)');
    });
  });

  afterAll(() => {
    const childProcess = require('child_process').exec;
    childProcess(`kill $(lsof -t -i:3001)`);
    childProcess(`kill $(lsof -t -i:5000)`);
  });
});
