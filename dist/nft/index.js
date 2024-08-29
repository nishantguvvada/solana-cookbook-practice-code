"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const arweave_1 = __importDefault(require("arweave"));
const createNft = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arweave = arweave_1.default.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
            timeout: 20000,
            logging: false
        });
        // const wallet = await arweave.wallets.generate();
        // console.log(wallet);
        const data = fs_1.default.readFileSync("./op.jpg");
        const transaction = yield arweave.createTransaction({
            data: data
        });
        transaction.addTag("Content-Type", "image/jpeg");
        const wallet = JSON.parse(fs_1.default.readFileSync("./wallet.json", "utf-8"));
        const arweaveSignedTx = yield arweave.transactions.sign(transaction, wallet);
        console.log("Arweave Signed Tx: ", arweaveSignedTx);
        const response = yield arweave.transactions.post(transaction);
        console.log(response);
        const id = transaction.id;
        const imageUrl = id ? `https://arweave.net/${id}` : undefined;
        console.log("imageUrl", imageUrl);
    }
    catch (err) {
        console.log("Error: ", err);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    createNft();
}))();
//# sourceMappingURL=index.js.map