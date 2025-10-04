# 📝 Quick Command Reference

## 🚀 First Time Setup

```bash
# 1. Install dependencies
yarn install

# 2. Create environment file
cp .env.example .env
# Edit .env and set TARGET_CHAT_ID

# 3. Build project
yarn build

# 4. Start bot
yarn start
# OR with PM2 for auto-restart:
bash SETUP_AUTO_START.sh
```

---

## 🎮 Daily Usage (Basic)

```bash
# Start bot
yarn start

# Start in development mode (auto-reload)
yarn dev

# Build TypeScript
yarn build

# Watch for changes
yarn watch
```

---

## 🔄 Daily Usage (PM2 - Auto-Restart)

```bash
# View status
yarn pm2:status

# View logs (live)
yarn pm2:logs

# Restart bot
yarn pm2:restart

# Stop bot
yarn pm2:stop

# Start bot
yarn pm2:start

# Monitor (real-time dashboard)
yarn pm2:monit

# Delete from PM2
yarn pm2:delete
```

---

## 💬 WhatsApp Bot Commands

Send these messages to the bot in WhatsApp:

```
!prayer     - Send prayer poll immediately
!صلاة       - Send prayer poll immediately (Arabic)
!help       - Show help message
!مساعدة     - Show help message (Arabic)
```

---

## 🛠️ Troubleshooting Commands

```bash
# Check PM2 status
pm2 list

# View detailed PM2 info
pm2 show prayer-bot

# View error logs
tail -f logs/pm2-error.log

# View output logs
tail -f logs/pm2-out.log

# Restart PM2 daemon
pm2 kill
pm2 resurrect

# Clear PM2 logs
pm2 flush

# Delete authentication and start fresh
rm -rf .wwebjs_auth/
yarn pm2:restart
```

---

## 🔧 PM2 Management Commands

```bash
# List all processes
pm2 list

# Show process details
pm2 show prayer-bot

# Monitor all processes
pm2 monit

# View logs
pm2 logs prayer-bot

# View last 100 log lines
pm2 logs prayer-bot --lines 100

# Clear all logs
pm2 flush

# Restart process
pm2 restart prayer-bot

# Stop process
pm2 stop prayer-bot

# Delete process
pm2 delete prayer-bot

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Set up auto-start on boot
pm2 startup

# Remove auto-start
pm2 unstartup
```

---

## 📊 Useful PM2 Commands

```bash
# View real-time stats
pm2 monit

# View process info
pm2 info prayer-bot

# View environment variables
pm2 env 0

# Update PM2
npm install pm2@latest -g

# View PM2 version
pm2 --version
```

---

## 🔄 After Code Changes

```bash
# Rebuild and restart
yarn build && yarn pm2:restart

# Or just
yarn pm2:restart  # (This script auto-builds)
```

---

## 🧪 Testing

```bash
# Enable test mode (sends poll immediately)
# Edit .env: TEST_MODE=true
yarn pm2:restart

# Check if bot is working
yarn pm2:logs

# Send manual poll via WhatsApp
# Message the bot: !prayer
```

---

## 📁 Project Structure

```
prayer-bot/
├── src/
│   ├── WhatsAppBot.ts      # Reusable bot class
│   └── index.ts            # Main application
├── dist/                   # Compiled JavaScript
├── logs/                   # PM2 logs
├── .wwebjs_auth/          # WhatsApp session
├── ecosystem.config.js    # PM2 configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── .env                   # Environment variables
```

---

## 🆘 Emergency Commands

```bash
# Bot not responding - force restart
pm2 restart prayer-bot --force

# Delete everything and start fresh
pm2 delete prayer-bot
rm -rf .wwebjs_auth/ dist/ logs/
yarn build
yarn pm2:start

# System reboot
sudo reboot
# After reboot, check:
pm2 list
```

---

## ✅ Health Check

```bash
# Quick health check
pm2 list | grep prayer-bot  # Should show "online"
pm2 logs prayer-bot --lines 20  # Check recent logs
tail -f logs/pm2-error.log  # Check for errors
```

---

## 📖 Documentation Files

- `README.md` - Main documentation
- `PM2_SETUP.md` - Detailed PM2 setup guide
- `QUICK_START.md` - Quick start guide
- `COMMANDS.md` - This file
- `SETUP_AUTO_START.sh` - Auto-setup script

---

## 🔗 Useful Links

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [whatsapp-web.js Docs](https://docs.wwebjs.dev/)
- [Node-Cron Documentation](https://www.npmjs.com/package/node-cron)

---

**Quick PM2 Cheat Sheet:**

| Command | Description |
|---------|-------------|
| `yarn pm2:start` | Start bot |
| `yarn pm2:stop` | Stop bot |
| `yarn pm2:restart` | Restart bot |
| `yarn pm2:logs` | View logs |
| `yarn pm2:status` | Check status |
| `yarn pm2:monit` | Monitor dashboard |
| `pm2 save` | Save process list |
| `pm2 startup` | Setup auto-start |

---

**May Allah accept our prayers** 🤲

