# AI Model Pricing Comparison

A beautiful, automatically-updated pricing comparison tool for AI models across OpenAI, Anthropic Claude, Google Gemini, and xAI Grok.

## Features

- **Daily Automatic Updates**: GitHub Actions runs daily to keep pricing current
- **Beautiful UI**: Clean, modern, responsive design
- **Smart Filtering**: Filter by provider, search models, sort by price
- **Free Hosting**: Hosted on GitHub Pages at no cost
- **Zero Maintenance**: Once set up, runs completely automatically

## Live Demo

Your site will be live at: `https://YOUR-USERNAME.github.io/ai-pricing-tracker/`

---

## Setup Instructions (Step-by-Step)

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Name it: `ai-pricing-tracker`
5. Make it **Public**
6. **DO NOT** check "Add a README file"
7. Click **Create repository**

### Step 2: Upload Your Files

You have the project files in this folder: `ai-pricing-tracker/`

**Option A: Using GitHub Web Interface (Easiest)**

1. On your new repository page, click **uploading an existing file**
2. Drag all files from the `ai-pricing-tracker` folder into the upload area:
   - `index.html`
   - `style.css`
   - `app.js`
   - `pricing.json`
   - `package.json`
   - `scraper.js`
   - `.github/workflows/update-pricing.yml` (you may need to create the folder structure first)
3. Scroll down and click **Commit changes**

**Option B: Using Git Command Line**

If you're comfortable with terminal:

```bash
cd ai-pricing-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-pricing-tracker.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **Settings** (top menu)
2. Scroll down to **Pages** in the left sidebar
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes, then refresh the page
6. You'll see: "Your site is live at https://YOUR-USERNAME.github.io/ai-pricing-tracker/"

### Step 4: Enable GitHub Actions

1. In your repository, click **Actions** (top menu)
2. Click **I understand my workflows, go ahead and enable them**
3. Your daily update automation is now active!

### Step 5: Test It Out

1. Visit your live site: `https://YOUR-USERNAME.github.io/ai-pricing-tracker/`
2. You should see a beautiful pricing comparison!
3. Try the filters and search functionality

---

## How It Works

### Automatic Updates

- **GitHub Actions** runs every day at 9 AM UTC
- The scraper tries to fetch latest pricing from provider websites
- If changes are detected, the data is automatically committed
- Your website updates within minutes

### Manual Updates

If you need to update pricing manually:

1. Go to your repository on GitHub
2. Click on `pricing.json`
3. Click the pencil icon (Edit)
4. Update the pricing values
5. Scroll down and click **Commit changes**
6. Your site updates automatically!

### Data Structure

The `pricing.json` file contains all pricing data:

```json
{
  "providers": {
    "openai": {
      "name": "OpenAI",
      "models": [
        {
          "name": "GPT-4o",
          "inputPrice": 2.50,
          "outputPrice": 10.00,
          "unit": "per 1M tokens"
        }
      ]
    }
  }
}
```

---

## Customization

### Change Colors

Edit `style.css` and modify these variables:

```css
:root {
    --openai-color: #10a37f;
    --anthropic-color: #d97706;
    --google-color: #4285f4;
    --xai-color: #000000;
}
```

### Change Update Schedule

Edit `.github/workflows/update-pricing.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # Change this (uses UTC time)
```

Cron examples:
- `0 */6 * * *` = Every 6 hours
- `0 0 * * *` = Daily at midnight
- `0 9 * * 1` = Every Monday at 9 AM

### Add More Models

Edit `pricing.json` and add to the appropriate provider's models array.

---

## Troubleshooting

### Site not showing up?

1. Wait 2-3 minutes after enabling GitHub Pages
2. Check Settings → Pages shows "Your site is published"
3. Try accessing in private/incognito browser window

### GitHub Actions not running?

1. Go to **Actions** tab
2. Click on the workflow
3. Click **Run workflow** to trigger manually
4. Check for error messages

### Pricing data outdated?

1. Manually edit `pricing.json` on GitHub
2. Or trigger the workflow manually in the Actions tab

### Need help?

- Check GitHub Pages documentation: https://pages.github.com/
- GitHub Actions documentation: https://docs.github.com/en/actions

---

## Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **Automation**: GitHub Actions + Puppeteer
- **Hosting**: GitHub Pages (free)
- **Data**: JSON file in repository

---

## License

MIT License - Feel free to use and modify!

---

## Credits

Built with Claude Code
