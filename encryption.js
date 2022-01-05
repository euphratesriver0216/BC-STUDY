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
  // 프라이빗키 파일이 있으면
  if (fs.existsSync(privateKeyFile)) {
    //파일이 있으면 리턴으로 종료
    console.log("기존 지갑 private key 경로 : " + privateKeyFile);
    return;
  }

  // wallet 폴더가 없으면
  if (!fs.existsSync("wallet/")) {
    // 폴더 만들어~
    fs.mkdirSync("wallet/");
  }
  // wallet 안에 privateKeyLocation이름에 해당하는 폴더가 없으면
  if (!fs.existsSync(privateKeyLocation)) {
    fs.mkdirSync(privateKeyLocation);
  }
  //
  const newPrivateKey = generatePrivateKey();
  fs.writeFileSync(privateKeyFile, newPrivateKey);
  console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile);
}

// 비밀키 생성
function generatePrivateKey() {
  const keyPair = ec.genKeyPair(); // 비밀키가 생성되면 공개키도 같이 쌍으로 생성되게 만듦
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
}

// 지갑의 프라이빗키 가져오는 함수

function getPrivateKeyFromWallet() {
  const buffer = fs.readFileSync(privateKeyFile, "utf8");
  return buffer.toString();
}

// 지갑에서 프라이빗키를 퍼블릭키로 변환해서 가져오는 함수
function getPublicKeyFromWallet() {
  const privateKey = getPrivateKeyFromWallet();
  const key = ec.keyFromPrivate(privateKey, "hex"); //ec.keyFromPrivate  -> ec 자체에 내장된 함수
  return key.getPublic().encode("hex");
}

module.exports = {
  getPublicKeyFromWallet,
  initWallet,
};
