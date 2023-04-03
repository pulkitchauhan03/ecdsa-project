const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "91f61138fee5272bd8950b2f989ad117c055f8a6": 100, //ec6c25118247ae96fae8801f87f4376499b5bdb1cb5160fb234dcf30059b46c0
  "996d566e2fc7e8a4e48af571c191945c1ee8c761": 50,  //f34ab045da7833a532b3406bc9713821c792d440443465ba12516c71be2e45bf
  "24479cff9fb012fb90dbf53ae9b9838b5dd71527": 75,  //dbd273d1060894b4a7fd2a3802b0f0d1fe579af9d85bc7ec4693366eaea5eb2b
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  const { data, sgn } = req.body;
  const { recipient, amount } = data;

  const hash = hashMessage(JSON.stringify(data));
  const [recoveryBit, ...signature] = hexToBytes(sgn);
  const sign = new Uint8Array(signature);
  const senderKey = secp.recoverPublicKey(hash, sign , recoveryBit);
  const sender = toHex(keccak256(senderKey.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function hashMessage(msg) {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  return hash;
}

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
