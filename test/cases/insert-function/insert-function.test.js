/* global page, document, getComputedStyle */

const { setup: setupDevServer } = require('jest-dev-server');

const childProcess = require('child_process').exec;

describe('insert-string', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);

    async function globalSetup() {
      await setupDevServer({
        command:
          'webpack-dev-server test/cases/insert-function/src/index.js --config test/cases/insert-function/webpack.config.js',
        port: 3001,
        launchTimeout: 15000,
      });
    }
    await globalSetup();
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

  afterAll(() => {
    childProcess('kill $(lsof -t -i:3001)');
  });
});
