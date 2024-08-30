import {
    Connection,
    clusterApiUrl,
    Keypair,
    StakeProgram,
    Authorized,
    LAMPORTS_PER_SOL,
    Lockup,
    sendAndConfirmTransaction,
    PublicKey
} from "@solana/web3.js";
import bs58 from "bs58";

const getValidators = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const { current, delinquent } = await connection.getVoteAccounts();

    console.log("current validators: ", current);

    console.log("all validators: ", current.concat(delinquent));
}

const createStakeAccount = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const wallet = Keypair.fromSecretKey(bs58.decode(""))

    const stakeAccount = Keypair.generate();

    const minimumRent = await connection.getMinimumBalanceForRentExemption(
        StakeProgram.space
    );

    const amountUserWantsToStake = LAMPORTS_PER_SOL / 2;
    const amountToStake = minimumRent + amountUserWantsToStake;

    console.log("Amount to rent: ", minimumRent);
    console.log("Amount user wants to stake : ", amountUserWantsToStake);
    console.log("Total Amount to Stake: ", amountToStake);

    const createStakeAccountTx = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: amountToStake,
        lockup: new Lockup(0,0, wallet.publicKey), // optional
        stakePubkey: stakeAccount.publicKey
    });

    const createStakeAccountTxId = await sendAndConfirmTransaction(
        connection,
        createStakeAccountTx,
        [
            wallet,
            stakeAccount
        ]
    );

    console.log(`Stake account created. Tx Id: ${createStakeAccountTxId}`);

    console.log("Stake Account Public Key: ", stakeAccount.publicKey);
    console.log("Stake Account Private Key: ", stakeAccount.secretKey);

    // Check our newly created stake account balance. This should be 0.5 SOL.
    let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);

    // Verify the status of our stake account. This will start as inactive and will take some time to activate.
    // let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    // console.log(`Stake account status: ${stakeStatus.state}`);

    // https://github.com/solana-developers/solana-rpc-get-stake-activation


}

const delegateStake = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = Keypair.fromSecretKey(bs58.decode(""))

    const stakeAccount = Keypair.fromSecretKey(new Uint8Array([]));

    const validators = await connection.getVoteAccounts();
    const selectedValidator = validators.current[0]
    console.log("Selected Validator :",selectedValidator);
    const selectedValidatorPublicKey = new PublicKey(selectedValidator.votePubkey);

    const delegateStakeTx = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: selectedValidatorPublicKey
    });

    const delegateTxId = await sendAndConfirmTransaction(connection, delegateStakeTx, [
        wallet,
      ]);

    console.log(
        `Stake account ${stakeAccount.publicKey.toBase58()} delegated to ${selectedValidatorPublicKey.toBase58()}. Tx Id: ${delegateTxId}`
      );

    //   Selected Validator : {
    //     activatedStake: 2000038614489280,
    //     commission: 100,
    //     epochCredits: [
    //       [ 741, 95066909, 88210110 ],
    //       [ 742, 101967908, 95066909 ],
    //       [ 743, 108866743, 101967908 ],
    //       [ 744, 115745152, 108866743 ],
    //       [ 745, 118088752, 115745152 ]
    //     ],
    //     epochVoteAccount: true,
    //     lastVote: 321986735,
    //     nodePubkey: 'Cw6X5R68muAyGRCb7W8ZSP2YbaRjwMs1t5sBEPkhdwbM',
    //     rootSlot: 321986704,
    //     votePubkey: '7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF'
    //   }
    //   Stake account 4KtK7gBwigMobkwMr4eFU1AVAg2ShrHa1rrghgPZFMdZ delegated to 7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF. Tx Id: 48wNY9dvvUoxMHSFBekvqg8tTQC7iSxXgACate3xZ4HzYBcK6gmR9hTW9ukfkE2HKQUjamKMotow5LNexRoY43YF

}

const viewAllDelegators = async () => {
    const STAKE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");

    const VOTE_PUB_KEY = "7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF";

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const accounts = await connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
        filters: [
            {
                dataSize: 200,
            },
            {
                memcmp: {
                    offset: 124,
                    bytes: VOTE_PUB_KEY
                }
            }
        ]
    });

    
    console.log(`Accounts for program ${STAKE_PROGRAM_ID}: `);
    console.log(
    `Total number of delegators found for ${VOTE_PUB_KEY} is: ${accounts.length}`
    );
    for (let i = 0; i <= accounts.length; i++) {
        console.log(`Sample delegator ${i}:`, JSON.stringify(accounts[i]));
    }

}

const deactivateStake = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = Keypair.fromSecretKey(bs58.decode(""))

    const stakeAccount = Keypair.fromSecretKey(new Uint8Array([]));

    const deactivateTx = StakeProgram.deactivate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey
    });

    const deactivateTxId = await sendAndConfirmTransaction(
        connection,
        deactivateTx,
        [wallet]
    );

    console.log(`Stake account deactivated :`, deactivateTxId);

}

const withdrawStake = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = Keypair.fromSecretKey(bs58.decode(""))

    const stakeAccount = Keypair.fromSecretKey(new Uint8Array([
        2,  32, 140, 146, 207, 225,  45, 253,  60,  69, 121,
      177,  94, 195,  46, 154,  15, 195, 245,  66,  68, 234,
      168, 105, 255, 152,  97,  17, 214, 190,  69, 166,  49,
      105, 136, 205,   0, 130,  20, 251, 100, 120, 214, 213,
      252, 115,  99,  25, 204,  97, 245, 108, 222, 208, 229,
       69,  49, 115, 104,   6, 190,  82,   7, 200
    ]));

    let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);

    const withdrawTx = StakeProgram.withdraw({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: stakeBalance
    });

    const withdrawTxId = await sendAndConfirmTransaction(connection, withdrawTx, [
        wallet,
    ]);

    console.log(`Stake account withdrawn. Tx Id: ${withdrawTxId}`);

    // Confirm that our stake account balance is now 0
    stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);
}

(async()=>{
    // getValidators();
    // createStakeAccount();
    // delegateStake();
    // viewAllDelegators();
    // deactivateStake();
    withdrawStake();
})()