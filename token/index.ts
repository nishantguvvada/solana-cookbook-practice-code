import {
    Connection,
    clusterApiUrl,
    Keypair,
    SystemProgram,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction
} from "@solana/web3.js";
import {
    getMint,
    createMint,
    getOrCreateAssociatedTokenAccount,
    getAccount,
    mintToChecked,
    transfer,
    createAssociatedTokenAccount,
    transferChecked,
    burnChecked,
    Account,
    closeAccount,
    createSyncNativeInstruction,
    getAssociatedTokenAddress
} from "@solana/spl-token";
import bs58 from "bs58";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function createToken() {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
    // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
    const alice = Keypair.fromSecretKey(
        bs58.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k")
    );

//     Mint Public Key:  64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2
// Mint Account:  {
//   address: PublicKey [PublicKey(Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo)] {
//     _bn: <BN: a2b02db6747cb1ad06ae3fd8aa86b2ec74717dfd17cc7aad51bce8f38ef582d6>
//   },
//   mint: PublicKey [PublicKey(64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2)] {
//     _bn: <BN: 4b4862bce3a9c4d01bf5883c2ad8530c4f55530973c75f642ef3d68358744d15>
//   },
//   owner: PublicKey [PublicKey(J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4)] {
//     _bn: <BN: fce46945d80d7f4f74d13fbcff631eb21de7ffc8bff23c24c14165e8c6a26ea9>
//   }
    const mintPubKey = await createMint(
        connection,
        feePayer,
        alice.publicKey,
        alice.publicKey,
        8
    );

    const mintAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        feePayer,
        mintPubKey,
        alice.publicKey
    );

    console.log("Mint Public Key: ", mintPubKey.toBase58());
    console.log("Mint Account: ", mintAccount);
}

async function getTokenDetails() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const mintPubKey = new PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");

    const mintAccountDetails = await getMint(connection , mintPubKey);

    console.log(mintAccountDetails);
}

async function getTokenAccountDetails() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
    // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4

    const mintPubKey = new PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");

    const mintAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        feePayer,
        mintPubKey,
        feePayer.publicKey
    );

    console.log("Mint Account: ", mintAccount);

    const tokenAccountDetails = await getAccount(connection, mintAccount.address);

    console.log("Token Account Details : ", tokenAccountDetails);

    // mintAccount and tokenAccountDetails result in the same information

}

async function getTokenAccountsBalance() {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const tokenAccount = new PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");

    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);

    console.log("Token Account : ", tokenAccount.toBase58());

    console.log("Token Balance : ", tokenBalance);
}

async function mintTokens() {

    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));

    const mintPubKey = new PublicKey("64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2");

    const tokenAccountPubKey = new PublicKey("Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo");

    const alice = Keypair.fromSecretKey(
        bs58.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k")
    );

    const tokenAmountBefore = await connection.getTokenAccountBalance(tokenAccountPubKey);

    console.log("Token Amount Before : ", tokenAmountBefore);

    const txhash = await mintToChecked(
        connection,
        feePayer,
        mintPubKey,
        tokenAccountPubKey,
        alice,
        1e8,
        8
    )

    const tokenAmountAfter = await connection.getTokenAccountBalance(tokenAccountPubKey);

    const tokenAccountDetails = await getMint(connection, mintPubKey);

    console.log("Token Amount after :", tokenAmountAfter);

    console.log("Token Account Details : ", tokenAccountDetails);
}

async function transferTokens() {

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
    // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
    const alice = Keypair.fromSecretKey(
        bs58.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k")
    );
    const velma = Keypair.fromSecretKey(
        bs58.decode("5fTMxNL3ryaS69RjSxgFcAVDuPX5hMs7HkHR9mSs3VwYG6WnxDRner4R9tDVN8H1GaE7iPxLDs8nHG429x2owL9w")
    );
    // 64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2
    const mintPubKey = new PublicKey("64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2");

    const tokenAccountPubKeyFrom = new PublicKey("2c8pyEAEitaYpoud4WAFgRDtzjbxZrcaa85NkmsehDf2");

    const tokenAccountPubKeyTo = await getOrCreateAssociatedTokenAccount(
        connection,
        feePayer,
        mintPubKey,
        alice.publicKey
    );

    let txhash = await transferChecked(
        connection,
        feePayer,
        tokenAccountPubKeyFrom,
        mintPubKey,
        tokenAccountPubKeyTo.address,
        velma,
        1e8,
        8
    );

    console.log("Token transferred to :", tokenAccountPubKeyTo);

}

async function burnTokens() {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));

    const alice = Keypair.fromSecretKey(
        bs58.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k")
    );

    const mintPubKey = new PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");

    const tokenAccountPubKey = new PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");

    const txhash = await burnChecked(
        connection,
        feePayer,
        tokenAccountPubKey,
        mintPubKey,
        feePayer.publicKey,
        1e8,
        8
    );

}

async function closeATA(){
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));

    const tokenAccountPubKey = new PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");

    const alice = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));

    let txhash = await closeAccount(
        connection,
        feePayer,
        tokenAccountPubKey,
        alice.publicKey,
        alice
    );

    console.log(`txhash: ${txhash}`);
}

async function wrappedSOL(){
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const feePayer = Keypair.fromSecretKey(bs58.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));

    const alice = Keypair.fromSecretKey(bs58.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"))
    
    const ata = await getAssociatedTokenAddress(
        NATIVE_MINT,
        alice.publicKey
    )

    let tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: alice.publicKey,
            toPubkey: ata,
            lamports: LAMPORTS_PER_SOL / 10
        }),
        createSyncNativeInstruction(ata)
    );

    console.log(`txhash: ${await connection.sendTransaction(tx, [feePayer, alice])}`)
}

async function fetchAllTokenAccounts(){
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const owner = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");

    let response = await connection.getParsedTokenAccountsByOwner(owner, {
        programId: TOKEN_PROGRAM_ID 
    })

    response.value.forEach((accountInfo) => {
        console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
        console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
        console.log(
          `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`
        );
        console.log(
          `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`
        );
        console.log(
          `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`
        );
        console.log("====================");
      });

// pubkey: DuWFnt8sNSE1hNVqecbgbbrsp24Tjvu41xNQPwpL4Ji4
// mint: DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs
// owner: J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
// decimals: 8
// amount: 0
// ====================
// pubkey: Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo
// mint: DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs
// owner: J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
// decimals: 8
// amount: 0
}

(async () => {
    // createToken();
    // getTokenDetails();
    // getTokenAccountDetails();
    // getTokenAccountsBalance();
    // mintTokens();
    // transferTokens();
    // burnTokens();
    // closeATA();
    // wrappedSOL();
    fetchAllTokenAccounts();
})();