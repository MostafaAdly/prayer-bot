# 🔄 PM2 Setup Guide - Auto-Start on System Restart

This guide will help you set up PM2 to automatically start your Prayer Reminder Bot when your system restarts.

## What is PM2?

PM2 is a production process manager for Node.js applications. It:
- ✅ Keeps your app running forever
- ✅ Restarts your app if it crashes
- ✅ Auto-starts your app on system reboot
- ✅ Provides monitoring and logging
- ✅ Zero-downtime reloads

---

## 📋 One-Time Setup (First Time Only)

Run these commands **once** to set up auto-start:

### Step 1: Install Dependencies

```bash
yarn install
# or
npm install
```

### Step 2: Create .env File

If you haven't already:

```bash
cp .env.example .env
# Edit .env and set your TARGET_CHAT_ID
```

### Step 3: Start the Bot with PM2 (First Time)

```bash
yarn pm2:start
```

This will:
1. Build your TypeScript code
2. Start the bot with PM2
3. Show you the QR code to scan (first time only)

> **Important:** Scan the QR code with WhatsApp now! Once authenticated, the session is saved.

### Step 4: Set Up Auto-Start on System Reboot

```bash
# This generates the startup script for your system
pm2 startup

# PM2 will show you a command to run with sudo - COPY AND RUN IT
# It will look something like this (example for systemd on Linux):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u adly --hp /home/adly
```

**Execute the command that PM2 shows you!** (It needs sudo privileges)

### Step 5: Save PM2 Process List

```bash
pm2 save
```

This saves the current running processes, so PM2 knows what to start on reboot.

### Step 6: Test It! 🧪

To verify auto-start is working:

```bash
# Check PM2 status
yarn pm2:status

# Optionally, reboot your system to test
sudo reboot
# After reboot, check if bot is running:
pm2 list
```

---

## 🎮 Daily Usage Commands

Once set up, you only need these commands:

### View Bot Status
```bash
yarn pm2:status
# or
pm2 list
```

### View Live Logs
```bash
yarn pm2:logs
# Press Ctrl+C to exit logs view
```

### Restart Bot (after code changes)
```bash
yarn pm2:restart
```

### Stop Bot (temporarily)
```bash
yarn pm2:stop
```

### Start Bot Again
```bash
yarn pm2:start
```

### Monitor Bot (Real-time dashboard)
```bash
yarn pm2:monit
```

### Delete Bot from PM2
```bash
yarn pm2:delete
```

---

## 📊 PM2 Dashboard & Monitoring

### View Process List
```bash
pm2 list
```

### View Detailed Info
```bash
pm2 show prayer-bot
```

### View Logs
```bash
# All logs
pm2 logs prayer-bot

# Last 100 lines
pm2 logs prayer-bot --lines 100

# Error logs only
pm2 logs prayer-bot --err

# Clear logs
pm2 flush
```

### Monitor CPU & Memory
```bash
pm2 monit
```

---

## 🔄 Updating Your Bot

When you make code changes:

```bash
# 1. Stop the bot
yarn pm2:stop

# 2. Make your code changes
# ... edit files ...

# 3. Build and restart
yarn build
yarn pm2:restart

# Or do it all at once:
yarn pm2:restart
```

The `pm2:restart` script automatically rebuilds before restarting.

---

## 🗂️ Log Files

PM2 stores logs in the `logs/` directory:

- `logs/pm2-out.log` - Standard output (console.log)
- `logs/pm2-error.log` - Error output (console.error)

View logs:
```bash
# View output logs
tail -f logs/pm2-out.log

# View error logs
tail -f logs/pm2-error.log
```

---

## 🛠️ Troubleshooting

### Bot Not Starting After Reboot?

```bash
# Check PM2 status
pm2 list

# Check if PM2 startup is configured
pm2 startup

# If not configured, run the command PM2 shows
# Then save again:
pm2 save
```

### Bot Crashing or Restarting?

```bash
# Check error logs
yarn pm2:logs

# Check detailed status
pm2 show prayer-bot

# View recent crashes
pm2 list
```

### Remove Auto-Start (if needed)

```bash
# Remove PM2 from system startup
pm2 unstartup

# Follow the command PM2 shows (with sudo)
```

### Reset Everything

```bash
# Stop and delete all PM2 processes
pm2 delete all

# Clear startup configuration
pm2 unstartup

# Remove saved process list
pm2 save --force

# Start fresh with Step 3 above
```

---

## 🚀 Advanced Configuration

### Change Memory Limit

Edit `ecosystem.config.js`:

```javascript
max_memory_restart: '500M',  // Restart if memory exceeds 500MB
```

### Auto-Restart Daily

Edit `ecosystem.config.js`:

```javascript
cron_restart: '0 4 * * *',  // Restart every day at 4 AM
```

### Watch for File Changes (Development)

Edit `ecosystem.config.js`:

```javascript
watch: true,  // Auto-reload on file changes
```

---

## 📝 Quick Reference

```bash
# Start bot with PM2
yarn pm2:start

# Stop bot
yarn pm2:stop

# Restart bot
yarn pm2:restart

# View logs
yarn pm2:logs

# View status
yarn pm2:status

# Monitor in real-time
yarn pm2:monit

# Delete from PM2
yarn pm2:delete
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Bot is running: `pm2 list` shows "online"
- [ ] Startup is configured: `pm2 startup` shows current configuration
- [ ] Processes are saved: `pm2 save` shows success
- [ ] Logs are working: `yarn pm2:logs` shows output
- [ ] Auto-start works: Reboot and check `pm2 list`

---

## 🎯 Summary

**First Time Setup (Run Once):**
```bash
# 1. Install & configure
yarn install
cp .env.example .env
# Edit .env file

# 2. Start with PM2
yarn pm2:start
# Scan QR code

# 3. Enable auto-start
pm2 startup
# Run the sudo command PM2 shows
pm2 save
```

**After Reboot:**
- Bot automatically starts ✅
- No manual intervention needed ✅

**Daily Usage:**
```bash
yarn pm2:logs      # View logs
yarn pm2:status    # Check status
yarn pm2:restart   # Restart after changes
```

---

That's it! Your bot will now start automatically every time your system restarts. 🎉

**May Allah accept our prayers** 🤲

