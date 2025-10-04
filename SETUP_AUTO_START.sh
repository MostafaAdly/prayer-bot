#!/bin/bash

###############################################################################
# Prayer Bot - One-Time Auto-Start Setup Script
#
# This script will set up your Prayer Reminder Bot to automatically start
# when your system reboots. Run this ONCE after the first successful setup.
#
# Usage: bash SETUP_AUTO_START.sh
###############################################################################

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "   🕌 Prayer Bot - Auto-Start Setup 🕌"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js v18+ first: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Please create .env file first:"
    echo "  cp .env.example .env"
    echo "  # Edit .env and set TARGET_CHAT_ID"
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi
echo ""

# Build the project
echo "🔨 Building project..."
if command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi
echo ""

# Check if PM2 is available
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found globally. Using local PM2..."
    PM2_CMD="npx pm2"
else
    PM2_CMD="pm2"
fi

# Start with PM2
echo "🚀 Starting bot with PM2..."
if command -v yarn &> /dev/null; then
    yarn pm2:start
else
    npm run pm2:start
fi
echo ""

# Wait for user to scan QR code
echo "═══════════════════════════════════════════════════════════════════"
echo "⚠️  IMPORTANT: If this is your first time running the bot:"
echo ""
echo "1. A QR code should appear above"
echo "2. Open WhatsApp on your phone"
echo "3. Go to: Settings → Linked Devices → Link a Device"
echo "4. Scan the QR code"
echo ""
read -p "Press ENTER after you've scanned the QR code (or if already authenticated)..."
echo ""

# Set up PM2 startup
echo "⚙️  Setting up PM2 auto-start on system reboot..."
echo ""
echo "PM2 will now generate a startup command for your system."
echo "You MUST run the command that PM2 shows you (it requires sudo)."
echo ""
read -p "Press ENTER to continue..."
echo ""

$PM2_CMD startup

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "⚠️  DID YOU SEE A COMMAND ABOVE? ⚠️"
echo ""
echo "PM2 should have shown a command starting with 'sudo env PATH=...'"
echo ""
echo "YOU MUST COPY AND RUN THAT COMMAND NOW!"
echo ""
echo "It will look something like:"
echo "  sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u adly --hp /home/adly"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Have you run the sudo command? Press ENTER when done..."
echo ""

# Save PM2 process list
echo "💾 Saving PM2 process list..."
$PM2_CMD save
echo ""

# Show status
echo "📊 Current PM2 status:"
$PM2_CMD list
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Your Prayer Reminder Bot is now configured to auto-start on reboot!"
echo ""
echo "📝 Useful Commands:"
echo "  yarn pm2:status    - View bot status"
echo "  yarn pm2:logs      - View live logs"
echo "  yarn pm2:restart   - Restart bot"
echo "  yarn pm2:stop      - Stop bot"
echo "  yarn pm2:monit     - Monitor in real-time"
echo ""
echo "📚 For more info, see: PM2_SETUP.md"
echo ""
echo "🧪 Testing Auto-Start:"
echo "  sudo reboot        - Reboot your system"
echo "  pm2 list           - After reboot, check if bot is running"
echo ""
echo "May Allah accept our prayers! 🤲"
echo ""

