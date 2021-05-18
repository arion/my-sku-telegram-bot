require("dotenv").config();
const { Telegraf } = require("telegraf");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const moment = require("moment");

const bot = new Telegraf(process.env.BOT_TOKEN);
let parser = new Parser();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function go() {
  console.log("Start to send message.");

  let feed = await parser.parseURL(process.env.RSS_URL);
  const lastStartedAt = moment().subtract(1, 'hour'); // 1 hour ago

  for (item of feed.items) {
    if (lastStartedAt > moment(item.pubDate)) { continue; }

    const imgSrcMatch = item.content.match(/src\s*=\s*"(.+?)"/);
    const imgSrc =
      imgSrcMatch && imgSrcMatch.length > 1 ? imgSrcMatch[1] : undefined;

    let message = item.content.replace(/\s+/g, " ").trim();
    message = message.split("<br/>").join("\r\n")

    message = sanitizeHtml(message, {
      allowedTags: ["b", "strong", "i", "em", "a", "code", "pre"],
    });

    message = `${imgSrc ? `<a href="${imgSrc}">&#8205;</a>` : ""}<b>${
      item.title
    }</b>\n\r${message}`;

    await bot.telegram.sendMessage(process.env.CHAT_ID, message, {
      parse_mode: "HTML",
    });
    await sleep(1000);
  }

  console.log("End to send message.");
}

go()
  .catch((err) => console.error(err))
  .finally(() => {
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
    process.exit();
  });
