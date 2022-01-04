//지갑
//npm i elliptic 설치
const fs = require("fs");
const ecdsa = require("elliptic"); //타원곡선 디지털 서명 알고리즘

const ec = new ecdsa.ec("secp256k1"); //암호화 명시를 해준다.

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

//비밀키가 겹칠 가능성이 매우매우 희박하다.
//생성을 요청시 무작위로 생성된다.

//암호화된 파일 만드는 함수
function initWallet() {
  if (fs.existsSync(privateKeyFile)) {
    //파일이 있으면 리턴으로 종료
    console.log("기존 지갑 private key 경로 : " + privateKeyFile);
    return;
  }

  if (!fs.existsSync("wallet/")) {
    fs.mkdirSync("wallet/");
  }
  if (!fs.existsSync(privateKeyLocation)) {
    fs.mkdirSync(privateKeyLocation);
  }

  const newPrivateKey = generatePrivateKey();
  fs.writeFileSync(privateKeyFile, newPrivateKey);
  console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile);
}

function generatePrivateKey() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
}

function getPrivateKeyFromWallet() {
  const buffer = fs.readFileSync(privateKeyFile, "utf8");
  return buffer.toString();
}

function getPublicKeyFromWallet() {
  const privateKey = getPrivateKeyFromWallet();
  const key = ec.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
}
