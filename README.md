## Serverless application for AWS Lambda or Yandex Functions.

Publish RSS Feed to telegram channel.

**For setup:**

1. create new telegram bot with BotFather
2. create new channel
3. add bot to channel as Administrator
4. get channel id with next url `curl -XGET https://api.telegram.org/bot\<telegram-bot-token>/getUpdates`
5. add .env file with next variables:

```
BOT_TOKEN=<telegram-bot-token>
CHAT_ID=<telegram-channel-id>
RSS_URL=<rss-feed-url>
```
6. setup and run function each hour
