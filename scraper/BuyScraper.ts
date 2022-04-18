import puppeteer, { Browser, Page, HTTPResponse } from 'puppeteer'

class BuyScraper {

  public async init () {
    const browser = await this.startBrowser ();
    const page = await this.launchPage (browser);
    await this.interceptHttpRequests (page);
    const request = await this.navigateToPage (page, "https://www.apple.com/shop/buy-mac/imac/blue-24-inch-8-core-cpu-7-core-gpu-8gb-memory-256gb#");

    await this.close (browser);
  }

  private async startBrowser (): Promise<Browser> {
    // Start Browser
    return Promise.resolve(await puppeteer.launch ({ headless: false }));
  }

  private async launchPage (browser: Browser): Promise<Page> {
    // Open Page
    return (await browser.newPage ());
  }

  async screenshotPage (page: Page) {
    await page.screenshot ({ path: 'example.png' });
  }

  async parsePage (page: Page) {
    const bodyHandle = await page.$('body');
    const html = await page.evaluate((body: any) => body.innerHTML, bodyHandle);
    console.log (html);
  }

  async navigateToPage (page: Page, url: string): Promise<HTTPResponse> {
    const response: HTTPResponse = await page.goto (url, { timeout: 300000});
    return (response);
  }

  async interceptHttpRequests (page: Page) {
    await page.setRequestInterception(true);
    page.on('request', request => 
      {   
        if (request.resourceType() === 'xhr') {
          console.log (request);  
        }    
        request.continue(); 
      }
      );
  }

  async close (browser: Browser) {
    await browser.close();
  }
}

new BuyScraper().init ();