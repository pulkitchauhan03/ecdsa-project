const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

// const privateKey = secp.utils.randomPrivateKey();
const privateKey = "ec6c25118247ae96fae8801f87f4376499b5bdb1cb5160fb234dcf30059b46c0";

console.log(utf8ToBytes(privateKey));

// const publicKey = secp.getPublicKey(utf8ToBytes(privateKey));

// const addr = keccak256(publicKey.slice(1)).slice(-20);

// console.log(`Private key: ${toHex(privateKey)}`);
// console.log(`Address: ${toHex(addr)}`);