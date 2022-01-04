const fs = require("fs")
const merkle = require("merkle")

class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  }
}

class BlockHeader {
  constructor(version, previousHash, timestamp, merkleRoot, bit, nonce) {
    this.version = version;               //버전
    this.previousHash = previousHash;     //이전 블록 해시 
    this.timestamp = timestamp;           //블럭이 만들어진 시간
    this.merkleRoot = merkleRoot;         //머클 해시
    this.bit = bit;                       //채굴 난이도
    this.nonce = nonce;                   //넌스
  }
}

function getVersion() {
  const package = fs.readFileSync("package.json");
  console.log(JSON.parse(package).version);      //npm init 했던 버전을 확인 
  return JSON.parse(package).version;            //버전값을 리턴
}
// getVersion();

function createGenesisBlock() {                  //최초 블럭
  const version = getVersion();
  const previousHash = "0".repeat(64);
  const timestamp = parseInt(Date.now() / 1000);  //parseInt로 변환 밀리세컨드때문에 1000으로나눠주고 저장
  const body = ["ming block"];
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);  //최초의 블럭이기 때문에 이전 해쉬가 없어서 0으로 64자리를 채움
  const bit = 0;
  const nonce = 0;

  console.log(
    "version : %s, timestamp : %d, body : %s", 
    version,
    timestamp,
    body
  );

  console.log("version: %s,timestamp : %d, body : %s", version, timestamp, body)
  console.log("previousHash: %d", previousHash)
  console.log("tree: %s", tree)
  console.log("merkleRoot: %s", merkleRoot)
  
  const header = new BlockHeader(
    version,
    previousHash,
    timestamp,
    merkleRoot,
    bit,
    nonce
  );
  return new Block(header, body);
}

const block = createGenesisBlock();
console.log(block)