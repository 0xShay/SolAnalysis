const config = require('../../config.json');

const solanaWeb3 = require('@solana/web3.js');

async function getStakingActivities(walletAddress) {
    const connection = new solanaWeb3.Connection(config["solanaRpcEndpoint"], 'confirmed');
    const walletPublicKey = new solanaWeb3.PublicKey(walletAddress);

    const stakeAccountFilters = [
        {
            memcmp: {
                offset: 12,
                bytes: walletPublicKey.toBase58(),
            },
        },
        {
            memcmp: {
                offset: 44,
                bytes: walletPublicKey.toBase58(),
            },
        },
    ];

    let seenAccounts = new Set();

    try {
        let totalStake = 0;
        for (let filter of stakeAccountFilters) {
            const accounts = await connection.getParsedProgramAccounts(
                solanaWeb3.StakeProgram.programId,
                { filters: [filter] }
            );
            
            accounts.forEach((account, index) => {
                if (!seenAccounts.has(account.pubkey.toString())) {
                    seenAccounts.add(account.pubkey.toString());
                
                    const info = account.account.data.parsed.info;
                    // console.log(`Stake Account ${index + 1}: ${account.pubkey.toString()}`);
                    // console.log(`Stake Authority: ${info.meta.authorized.staker}`);
                    // console.log(`Withdraw Authority: ${info.meta.authorized.withdrawer}`);
                    // console.log(`Current Stake: ${(info.stake.delegation.stake /solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)} SOL`);
                    // console.log(`Delegated Vote Account Address: ${info.stake.delegation.voter}`);
                    totalStake += info.stake.delegation.stake / solanaWeb3.LAMPORTS_PER_SOL;
                }
            });
        }
        return totalStake.toFixed(2) + " SOL";
    } catch (error) {
        console.error('Failed to fetch staking activities:', error);
        return "unknown";
    }
}

module.exports = { getStakingActivities };