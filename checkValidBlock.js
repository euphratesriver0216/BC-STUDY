// 블록 구조가 유요한지 확인하는
// 현재 블록의 인덱스가 이전블록의 인덱스보다 1만큼 큰지
// 이전 블록의 해시값과 현재 블록의 이전 해시가 같은지
// 데이터 필드로부터 계산한 머클루트와 블록 헤더의 머클루트가 동일한지
const merkle = require("merkle");
const {
  createHash,
  Blocks,
  getLastBlock,
  nextBlock,
  isValidTimestamp,
} = require("./chainedBlock");

function isValidBlockStructure(block) {
  //블럭에 형태가 맞는지 확인하는 함수
  return (
    typeof block.header.version === "string" && //버전이 스트링인지
    typeof block.header.index === "number" && //그리고 넘버인지
    typeof block.header.previousHash === "string" && //그전 해시값인지
    typeof block.header.timestamp === "number" && //만든시간
    typeof block.header.merkleRoot === "string" && //머클루트
    typeof block.header.difficulty === "number" && //난이도
    typeof block.header.nonce === "number" && //넌스값
    typeof block.body === "object"
  ); //body데이터
}

//새블럭 검증하기
function isValidNewBlock(newBlock, previousBlock) {
  if (isValidBlockStructure(newBlock) === false) {
    //새로운블럭이 잘못만든 실패면
    console.log("잘못된 블럭구조야!");
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    //새로만든 블럭이랑 그전블럭에 인덱스가 같지않은면
    console.log("잘못된 인덱스야@@");
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    //이전해시값 비교
    console.log("ㅈ");
    return false;
  } else if (
    (newBlock.body.length === 0 &&
      "0".repeat(64) !== newBlock.header.merkleRoot) ||
    (newBlock.body.length !== 0 &&
      merkle("sha256").sync(newBlock.body).root() !==
        newBlock.header.merkleRoot)
  ) {
    console.log("Invalid merkleRoot");
    return false;
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
    console.log("Invalid Timestamp");
    return false;
  }
  // else if (
  //   !hashMatchesDifficulty(createHash(newBlock), newBlock.header.difficulty)
  // ) {
  //   console.log("Invalid hash");
  //   return false;
  // }
  return true;
}

//01/03 수업 추가

function isValidChain(newBlocks) {
  if (JSON.stringify(newBlocks[0]) !== JSON.stringify(Blocks[0])) {
    return false;
  }

  var tempBlocks = [newBlocks[0]];
  for (var i = 1; i < newBlocks.length; i++) {
    if (isValidNewBlock(newBlocks[i], tempBlocks[i - 1])) {
      tempBlocks.push(newBlocks[i]);
    } else {
      return false;
    }
  }
  return true;
}

function addBlock(newBlock) {
  if (isValidNewBlock(newBlock, getLastBlock())) {
    Blocks.push(newBlock);
    return true;
  }
  return false;
}
//const block = nextBlock(["new Transaction"]);
//addBlock(block);

// console.log(Blocks);
module.exports = {
  addBlock,
};
