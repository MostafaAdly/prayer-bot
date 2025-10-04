import { Client, LocalAuth, Message, Chat, Poll } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

/**
 * Configuration options for the WhatsAppBot
 */
export interface BotConfig {
  /** Custom name for the bot session (used for storing auth data) */
  sessionName?: string;
  /** Path to Chromium/Chrome executable (optional, auto-detected by default) */
  chromiumPath?: string;
  /** Enable or disable headless mode (default: true) */
  headless?: boolean;
  /** Custom user agent string */
  userAgent?: string;
  /** Timeout for puppeteer operations in milliseconds (default: 0 = no timeout) */
  timeout?: number;
  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Event callbacks that can be registered with the bot
 */
export interface BotEventHandlers {
  /** Callback when QR code is received for authentication */
  onQR?: (qr: string) => void;
  /** Callback when bot is authenticated */
  onAuthenticated?: () => void;
  /** Callback when authentication fails */
  onAuthenticationFailure?: (error: string) => void;
  /** Callback when bot is ready to use */
  onReady?: () => void;
  /** Callback when a message is received */
  onMessage?: (message: Message) => void;
  /** Callback when bot disconnects */
  onDisconnected?: (reason: string) => void;
}

/**
 * Options for sending messages
 */
export interface SendMessageOptions {
  /** ID of the chat to send the message to (phone number with country code + @c.us for individuals, or groupId@g.us for groups) */
  chatId: string;
  /** The message content to send */
  content: string;
  /** Optional: Parse mentions in the message */
  parseMentions?: boolean;
  /** Optional: Send message as a reply to another message */
  quotedMessageId?: string;
}

/**
 * Options for creating and sending polls
 */
export interface SendPollOptions {
  /** ID of the chat to send the poll to */
  chatId: string;
  /** The poll question/title */
  question: string;
  /** Array of poll options (minimum 2, maximum 12) */
  options: string[];
  /** Allow multiple selections (default: false) */
  allowMultipleAnswers?: boolean;
}

/**
 * Reusable WhatsApp Bot Class
 * 
 * This class provides a clean, reusable interface for creating WhatsApp bots
 * using the whatsapp-web.js library. It handles authentication, message sending,
 * event handling, and common bot operations.
 * 
 * @example
 * ```typescript
 * const bot = new WhatsAppBot({
 *   sessionName: 'my-bot',
 *   verbose: true
 * });
 * 
 * bot.on('onReady', () => {
 *   console.log('Bot is ready!');
 *   bot.sendMessage({
 *     chatId: '1234567890@c.us',
 *     content: 'Hello from bot!'
 *   });
 * });
 * 
 * await bot.initialize();
 * ```
 */
export class WhatsAppBot {
  private client: Client;
  private config: BotConfig;
  private eventHandlers: BotEventHandlers = {};
  private isInitialized: boolean = false;

  /**
   * Creates a new WhatsApp bot instance
   * 
   * @param config - Configuration options for the bot
   */
  constructor(config: BotConfig = {}) {
    this.config = {
      sessionName: 'whatsapp-bot-session',
      headless: true,
      timeout: 0,
      verbose: false,
      ...config,
    };

    // Initialize the WhatsApp client with LocalAuth strategy
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: this.config.sessionName,
      }),
      puppeteer: {
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
        ...(this.config.chromiumPath && { executablePath: this.config.chromiumPath }),
        ...(this.config.timeout && { timeout: this.config.timeout }),
      },
      ...(this.config.userAgent && { userAgent: this.config.userAgent }),
    });

    this.setupEventListeners();
  }

  /**
   * Sets up internal event listeners for the WhatsApp client
   * @private
   */
  private setupEventListeners(): void {
    // QR Code event - called when QR code needs to be scanned
    this.client.on('qr', (qr: string) => {
      if (this.config.verbose) {
        console.log('[WhatsAppBot] QR Code received. Scan with your phone:');
        qrcode.generate(qr, { small: true });
      }
      this.eventHandlers.onQR?.(qr);
    });

    // Authenticated event
    this.client.on('authenticated', () => {
      if (this.config.verbose) {
        console.log('[WhatsAppBot] Successfully authenticated!');
      }
      this.eventHandlers.onAuthenticated?.();
    });

    // Authentication failure event
    this.client.on('auth_failure', (error: Error) => {
      if (this.config.verbose) {
        console.error('[WhatsAppBot] Authentication failed:', error.message);
      }
      this.eventHandlers.onAuthenticationFailure?.(error.message);
    });

    // Ready event - client is ready to use
    this.client.on('ready', () => {
      if (this.config.verbose) {
        console.log('[WhatsAppBot] Bot is ready to use!');
      }
      this.isInitialized = true;
      this.eventHandlers.onReady?.();
    });

    // Message received event
    this.client.on('message', async (message: Message) => {
      if (this.config.verbose && process.env.TEST_MODE === 'true') {
        console.log(`[WhatsAppBot] Message received from ${message.from}: ${message.body}`);
      }
      this.eventHandlers.onMessage?.(message);
    });

    // Disconnected event
    this.client.on('disconnected', (reason: string) => {
      if (this.config.verbose) {
        console.log('[WhatsAppBot] Bot disconnected:', reason);
      }
      this.isInitialized = false;
      this.eventHandlers.onDisconnected?.(reason);
    });
  }

  /**
   * Registers an event handler
   * 
   * @param eventName - The name of the event to listen for
   * @param handler - The callback function to execute when the event occurs
   * 
   * @example
   * ```typescript
   * bot.on('onMessage', (message) => {
   *   console.log('Received:', message.body);
   * });
   * ```
   */
  public on<K extends keyof BotEventHandlers>(
    eventName: K,
    handler: NonNullable<BotEventHandlers[K]>
  ): void {
    this.eventHandlers[eventName] = handler as any;
  }

  /**
   * Initializes the WhatsApp client and starts the bot
   * This method must be called before any other bot operations
   * 
   * @returns Promise that resolves when initialization is complete
   * 
   * @example
   * ```typescript
   * await bot.initialize();
   * ```
   */
  public async initialize(): Promise<void> {
    if (this.config.verbose) {
      console.log('[WhatsAppBot] Initializing bot...');
    }
    await this.client.initialize();
  }

  /**
   * Sends a text message to a specific chat
   * 
   * @param options - Message sending options
   * @returns Promise that resolves with the sent message
   * @throws Error if bot is not initialized or message sending fails
   * 
   * @example
   * ```typescript
   * await bot.sendMessage({
   *   chatId: '1234567890@c.us',
   *   content: 'Hello, World!'
   * });
   * ```
   */
  public async sendMessage(options: SendMessageOptions): Promise<Message> {
    this.ensureInitialized();

    const { chatId, content, parseMentions, quotedMessageId } = options;

    try {
      const sendOptions: any = {};
      
      if (parseMentions) {
        sendOptions.mentions = await this.parseMentions(content, chatId);
      }
      
      if (quotedMessageId) {
        sendOptions.quotedMessageId = quotedMessageId;
      }

      const message = await this.client.sendMessage(chatId, content, sendOptions);
      
      if (this.config.verbose) {
        console.log(`[WhatsAppBot] Message sent to ${chatId}`);
      }
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.config.verbose) {
        console.error(`[WhatsAppBot] Failed to send message to ${chatId}:`, errorMessage);
      }
      throw new Error(`Failed to send message: ${errorMessage}`);
    }
  }

  /**
   * Sends a poll to a specific chat
   * 
   * @param options - Poll creation options
   * @returns Promise that resolves with the sent message containing the poll
   * @throws Error if bot is not initialized, options are invalid, or sending fails
   * 
   * @example
   * ```typescript
   * await bot.sendPoll({
   *   chatId: '1234567890@c.us',
   *   question: 'What is your favorite color?',
   *   options: ['Red', 'Blue', 'Green'],
   *   allowMultipleAnswers: false
   * });
   * ```
   */
  public async sendPoll(options: SendPollOptions): Promise<Message> {
    this.ensureInitialized();

    const { chatId, question, options: pollOptions, allowMultipleAnswers = false } = options;

    // Validate poll options
    if (pollOptions.length < 2) {
      throw new Error('Poll must have at least 2 options');
    }
    if (pollOptions.length > 12) {
      throw new Error('Poll cannot have more than 12 options');
    }

    try {
      const poll = new Poll(question, pollOptions, {
        allowMultipleAnswers,
        messageSecret: [1],
      });

      const message = await this.client.sendMessage(chatId, poll);
      
      if (this.config.verbose) {
        console.log(`[WhatsAppBot] Poll sent to ${chatId}: ${question}`);
      }
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.config.verbose) {
        console.error(`[WhatsAppBot] Failed to send poll to ${chatId}:`, errorMessage);
      }
      throw new Error(`Failed to send poll: ${errorMessage}`);
    }
  }

  /**
   * Gets a chat by its ID
   * 
   * @param chatId - The ID of the chat
   * @returns Promise that resolves with the Chat object
   * @throws Error if bot is not initialized or chat is not found
   * 
   * @example
   * ```typescript
   * const chat = await bot.getChat('1234567890@c.us');
   * console.log(chat.name);
   * ```
   */
  public async getChat(chatId: string): Promise<Chat> {
    this.ensureInitialized();

    try {
      const chat = await this.client.getChatById(chatId);
      return chat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get chat: ${errorMessage}`);
    }
  }

  /**
   * Gets all active chats
   * 
   * @returns Promise that resolves with an array of Chat objects
   * @throws Error if bot is not initialized
   * 
   * @example
   * ```typescript
   * const chats = await bot.getAllChats();
   * chats.forEach(chat => console.log(chat.name));
   * ```
   */
  public async getAllChats(): Promise<Chat[]> {
    this.ensureInitialized();

    try {
      const chats = await this.client.getChats();
      return chats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get chats: ${errorMessage}`);
    }
  }

  /**
   * Gets the bot's info (phone number, profile name, etc.)
   * 
   * @returns Promise that resolves with client info
   * @throws Error if bot is not initialized
   * 
   * @example
   * ```typescript
   * const info = await bot.getBotInfo();
   * console.log('Bot number:', info.wid.user);
   * ```
   */
  public async getBotInfo(): Promise<any> {
    this.ensureInitialized();

    try {
      const info = await this.client.info;
      return info;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get bot info: ${errorMessage}`);
    }
  }

  /**
   * Destroys the client and logs out
   * 
   * @returns Promise that resolves when logout is complete
   * 
   * @example
   * ```typescript
   * await bot.destroy();
   * ```
   */
  public async destroy(): Promise<void> {
    if (this.config.verbose) {
      console.log('[WhatsAppBot] Destroying client...');
    }
    await this.client.destroy();
    this.isInitialized = false;
  }

  /**
   * Gets the underlying WhatsApp client instance
   * Use this for advanced operations not covered by the bot class
   * 
   * @returns The WhatsApp client instance
   * 
   * @example
   * ```typescript
   * const client = bot.getClient();
   * client.on('message_create', (msg) => {
   *   // Handle message creation event
   * });
   * ```
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Checks if the bot is initialized and ready to use
   * 
   * @returns true if bot is initialized, false otherwise
   * 
   * @example
   * ```typescript
   * if (bot.isReady()) {
   *   await bot.sendMessage({ chatId: '...', content: 'Hello!' });
   * }
   * ```
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Ensures the bot is initialized before performing operations
   * @private
   * @throws Error if bot is not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Bot is not initialized. Call initialize() first.');
    }
  }

  /**
   * Parses mentions from message content
   * @private
   * @param content - Message content with mentions
   * @param chatId - Chat ID where mentions should be resolved
   * @returns Array of contact IDs that were mentioned
   */
  private async parseMentions(content: string, _chatId: string): Promise<string[]> {
    const mentions: string[] = [];
    const mentionRegex = /@(\d+)/g;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(`${match[1]}@c.us`);
    }

    return mentions;
  }
}

