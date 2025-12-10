const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeOpenAI(page) {
  console.log('Scraping OpenAI pricing...');
  try {
    await page.goto('https://openai.com/api/pricing/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for pricing content to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Extract pricing data from the page
    const models = await page.evaluate(() => {
      const modelData = [];

      // This selector may need adjustment based on OpenAI's current page structure
      // Common patterns: looking for pricing tables, model cards, or structured data
      const pricingElements = document.querySelectorAll('[class*="pricing"], [class*="model"], table');

      // Extract text content to parse pricing
      const pageText = document.body.innerText;

      // GPT-4 models pattern matching
      const gpt4Matches = pageText.matchAll(/GPT-4[^\n]*(?:.*?\n)*?.*?\$[\d.]+.*?(?:input|Input).*?\$[\d.]+.*?(?:output|Output)/gi);
      const gpt35Matches = pageText.matchAll(/GPT-3\.5[^\n]*(?:.*?\n)*?.*?\$[\d.]+.*?(?:input|Input).*?\$[\d.]+.*?(?:output|Output)/gi);

      return {
        rawText: pageText.substring(0, 5000), // First 5000 chars for debugging
        timestamp: new Date().toISOString()
      };
    });

    console.log('OpenAI data extracted (will need manual parsing)');
    return models;

  } catch (error) {
    console.error('Error scraping OpenAI:', error.message);
    return { error: error.message };
  }
}

async function scrapeAnthropic(page) {
  console.log('Scraping Anthropic Claude pricing...');
  try {
    await page.goto('https://www.anthropic.com/pricing', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('body', { timeout: 10000 });

    const models = await page.evaluate(() => {
      const pageText = document.body.innerText;
      return {
        rawText: pageText.substring(0, 5000),
        timestamp: new Date().toISOString()
      };
    });

    console.log('Anthropic data extracted');
    return models;

  } catch (error) {
    console.error('Error scraping Anthropic:', error.message);
    return { error: error.message };
  }
}

async function scrapeGemini(page) {
  console.log('Scraping Google Gemini pricing...');
  try {
    await page.goto('https://ai.google.dev/pricing', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('body', { timeout: 10000 });

    const models = await page.evaluate(() => {
      const pageText = document.body.innerText;
      return {
        rawText: pageText.substring(0, 5000),
        timestamp: new Date().toISOString()
      };
    });

    console.log('Gemini data extracted');
    return models;

  } catch (error) {
    console.error('Error scraping Gemini:', error.message);
    return { error: error.message };
  }
}

async function scrapeGrok(page) {
  console.log('Scraping xAI Grok pricing...');
  try {
    await page.goto('https://docs.x.ai/docs#pricing', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('body', { timeout: 10000 });

    const models = await page.evaluate(() => {
      const pageText = document.body.innerText;
      return {
        rawText: pageText.substring(0, 5000),
        timestamp: new Date().toISOString()
      };
    });

    console.log('Grok data extracted');
    return models;

  } catch (error) {
    console.error('Error scraping Grok:', error.message);
    return { error: error.message };
  }
}

async function main() {
  console.log('Starting AI pricing scraper...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Scrape all providers
  const [openai, anthropic, gemini, grok] = await Promise.all([
    scrapeOpenAI(page),
    scrapeAnthropic(page),
    scrapeGemini(page),
    scrapeGrok(page)
  ]);

  await browser.close();

  // Combine results
  const results = {
    lastUpdated: new Date().toISOString(),
    openai,
    anthropic,
    gemini,
    grok
  };

  // Save raw results for debugging
  await fs.writeFile('raw-pricing-data.json', JSON.stringify(results, null, 2));
  console.log('Raw data saved to raw-pricing-data.json');

  console.log('Scraping complete!');
}

main().catch(console.error);
