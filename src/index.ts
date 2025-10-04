import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { WhatsAppBot } from './WhatsAppBot';
import { Message } from 'whatsapp-web.js';
import POLL_OPTIONS from '../poll-options.json';

// Load environment variables from .env file
dotenv.config();

/**
 * Prayer Reminder Bot Configuration
 * 
 * This bot sends daily prayer polls to remind Muslims about their 5 daily prayers
 * and other Islamic practices. The poll is sent every day at 9:00 AM.
 */
class PrayerReminderBot {
  private bot: WhatsAppBot;
  private targetChatId: string;
  private scheduledTask: cron.ScheduledTask | null = null;

  /**
   * Initializes the Prayer Reminder Bot
   * 
   * @param targetChatId - The WhatsApp chat ID where polls should be sent
   *                       Format: phone@c.us for individuals or groupId@g.us for groups
   */
  constructor(targetChatId: string) {
    this.targetChatId = targetChatId;

    // Initialize the WhatsApp bot with configuration
    this.bot = new WhatsAppBot({
      sessionName: 'prayer-bot',
      headless: true,
      verbose: true,
    });

    this.setupBotEventHandlers();
  }

  /**
   * Sets up event handlers for the WhatsApp bot
   * @private
   */
  private setupBotEventHandlers(): void {
    // Handle QR code for authentication
    this.bot.on('onQR', (_qr) => {
      console.log('\n📱 Scan this QR code with your WhatsApp to authenticate:\n');
      // QR code is automatically displayed in terminal by the bot
    });

    // Handle successful authentication
    this.bot.on('onAuthenticated', () => {
      console.log('✅ Successfully authenticated with WhatsApp!');
    });

    // Handle authentication failure
    this.bot.on('onAuthenticationFailure', (error) => {
      console.error('❌ Authentication failed:', error);
      console.log('💡 Try deleting the .wwebjs_auth folder and scan QR again');
    });

    // Handle when bot is ready
    this.bot.on('onReady', async () => {
      console.log('🤖 Prayer Reminder Bot is now active!\n');
      
      try {
        const botInfo = await this.bot.getBotInfo();
        console.log(`📞 Bot Number: +${botInfo.wid.user}`);
        console.log(`👤 Bot Name: ${botInfo.pushname}\n`);
      } catch (error) {
        console.error('Failed to get bot info:', error);
      }

      // Schedule the daily prayer reminder
      this.scheduleDailyPoll();
      
      console.log('⏰ Daily prayer poll scheduled for 9:00 AM every day');
      console.log(`📨 Polls will be sent to: ${this.targetChatId}\n`);
      
      // Optional: Send a test poll immediately if TEST_MODE is enabled
      if (process.env.TEST_MODE === 'true') {
        console.log('🧪 TEST MODE: Sending test poll immediately...\n');
        await this.sendDailyPrayerPoll();
      }
    });

    // Handle incoming messages (optional - for bot commands)
    this.bot.on('onMessage', async (message: Message) => {
      // Ignore messages from status broadcasts
      if (message.from === 'status@broadcast' || message.from.endsWith('@newsletter')) {
        return;
      }

      // Simple command handler
      if (message.body.toLowerCase() === '!prayer' || message.body.toLowerCase() === '!صلاة') {
        await this.sendDailyPrayerPoll();
        await message.reply('✅ تم إرسال استطلاع الصلاة! (Prayer poll sent!)');
      } else if (message.body.toLowerCase() === '!help' || message.body.toLowerCase() === '!مساعدة') {
        await message.reply(
          '🤖 *Prayer Reminder Bot Commands*\n\n' +
          '!prayer or !صلاة - Send prayer poll immediately\n' +
          '!help or !مساعدة - Show this help message\n\n' +
          'The bot automatically sends prayer polls every day at 9:00 AM 🕘'
        );
      }
    });

    // Handle disconnection
    this.bot.on('onDisconnected', (reason) => {
      console.log('⚠️ Bot disconnected:', reason);
      console.log('🔄 Attempting to reconnect...');
      
      // Stop scheduled tasks
      if (this.scheduledTask) {
        this.scheduledTask.stop();
      }
    });
  }

  /**
   * Schedules the daily prayer poll to be sent at some time every day
   * Uses cron to schedule the task
   * @private
   */
  private scheduleDailyPoll(): void {
    this.scheduledTask = cron.schedule(process.env.CRON_PATTERN || '0 9 * * *', async () => {
      console.log(`\n⏰ [${new Date().toLocaleString('ar-EG')}] Time to send daily prayer poll!`);
      await this.sendDailyPrayerPoll();
    }, {
      scheduled: true,
      timezone: process.env.TIMEZONE || 'Africa/Cairo', // Default to Egypt timezone
    });

    console.log('✅ Cron job scheduled successfully');
  }

  /**
   * Sends the daily prayer poll to the configured chat
   * 
   * The poll includes:
   * - Fajr (Dawn) prayer
   * - Morning remembrance (Athkar)
   * - Dhuhr (Noon) prayer
   * - Asr (Afternoon) prayer
   * - Maghrib (Evening) prayer
   * - Evening remembrance (Athkar)
   * - Isha (Night) prayer
   * - Missed prayers
   * - Night prayer (Qiyam al-Layl)
   * 
   * @private
   */
  private async sendDailyPrayerPoll(): Promise<void> {
    try {
      // Get current date in Arabic format
      const currentDate = new Date();
      // const arabicDate = currentDate.toLocaleDateString('ar-EG', {
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric',
      // });

      // Alternative: Simple numeric date
      const simpleDate = `${currentDate.getDate()} ${this.getArabicMonth(currentDate.getMonth())}`;

      // Prayer poll question with date
      const pollQuestion = `❤️ ${simpleDate}`;

      // Poll options - The prayers and religious practices to track
      const pollOptions = POLL_OPTIONS;

      // Send the poll
      await this.bot.sendPoll({
        chatId: this.targetChatId,
        question: pollQuestion,
        options: pollOptions,
        allowMultipleAnswers: true, // Allow users to select multiple prayers they've completed
      });

      console.log(`✅ Daily prayer poll sent successfully at ${currentDate.toLocaleString('ar-EG')}`);
    } catch (error) {
      console.error('❌ Failed to send daily prayer poll:', error);
      
      // Log additional details for debugging
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  /**
   * Converts month number to Arabic month name
   * @private
   * @param monthIndex - Month index (0-11)
   * @returns Arabic month name
   */
  private getArabicMonth(monthIndex: number): string {
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return arabicMonths[monthIndex];
  }

  /**
   * Starts the Prayer Reminder Bot
   * Initializes the WhatsApp connection and begins listening for events
   */
  public async start(): Promise<void> {
    console.log('🚀 Starting Prayer Reminder Bot...\n');
    console.log('⏳ Initializing WhatsApp connection...');
    console.log('📱 Please have your phone ready to scan QR code if this is first time\n');
    
    try {
      await this.bot.initialize();
    } catch (error) {
      console.error('❌ Failed to initialize bot:', error);
      process.exit(1);
    }
  }

  /**
   * Stops the Prayer Reminder Bot and cleans up resources
   */
  public async stop(): Promise<void> {
    console.log('\n🛑 Stopping Prayer Reminder Bot...');
    
    // Stop scheduled tasks
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      console.log('⏰ Stopped scheduled tasks');
    }
    
    // Destroy the bot client
    await this.bot.destroy();
    console.log('✅ Bot stopped successfully');
  }
}

// ============================================================================
// Main Application Entry Point
// ============================================================================

/**
 * Main function to run the Prayer Reminder Bot
 */
async function main() {
  // Validate environment variables
  const targetChatId = process.env.TARGET_CHAT_ID;

  if (!targetChatId) {
    console.error('❌ ERROR: TARGET_CHAT_ID is not set in .env file!');
    console.error('\n📝 Please create a .env file with the following:');
    console.error('   TARGET_CHAT_ID=1234567890@c.us');
    console.error('\n💡 To get a chat ID:');
    console.error('   - For individuals: phoneNumber@c.us (e.g., 201234567890@c.us)');
    console.error('   - For groups: Use the group ID (ends with @g.us)');
    console.error('   - You can find group IDs by enabling TEST_MODE and checking bot logs');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('          🕌 Prayer Reminder Bot 🕌');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Create and start the bot
  const prayerBot = new PrayerReminderBot(targetChatId);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Received shutdown signal (SIGINT)');
    await prayerBot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n⚠️  Received shutdown signal (SIGTERM)');
    await prayerBot.stop();
    process.exit(0);
  });

  // Start the bot
  await prayerBot.start();
}

// Run the application
main().catch((error) => {
  console.error('💥 Fatal error occurred:', error);
  process.exit(1);
});

