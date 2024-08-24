import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';

(async () => {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const wallet = Keypair.generate();

    // pub/sub method
    connection.onAccountChange(
        wallet.publicKey,
        (updateAccountInfo, context) => {
            console.log("Updated account info: ", updateAccountInfo),
            'confirmed'
        }
    );
    
})();

