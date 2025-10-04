/**
 * PM2 Ecosystem Configuration for Prayer Reminder Bot
 * 
 * This configuration file tells PM2 how to run and manage the bot process.
 * PM2 will automatically restart the bot if it crashes and can be configured
 * to start the bot automatically on system startup.
 * 
 * Documentation: https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

module.exports = {
  apps: [
    {
      // Application name (used in PM2 commands)
      name: 'prayer-bot',
      
      // Script to run
      script: './dist/index.js',
      
      // Interpreter to use (Node.js)
      interpreter: 'node',
      
      // Working directory
      cwd: __dirname,
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
      },
      
      // Number of instances to run (1 for WhatsApp bot - don't scale)
      instances: 1,
      
      // Execution mode: 'cluster' or 'fork' (use fork for single instance)
      exec_mode: 'fork',
      
      // Auto-restart if app crashes
      autorestart: true,
      
      // Watch for file changes and auto-reload (disable in production)
      watch: false,
      
      // Maximum memory usage before restart (optional, e.g., '500M')
      // max_memory_restart: '500M',
      
      // Delay between automatic restarts (in milliseconds)
      restart_delay: 4000,
      
      // Number of times to restart if crashes happen consecutively
      max_restarts: 10,
      
      // Minimum uptime before considering the app stable (in milliseconds)
      min_uptime: '10s',
      
      // Time to wait before force killing the app on stop/restart (in milliseconds)
      kill_timeout: 5000,
      
      // Listen for 'ready' event from app to consider it started (advanced)
      wait_ready: false,
      
      // Error log file location
      error_file: './logs/pm2-error.log',
      
      // Output log file location
      out_file: './logs/pm2-out.log',
      
      // Combine logs from all instances into single files
      combine_logs: true,
      
      // Merge logs from different processes
      merge_logs: true,
      
      // Time format for logs
      time: true,
      
      // Cron pattern to restart the app (optional)
      // cron_restart: '0 0 * * *', // Restart every day at midnight
      
      // Don't auto-restart if exit code is 0 (successful exit)
      // stop_exit_codes: [0],
    },
  ],
};

