//이 모든 과정을 통틀어서 채굴이라고 한다.

const fs = require('fs')
const merkle = require('merkle')
const cryptojs = require('crypto-js')   //암호화
const random = require('random')


const BLOCK_GENERATION_INTERVAL = 10       // 10초마다 SECOND 블럭이 생성되는 간격
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10  // 10개마다 in block 블럭마다 난이도가 조절되는 간격
//두 값을 가지고 블럭이 생성되는시간 과 실제로 생성되는 시간과 다를 수 있기 때문에 조절해줘야한다.


class Block {
    constructor(header, body) {
        this.header = header
        this.body = body
    }
}

class BlockHeader {
    constructor(version, index, previousHash, timestamp, merkleRoot, bit, nonce) {
        this.version = version                  //버젼
        this.index = index                      //몇번째인지
        this.previousHash = previousHash        //이전블록해시
        this.timestamp = timestamp              //블럭만들어진시간
        this.merkleRoot = merkleRoot            //머클해시
        this.difficulty = difficulty            //채굴난이도
        this.nonce = nonce                      //넌스 
    }
}
function getVersion() {
    const package = fs.readFileSync("package.json")         //package.json 버전 불로오기
    // console.log(JSON.parse(package).version)             //화인해보기  npm init했던 버젼
    return JSON.parse(package).version                      //버전 값 리턴
}
//getVersion()

function creatGenesisBlock() {                          //최초 블럭체인생성
    const version = getVersion()                        //npm init했던 버젼 블러오기
    const index = 0                                     //맨처음이니깐 0
    const previousHash = '0'.repeat(64)                 
    const timestamp = 1231006505                        //2009년01월03일 6:15pm(UTC)비트코인이 최초로 만들어진 시간 //parseInt(Date.now() / 1000);      //parseInt인트로변환해주고 밀리세컨드라서 1000으로나눠주고 저장
    const body = ['hello block']
    const tree = merkle('sha256').sync(body)
    const merkleRoot = tree.root() || '0'.repeat(64) //없으면 
    const difficulty = 0
    const nonce = 0

    // console.log("version: %s,timestamp : %d, body : %s", version, timestamp, body)
    // console.log("previousHash: %d", previousHash)
    // console.log("tree: %s", tree)
    // console.log("merkleRoot: %s", merkleRoot)

    const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, bit, nonce)
    return new Block(header, body)
}
//const block = creatGenesisBlock()
// console.log(block)
let Blocks = [creatGenesisBlock()]

function getBlocks() {
    return Blocks
}

function getLastBlock() {
    return Blocks[Blocks.length - 1] //저번에만든 블럭 불러오는거 -1
}



function createHash(data) {  //date를 인자로 받아서 해시를 만들겟다
    const { version, index, previousHash, timestamp, merkleRoot, bit, nonce } = data.header
    const blockString = version + index + previousHash + timestamp + merkleRoot + bit + nonce
    const hash = cryptojs.SHA256(blockString).toString()

    return hash
}


function calculateHash(version, index, previousHash, timestamp, merkleRoot, 
	difficulty, nonce) {
		const blockString = version + index + previousHash + timestamp + merkleRoot + difficulty + nonce
		const hash = cryptojs.SHA256(blockString).toString()
		return hash
	}


const genesisblock = creatGenesisBlock()   //최초블럭체인
// const testHash = createHash(block) //최초 블럭체인 값을 인자로넣어줌 
console.log(genesisBlock)

function nextBlock(bodyData) {
    const prevBlock = getLastBlock()

    const version = getVersion() //버전가져오기
    const index = prevBlock.header.index + 1 //이전블록 +1
    const previousHash = createHash(prevBlock) //이전블록에 해시값
    const timestamp = parseInt(Date.now() / 1000)
    const tree = merkle('sha256').sync(bodyData)
    const merkleRoot = tree.root() || '0'.repeat(64)
    const difficulty = 0
    // const nonce = 0

    const header = findBlock(version, index, previousHash, timestamp, merkleRoot, difficulty) 
    return new Block(header, bodyData)
}

// const block1 = nextBlock(['tranjactio1'])
// console.log(block1)

function addBlock(bodyData) {       //블럭추가
    const newBlock = nextBlock(bodyData)
    Blocks.push(newBlock)
}

//addBlock(['tranjactio1'])
//addBlock(['tranjactio2'])
//addBlock(['tranjactio3'])
//addBlock(['tranjactio4'])
//addBlock(['tranjactio5', 'tranjactio6', 'tranjactio7'])
//console.log(Blocks)


function replaceChain(newBlock){
    if (isValidChain(newBlock)){
        if((newBlock.length > Blocks.length) || 
        (newBlocks.length === Blocks) && rendom.boolean()){
            Blocks = newBlocks;
            broadcast(responseLatesMsg());
        }

    }

    else{
        console.log("받은 원장에 문제가 있음")
    }
}

function hexToBinary(s){
    //lookup table 이미 메칭이 되어있는 테이블

    //16진수 64자리 수로 들어왔을때 
    const lookupTable = {
        '0' : '0000', '1':'0001','2' : '0010', '3':'0011',
        '4' : '0100', '5':'0101','6' : '0110', '7':'0111',
        '8' : '1000', '9':'1001','A' : '1010', 'B':'1011',
        'C' : '1100', 'D':'1101','E' : '1110', 'F':'1111',
    }
    var ret ="";
    for(var i = 0; i <s.length; i++){
        if (lookupTable[s[i]]){ //
            ret += lookupTable[s[i]];
        }
        else {return null;}
    }
    return ret;

}

function hasMatchesDifficulty(hash, difficulty){
    const hashBinary = hexToBinary(hash.toUpperCase()) //대문자로 바꾸어서 처리해줌
    const requirePrefix = '0'.repeat(difficulty)       //앞자리를 0으로
    return hashBinary.startsWish(requirePrefix)        //앞자리가 requirePrefix로 시작하는 함수가 된다
}

function findBlock(currentVersion, nextIndex, previousHash, nextTimeStamp, 
    merkleRoot, difficulty){
        var nonce = 0;

        while(ture){
            var hash = createHash(currentVersion, nextIndex, previousHash, nextTimeStamp, 
                merkleRoot, difficulty, nonce) 
            if (hasMatchesDifficulty(hash,difficulty)){
                return new BlockHeader(currentVersion, nextIndex, previousHash, nextTimeStamp, 
                    merkleRoot, difficulty, nonce)
            }
            nonce++;  //ture가  아닐경우 넌스값을 1씩 증가해가면서 비교해준다.
        }
    }


function getAdjustDifficulty(blocks){
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock.header.index !== 0 && 
        lastBlock.header.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0){
            return getAdjustDifficulty(lastBlock, blocks);
        } 
    return lastBlock.header.difficulty;
}

    //난이도를 조절하는 함수
function getAdjustDifficulty(lastBlock, blocks){
    const prevAdjustmentBlock = blocks[blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL]  //블럭단위로 난이도가 조절
    const elapsedTime = lastBlock.header.timestamp - prevAdjustmentBlock.header.timestamp;
    const expectedTime = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL; 

    if ( expectedTime / 2 > elapsedTime) {
        return prevAdjustmentBlock.header.difficulty + 1; 
    }
    else if (expectedTime * 2 < elapsedTime){
        return prevAdjustmentBlock.header.difficulty - 1;
    } 
    else {
        return prevAdjustmentBlock.header.difficulty;
    }

}

function getCurrentTimestamp() {
    return Math.round(Date().getTime() / 1000);
}

function isValidTimestamp(newBlock, prevBlock){
    if (newBlock.header.timestamp - prevBlock.header.timestamp > 60)
    return false;
    
    if (getCurrentTimestamp() - newBlock.header.timestamp > 60)
     return false;

    return true;
}


module.exports={
    Blocks, getLastBlock, createHash, nextBlock, addBlock, getVersion, getBlocks
}
