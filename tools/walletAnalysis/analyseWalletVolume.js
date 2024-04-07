const config = require('../../config.json');

const solanaWeb3 = require('@solana/web3.js');
const moment = require('moment');

async function getBlockTimes(walletAddress) {
    const connection = new solanaWeb3.Connection(config["solanaRpcEndpoint"], 'confirmed');
    const publicKey = new solanaWeb3.PublicKey(walletAddress);

    
    let signatures = await connection.getSignaturesForAddress(publicKey, { limit: 1000 });

    let blockTimes  = [];

    for (let i = 0; i < signatures.length; i++) {
        let blockTime = signatures[i].blockTime;
        if (blockTime) {
            let transactionalDate = new Date(blockTime * 1000);
            transactionalDate = moment(transactionalDate).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
            blockTimes.push(transactionalDate);
        }
    }

    return blockTimes; 
}

function countDatesForMostRecentMonthInFull(dates) {
    const monthCounts = {};
    if (dates.length === 0) {
        return monthCounts; 
    }

    const mostRecentDate = new Date(Math.max(...dates.map(dateStr => new Date(dateStr))));
    const mostRecentYearMonth = `${mostRecentDate.getFullYear()}-${mostRecentDate.getMonth() + 1}`;

    dates.forEach(dateStr => {
        const date = new Date(dateStr);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (yearMonth === mostRecentYearMonth) {
            if (!monthCounts[yearMonth]) {
                monthCounts[yearMonth] = 1;
            } else {
                monthCounts[yearMonth]++;
            }
        }
    });

    return monthCounts;
}

function countDatesForMostRecentMonth(dates) {
    if (dates.length === 0) {
        return 0;
    }

    const mostRecentDate = new Date(Math.max(...dates.map(dateStr => new Date(dateStr))));
    const mostRecentYearMonth = `${mostRecentDate.getFullYear()}-${mostRecentDate.getMonth() + 1}`;

    let count = 0;
    dates.forEach(dateStr => {
        const date = new Date(dateStr);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (yearMonth === mostRecentYearMonth) {
            count++;
        }
    });

    return count;
}

function checkRecentMonthWalletActivity(count) {
    if (count === null) {
        return "No transaction or Account not found.";
    } else if (count === 0) {
        return "No activity";
    } else if (count > 0 && count <= 5) {
        return "Very low";
    } else if (count > 5 && count <= 100) {
        return "Low";
    } else if (count > 100 && count <= 500) {
        return "Medium";
    } else if (count > 500) {
        return "High";
    } else {
        return "Unexpected count value"; 
    }
}






module.exports = { getBlockTimes, countDatesForMostRecentMonth, countDatesForMostRecentMonthInFull, checkRecentMonthWalletActivity };