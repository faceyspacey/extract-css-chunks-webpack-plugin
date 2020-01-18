/* global page, document, getComputedStyle */

const { setup: setupDevServer } = require('jest-dev-server');

const childProcess = require('child_process').exec;

describe('insert-string', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);

    async function globalSetup() {
      await setupDevServer({
        command:
          'webpack-dev-server test/cases/insert-string/src/index.js --config test/cases/insert-string/webpack.config.js',
        port: 5000,
        launchTimeout: 10000,
      });
    }
    await globalSetup();
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

  afterAll(() => {
    childProcess('kill $(lsof -t -i:5000)');
  });
});
