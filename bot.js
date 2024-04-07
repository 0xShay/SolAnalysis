const config = require("./config.json");

const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const moment = require("moment");

const sslLabsService = require('./tools/webAnalysis/sslLabsService'); 
const builtWithService = require('./tools/webAnalysis/builtWithService');
const whoIsService = require('./tools/webAnalysis/whoIsService');
const whoHostService = require('./tools/webAnalysis/whoHostThisService');

const analyseWalletBalance = require('./tools/walletAnalysis/analyseWalletBalance');
const analyseWalletVolume = require('./tools/walletAnalysis/analyseWalletVolume');
const checkStakingActivities = require('./tools/walletAnalysis/checkStakingActivities');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let launchTime = Date.now();

bot.use((ctx, next) => {
    console.log(`[${new Date().toLocaleString()}] - ${ctx.updateType}`, ctx.update);
    return next();
})

bot.start((ctx) => {
    ctx.reply(`Hello @${ctx.update.message.from.username}!\nRun /help for a list of available commands.`);
})

bot.help((ctx) => {
    ctx.replyWithHTML([
        "<b>--=[ 📊 SolAnalysis 📊 ]=--</b>",
        "",
        "<b>Available commands</b>",
        "/start - initialises the bot",
        "/help - displays a list of commands and basic bot info",
        "/analyseurl [url] - displays an analysis of the website at [url]",
        "/analyseaddress [address] - displays an analysis of the on-chain account at [address]",
        "",
        "<b>Bot Info</b>",
        `🕒 Uptime: ${Math.floor((Date.now() - launchTime) / 60000)} minutes`
    ].join("\n"));
})

bot.command("analyseurl", async (ctx) => {

    let args = ctx.update.message.text.split(" ");
    if (args.length != 2) return ctx.replyWithHTML([
        "<b>Incorrect command syntax</b>",
        "/analyseurl [url] - displays an analysis of the website at [url]"
    ].join("\n"));

    let url = args[1].replace(/[^0-9A-Z.:\/]/gi, '');
    console.log(`Analysing URL: ${url}`)

    try {

        const builtWtihData = await builtWithService.getBuiltWithInfo(url);
        const techSpendData = builtWithService.getSpendOnTech(builtWtihData);
    
        const whoIsData = await whoIsService.getWhoIsData(url);
        const webCreationDateData = whoIsService.getCreationDate(whoIsData);
        const companyLocation = whoIsService.getCompanyLocation(whoIsData);
    
        const sslData = await sslLabsService.analyzeWithSSLLabs(url);
        const sslTrustGrade = sslLabsService.getTrustGrade(sslData);
    
        const whoHostdata = await whoHostService.getWhoHostThisData(url)
        const webHostingData = whoHostService.getWebHosting(whoHostdata);
    
        return ctx.replyWithHTML([
            "<b>--=[ 📊 SolAnalysis 📊 ]=--</b>",
            "",
            `🌐 <b>Web Analysis: <code>${url}</code></b>`,
            "",
            `💰 Tech Investments Monthly: ${techSpendData}`,
            `🌐 Web Creation Date: ${webCreationDateData}`,
            `📍 Company Location: ${companyLocation}`,
            `📛 SSL Labs Trust Grade: ${sslTrustGrade}`,
            `📂 Web Hosting Provider: ${webHostingData}`,
        ].join("\n"));

    } catch (err) {

        console.error(err);

        return ctx.replyWithHTML([
            "<b>An error occurred</b>"
        ].join("\n"));

    };

})

bot.command("analyseaddress", async (ctx) => {

    let args = ctx.update.message.text.split(" ");
    if (args.length != 2) return ctx.replyWithHTML([
        "<b>Incorrect command syntax</b>",
        "/analyseaddress [address] - displays an analysis of the on-chain account at [address]"
    ].join("\n"));

    let walletAddress = args[1].replace(/[^0-9A-Z]/gi, '');
    console.log(`Analysing on-chain address: ${walletAddress}`)

    let [solBalance, tokenBalances] = await analyseWalletBalance.getTokenBalance(walletAddress);

    let blockTimes = await analyseWalletVolume.getBlockTimes(walletAddress);
    let mostRecentMonthCount = analyseWalletVolume.countDatesForMostRecentMonth(blockTimes);
    let blockTimesRating = analyseWalletVolume.checkRecentMonthWalletActivity(mostRecentMonthCount);

    let latestBlock = "unknown";
    let latestBlockDuration = null;
    if (blockTimes.length > 0) {
        latestBlock = moment(blockTimes[0]).format('ddd DD MM YYYY @ HH:mm [GMT]ZZ');
        latestBlock = `<code>${latestBlock}</code>`;
        latestBlockDuration = Math.round(-moment.duration(moment(blockTimes[0]).diff(moment.now())).asDays());
    }

    let totalStake = await checkStakingActivities.getStakingActivities(walletAddress);

    return ctx.replyWithHTML([
        "<b>--=[ 📊 SolAnalysis 📊 ]=--</b>",
        "",
        `🌐 <b>Wallet Analysis: <code>${walletAddress}</code></b>`,
        "",
        `💰 SOL Balance: ${solBalance.toFixed(2)} SOL`,
        `🕒 Latest Block: ${latestBlock} (${latestBlockDuration}d ago)`,
        `💳 Transactions (last 1mo): ${mostRecentMonthCount}`,
        `📊 Tx Activity Rating: ${blockTimesRating}`,
        `🫰 Total Staked: ${totalStake}`,
    ].join("\n"));

})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))