# SolAnalysis 📊

## Overview
This repository provides the scripts and tools necessary to build and deploy a Telegram bot, which can be queried to retrieve information about on-chain Solana addresses, as well as public websites.

## Architecture
For this project, we decided to use NodeJS with the [telegraf.js](https://telegraf.js.org/) npm library in order to communicate with the Telegram API.

We used the [@solana/web3.js](https://solana.com/docs/clients/javascript) JavaScript API in order to communicate with Solana RPC endpoints at a high level.

A few other APIs we used include:
- [BuiltWith API](https://api.builtwith.com/) to estimate website investments
- [SSLLabs API](https://www.ssllabs.com/projects/ssllabs-apis/) to generate an SSL certificate "trust grade"
- [Who Hosts This API](https://www.who-hosts-this.com/) to get a website's web hosting provider
- [WhoisXML API](https://www.whoisxmlapi.com/) to get the website creation date and company location

## Deploy
Before deploying, you should have NodeJS ( >= v20.12.0 ) installed.

In order to deploy the bot, first clone the repository and `cd` into the folder:
```
git clone https://github.com/0xShay/SolAnalysis.git
cd SolAnalysis
```

Copy the `template.env` file to a new file called `.env`, and update the environment variables with your API keys for the listed sites.

The `config.json` can be configured to your needs. By default, the bot will search on the Solana testnet when looking up on-chain wallet addresses. You can simply change the `https://api.testnet.solana.com` under the `solanaRpcEndpoint` key in the configuration file to a mainnet RPC URL in order to use the mainnet when querying wallet data. Note: the mainnet RPC URL provided by the Solana API limits the endpoints you can use, and so may not work, so it's recommended you spin up a custom private RPC with a service like QuickNode and use that in `config.json`.

You'll need to install the npm dependencies. You can do this inside the project directory by simply running:
```
npm install
```

Finally, to get the bot up and running, run:
```
npm run bot
```

## Usage
You can run `/help` in a message to the bot for a list of available commands.

![Preview of the `/analyseurl` command](https://imgur.com/ErSGIxJ.png)

![Preview of the `/analyseaddress` command](https://imgur.com/MAdsvnN.png)

## Testing
In order to test the bot, you can either get the bot running locally and communicate with your instance of the bot, or if that's not feasible for you, you can communicate with our bot instance on Telegram at [@solanalysis_bot](https://t.me/@solanalysis_bot)!

## License
You can [read the full LICENSE.md here](LICENSE.md).