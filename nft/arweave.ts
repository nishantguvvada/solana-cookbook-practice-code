import fs from "fs";
import Arweave from "arweave";

const createNft = async () => {

    try{

        const arweave = Arweave.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
            timeout: 20000,
            logging: false
        });

        // const wallet = await arweave.wallets.generate();
        // console.log(wallet);
    
        const data = fs.readFileSync("./op.jpg");
    
        const transaction = await arweave.createTransaction({
            data: data
        });
    
        transaction.addTag("Content-Type", "image/jpeg");

        const wallet = JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))

        const arweaveSignedTx = await arweave.transactions.sign(transaction, wallet);

        console.log("Arweave Signed Tx: ",arweaveSignedTx);
    
        const response = await arweave.transactions.post(transaction);
        console.log(response);
    
        const id = transaction.id
        const imageUrl = id ? `https://arweave.net/${id}` : undefined;
        console.log("imageUrl", imageUrl);

    } catch(err) {

        console.log("Error: ", err);

    }
    
}



(async()=>{
    createNft();
})()