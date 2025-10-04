# 🚀 Quick Start Guide

Get your Prayer Reminder Bot running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment File

```bash
cp .env.example .env
```

Then edit `.env` and set your chat ID:

```env
TARGET_CHAT_ID=201234567890@c.us
TIMEZONE=Africa/Cairo
TEST_MODE=false
```

### How to Get Your Chat ID:

**For sending to yourself:**
```
YOUR_PHONE_NUMBER@c.us
Example: 201234567890@c.us
```
(Use your phone number with country code, no + sign)

**For sending to a group:**
1. Set `TEST_MODE=true` 
2. Run the bot
3. Send any message in the target group
4. Check console - it will show the group ID
5. Copy the group ID to `.env`
6. Set `TEST_MODE=false`

## Step 3: Build the Project

```bash
npm run build
```

## Step 4: Start the Bot

```bash
npm start
```

## Step 5: Scan QR Code

1. A QR code will appear in your terminal
2. Open WhatsApp on your phone
3. Go to: **Settings → Linked Devices → Link a Device**
4. Scan the QR code with your phone
5. ✅ Done! Bot is now running!

## Testing the Bot

Want to test immediately without waiting for 9 AM?

**Option 1: Use Test Mode**
1. Set `TEST_MODE=true` in `.env`
2. Restart the bot
3. It will send a poll immediately

**Option 2: Use Manual Command**
1. Send `!prayer` or `!صلاة` to the bot
2. It will send the poll on demand

## Next Steps

- **Customize Schedule**: Edit the cron pattern in `src/index.ts` (line ~125)
- **Change Poll Options**: Modify the `pollOptions` array in `src/index.ts` (line ~150)
- **Use in Other Projects**: Copy `src/WhatsAppBot.ts` to any project!

## Need Help?

- Read the full README.md for detailed documentation
- Check the troubleshooting section in README.md
- Review the code comments - everything is well documented!

---

**May Allah accept our prayers** 🤲

