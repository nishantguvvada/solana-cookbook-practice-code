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
const js_1 = require("@metaplex-foundation/js");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = __importDefault(require("fs"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const SOLANA_CONNECTION = new web3_js_1.Connection("https://solana-devnet.g.alchemy.com/v2/Pi3BFwOKfKcCPWxG0ByR0lRHOJw9LAkn");
    const wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    const fileImg = fs_1.default.readFileSync("./op.jpg");
    const METAPLEX = js_1.Metaplex.make(SOLANA_CONNECTION)
        .use((0, js_1.keypairIdentity)(wallet))
        .use((0, js_1.irysStorage)({
        address: 'https://devnet.bundlr.network',
        providerUrl: "https://solana-devnet.g.alchemy.com/v2/Pi3BFwOKfKcCPWxG0ByR0lRHOJw9LAkn",
        timeout: 60000,
    }));
    const imageMetaplexFile = (0, js_1.toMetaplexFile)(fileImg, "abc");
    console.log("image Metaplex file", imageMetaplexFile);
    const imageUri = yield METAPLEX.storage().upload(imageMetaplexFile);
    console.log("image uri", imageUri);
}))();
//# sourceMappingURL=nft.js.map