const { setup: setupDevServer } = require('jest-dev-server');

describe('insert-string', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);

    async function globalSetup() {
      await setupDevServer({
        command:
          'webpack test/cases/in/index.js --config test/manual/webpack.config.js',
        port: 5000,
        launchTimeout: 10000,
      });
      // Your global setup
    }
    await globalSetup();
    await page.goto('http://localhost:5000/');
  });

  it('stylesheet was injected into body', async () => {
    await page.waitFor(4000);
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
