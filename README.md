# 🕌 Prayer Reminder Bot

A WhatsApp bot that sends daily prayer polls to remind Muslims about their 5 daily prayers and other Islamic practices. Built with TypeScript and [whatsapp-web.js](https://wwebjs.dev/).

## ✨ Features

- 📅 **Daily Automated Polls**: Sends prayer tracking polls every day at 9:00 AM
- 🕌 **Comprehensive Prayer Tracking**: Covers all 5 daily prayers, morning/evening remembrance, missed prayers, and night prayers
- 🔄 **Reusable Bot Class**: Includes a professional, well-documented `WhatsAppBot` class for other projects
- 🌍 **Timezone Support**: Configure your local timezone for accurate scheduling
- 💬 **Command Support**: Manual commands like `!prayer` and `!help`
- 🔒 **Session Persistence**: Remembers authentication between restarts

## 📋 Prayer Poll Contents

The daily poll includes:

- 💕🌅 **الفجر / الصبح** (Fajr/Dawn Prayer)
- ☀️ **أذكار الصباح** (Morning Remembrance)
- 🦋 **الظهر** (Dhuhr/Noon Prayer)
- 🏞️🖼️ **العصر** (Asr/Afternoon Prayer)
- 🦋🌆 **المغرب** (Maghrib/Evening Prayer)
- 🧕🏽 **أذكار المساء** (Evening Remembrance)
- 🔵 **العشاء** (Isha/Night Prayer)
- 🌱 **صلاوات فائتة** (Missed Prayers)
- ⭐ **قيام الليل** (Night Prayer/Qiyam al-Layl)

## 📦 Requirements

- **Node.js** v18 or higher
- A WhatsApp account
- A mobile phone to scan QR code for authentication

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
cd prayer-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
# Set your target chat ID
TARGET_CHAT_ID=1234567890@c.us

# Set your timezone (optional, defaults to Africa/Cairo)
TIMEZONE=Africa/Cairo

# Enable test mode to send poll immediately (optional)
TEST_MODE=false
```

#### 📱 How to Get Chat IDs

**For Individual Chats:**
- Format: `phoneNumber@c.us`
- Example: `201234567890@c.us` (for +20 123 456 7890)
- Include country code without the '+' sign

**For Group Chats:**
- Format: `groupId@g.us`
- To find group ID:
  1. Set `TEST_MODE=true` in `.env`
  2. Run the bot
  3. After bot is ready, check the console output
  4. Send any message in the target group
  5. The bot will log the group ID in console

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Bot

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 6. Authenticate with WhatsApp

On first run:
1. A QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings > Linked Devices > Link a Device**
4. Scan the QR code
5. ✅ Bot is now authenticated and will run!

## 🛠️ Available Commands

### Bot Commands (Send in WhatsApp)

- `!prayer` or `!صلاة` - Manually trigger the prayer poll
- `!help` or `!مساعدة` - Show help message

### NPM Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled bot
- `npm run dev` - Run in development mode with ts-node
- `npm run watch` - Watch for changes and recompile

## ⚙️ Configuration

### Changing the Schedule Time

The bot is configured to send polls at 9:00 AM by default. To change this:

1. Open `src/index.ts`
2. Find the `scheduleDailyPoll()` method
3. Modify the cron pattern:

```typescript
// Current: '0 9 * * *' (9:00 AM daily)
// Examples:
this.scheduledTask = cron.schedule('0 9 * * *', async () => {
  // Your code
});

// 8:00 AM: '0 8 * * *'
// 6:00 PM: '0 18 * * *'
// 7:30 AM: '30 7 * * *'
// Every 6 hours: '0 */6 * * *'
```

**Cron Pattern Format:** `minute hour day month dayOfWeek`

### Customizing Poll Options

To modify the prayer options:

1. Open `src/index.ts`
2. Find the `sendDailyPrayerPoll()` method
3. Edit the `pollOptions` array:

```typescript
const pollOptions = [
  '💕🌅 الفجر / الصبح',
  // Add, remove, or modify options here
];
```

## 📚 Reusing the WhatsAppBot Class

The `WhatsAppBot` class in `src/WhatsAppBot.ts` is designed to be reusable in other projects. Simply copy the file to your project!

### Example Usage

```typescript
import { WhatsAppBot } from './WhatsAppBot';

// Create a bot instance
const bot = new WhatsAppBot({
  sessionName: 'my-bot',
  verbose: true
});

// Set up event handlers
bot.on('onReady', async () => {
  console.log('Bot is ready!');
  
  // Send a message
  await bot.sendMessage({
    chatId: '1234567890@c.us',
    content: 'Hello from my bot!'
  });
  
  // Send a poll
  await bot.sendPoll({
    chatId: '1234567890@c.us',
    question: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green'],
    allowMultipleAnswers: false
  });
});

bot.on('onMessage', async (message) => {
  if (message.body === '!ping') {
    await message.reply('pong');
  }
});

// Initialize the bot
await bot.initialize();
```

### WhatsAppBot API

#### Configuration Options

```typescript
interface BotConfig {
  sessionName?: string;      // Session name for auth storage
  chromiumPath?: string;     // Custom Chrome/Chromium path
  headless?: boolean;        // Run browser in headless mode
  userAgent?: string;        // Custom user agent
  timeout?: number;          // Puppeteer timeout
  verbose?: boolean;         // Enable detailed logging
}
```

#### Methods

- `initialize()` - Start the bot
- `sendMessage(options)` - Send a text message
- `sendPoll(options)` - Send a poll
- `getChat(chatId)` - Get chat information
- `getAllChats()` - Get all chats
- `getBotInfo()` - Get bot information
- `destroy()` - Stop the bot
- `getClient()` - Get underlying client for advanced operations
- `isReady()` - Check if bot is ready

#### Event Handlers

- `onQR` - QR code received
- `onAuthenticated` - Successfully authenticated
- `onAuthenticationFailure` - Authentication failed
- `onReady` - Bot is ready to use
- `onMessage` - Message received
- `onDisconnected` - Bot disconnected

## 🔧 Troubleshooting

### QR Code Not Appearing

- Make sure your terminal supports QR code rendering
- Try running in a different terminal
- Check that `verbose: true` is set in bot config

### Authentication Issues

```bash
# Delete authentication data and try again
rm -rf .wwebjs_auth/
npm start
```

### Bot Not Sending Messages

1. Verify `TARGET_CHAT_ID` is correct in `.env`
2. Make sure the chat exists and bot has access
3. Check that you're not blocked by the recipient
4. Enable `verbose: true` to see detailed error logs

### Timezone Issues

- Verify timezone name is valid: [IANA timezone list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
- Common timezones:
  - Egypt: `Africa/Cairo`
  - Saudi Arabia: `Asia/Riyadh`
  - UAE: `Asia/Dubai`
  - USA Eastern: `America/New_York`

### Module Not Found Errors

```bash
# Rebuild the project
npm run build
# Or install missing dependencies
npm install
```

## 📁 Project Structure

```
prayer-bot/
├── src/
│   ├── WhatsAppBot.ts      # Reusable WhatsApp bot class
│   └── index.ts            # Prayer reminder bot application
├── dist/                   # Compiled JavaScript (generated)
├── .wwebjs_auth/          # WhatsApp session data (generated)
├── .env                    # Environment configuration (create this)
├── .env.example           # Environment configuration template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your `.wwebjs_auth/` folder private
- Don't share your session data
- Be careful with chat IDs in public repositories

## ⚠️ Disclaimer

This project uses [whatsapp-web.js](https://wwebjs.dev/), which is not officially affiliated with WhatsApp. Use at your own risk.

**Important:**
- WhatsApp does not officially support bots
- Your account could potentially be banned
- This is meant for personal use only
- Do not use for spam or mass messaging

## 📝 License

MIT License - Feel free to use this in your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for the Muslim community

---

**May Allah accept our prayers and good deeds** 🤲

اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ

