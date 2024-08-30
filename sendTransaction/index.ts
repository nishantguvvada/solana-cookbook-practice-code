import {
    clusterApiUrl, 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    SystemProgram, 
    Transaction,
    sendAndConfirmTransaction,
    TransactionInstruction,
    PublicKey,
    ComputeBudgetProgram
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction
} from "@solana/spl-token";
import bs58 from "bs58";

const sendTransaction = async (connection: Connection) => {
        // const PUBLIC_KEY = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4")

        const fromKeypair = Keypair.generate();

        const toKeypair = Keypair.generate();
    
        console.log("Airdropping 1 SOL to ", fromKeypair.publicKey);
    
        const airdropSignature = await connection.requestAirdrop(
            fromKeypair.publicKey,
            LAMPORTS_PER_SOL
        )
    
        await connection.confirmTransaction(airdropSignature, "confirmed");
    
        console.log("Airdrop received by ", fromKeypair.publicKey.toBase58());
    
        console.log("Sending 1 SOL from ", fromKeypair.publicKey.toBase58());
        
    
        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toKeypair.publicKey,
                lamports: LAMPORTS_PER_SOL / 10
            })
        )
    
        await sendAndConfirmTransaction(connection, transferTransaction, [fromKeypair]);
    
        console.log("Received 1 SOL by ", toKeypair.publicKey.toBase58());
}

const sendToken = async () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    // generate new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(airdropSignature, "confirmed");

    // generate new wallet to receive newly minted tokens
    const toWallet = Keypair.generate();

    // mint a new token
    const mint = await createMint(
        connection, // connection
        fromWallet, // payer
        fromWallet.publicKey, // mint authority
        null, // freeze authority
        9 // decimals
    );

    // get associated token account of the fromWallet
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        fromWallet, // payer
        mint, // mint
        fromWallet.publicKey // owner of the token account (mint owner)
    )

    // get associated token account of the toWallet
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        fromWallet, // payer (gas payer)
        mint, // mint
        toWallet.publicKey // owner of the token account
    )

    // minting 1 new token to fromTokenAccount
    await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    )

    // transfer token from fromTokenAccount to toTokenAccount
    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1
        )
    )

    await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

    console.log(`Token transfered from ${fromTokenAccount.address} to ${toTokenAccount.address}`);
    
}

const transactionCost = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const recentBlockhash = await connection.getLatestBlockhash();

    const fromPublicKey = new PublicKey("w5ktUQvXGAKexvFCHDDieGMEfB3GmqDttVREQPRM8FW");

    const toPublicKey = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");

    const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash, // required when using getEstimatedFee method
        feePayer: fromPublicKey
    }).add(
        SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: LAMPORTS_PER_SOL / 10
        })
    )

    const fees = await transaction.getEstimatedFee(connection);
    console.log(`Estimated Fee ${fees} lamports`);
} // TBD : getFeeForMessage

// Any transaction can add a message along with it
const addMemo = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const TO_PUBLIC_KEY = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
    const FROM_PUBLIC_KEY = Keypair.generate()

    const airdropSignature = await connection.requestAirdrop(
        FROM_PUBLIC_KEY.publicKey,
        LAMPORTS_PER_SOL
    )

    await connection.confirmTransaction(airdropSignature, "confirmed");

    console.log("Airdropped 1 SOL");

    const transferTransaction = new Transaction().add(
        SystemProgram.transfer(
            {
                fromPubkey: FROM_PUBLIC_KEY.publicKey,
                toPubkey: TO_PUBLIC_KEY,
                lamports: LAMPORTS_PER_SOL / 10
            }
        )
    )

    await transferTransaction.add(
        new TransactionInstruction({
            keys: [{ pubkey: FROM_PUBLIC_KEY.publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from("Data to send with the transaction", "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
        })
    )

    await sendAndConfirmTransaction(connection, transferTransaction, [FROM_PUBLIC_KEY]);

    console.log("Message sent using Memo")
}

const computeUnits = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const payer = new PublicKey("8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF");
    const payerKeypair = Keypair.fromSecretKey(bs58.decode(""))

    const toAccount = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
    });

    const transaction = new Transaction().add(modifyComputeUnits).add(addPriorityFee).add(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: toAccount,
            lamports: LAMPORTS_PER_SOL / 100
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair])

    console.log(signature);
    const result = await connection.getParsedTransaction(signature);
    console.log(result);
}


(async()=>{
    

    // sendTransaction(connection);

    // sendToken();

    // transactionCost();

    // addMemo();

    computeUnits();
})()