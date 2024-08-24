import { getMinimumBalanceForRentExemptAccount } from "@solana/spl-token";
import {
    Connection,
    clusterApiUrl,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    PublicKey
} from "@solana/web3.js";
import bs58 from "bs58";

const createSystemAccount = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const fromKeypair = Keypair.generate();
    const newAccountKeypair = Keypair.generate();
    const space = 0;
    const rentExemption = await connection.getMinimumBalanceForRentExemption(space);

    const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL);
    
    console.log("Airdropped 1 SOL");
    
    const createAccountTransaction = new Transaction().add(
        SystemProgram.createAccount({
        fromPubkey: fromKeypair.publicKey,
        newAccountPubkey: newAccountKeypair.publicKey,
        lamports: rentExemption,
        space,
        programId: SystemProgram.programId
        })
    )

    await sendAndConfirmTransaction(connection, createAccountTransaction, [fromKeypair]);

    console.log("Account created!", newAccountKeypair.publicKey.toBase58());
}

const calculateAccountCost = async () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const dataLength = 100;

    const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(dataLength);
    console.log("Rent Exemption Amount is ",{rentExemptionAmount});

}

const createAccountwithSeeds = async () => {
    // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"
    )
  );

  // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
  const base = Keypair.fromSecretKey(
    bs58.decode(
      "4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"
    )
  );

  let basePubkey = base.publicKey;
  let seed = "nish001";
  let programId = SystemProgram.programId;

  let derived = await PublicKey.createWithSeed(basePubkey, seed, programId);

  const createAccountTx = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: feePayer.publicKey, // funder
      newAccountPubkey: derived,
      basePubkey: basePubkey,
      seed: seed,
      lamports: 1e8, // 0.1 SOL
      space: 0,
      programId: programId,
    })
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, createAccountTx, [
      feePayer,
      base,
    ])}`
  );

  console.log("Derived public key for the account : ", derived.toBase58());

  // Transfer

  const transferTx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: derived,
      basePubkey: basePubkey,
      toPubkey: Keypair.generate().publicKey, // create a random receiver
      lamports: 0.01 * LAMPORTS_PER_SOL,
      seed: seed,
      programId: programId,
    })
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, transferTx, [
      feePayer,
      base,
    ])}`
  );

}

const generatePDA = async () => {
  const programId = new PublicKey(
    "G1DCNUQTSGHehwdLCAmRyAG8hf51eCHrLNUqkgGKYASj"
  );

  let [pda, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("test")],
    programId
  );

  console.log(`bump: ${bump}, pubkey: ${pda.toBase58()}`);
}



(async()=>{
    // createSystemAccount();
    // calculateAccountCost();
    // createAccountwithSeeds();
})()