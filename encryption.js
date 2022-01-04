//지갑
//npm i elliptic 설치 
const fs = require("fs")
const ecdsa = require("elliptic")            //타원곡선 디지털 서명 알고리즘 
const console = require("console")
const ec = new ecdsa.ec("secp256k1")         //암호화 명시를 해준다.

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default")
const privateKeyFile = privateKeyLocation + "/private_key"

//비밀키가 겹칠 가능성이 매우매우 희박하다.
//생성을 요청시 무작위로 생성된다.
function generatePrivateKey() {
    const keyPair = ec.genKeyPair(); //두 쌍으로 된키가 나옴 공개키 비밀키
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);          //16진수로 리턴하면 된다 
}

function initWallet(){

    if(fs.existsSync(privateKeyFile)){
        console.log("기존 지갑")
        return
    }
    
    if (fs.existsSync("wallet/")){
        fs.mkdirSync("wallet/")
    }
    if (!fs.existsSync(privateKeyLocation)){
        fs.mkdirSync(privateKeyLocation)
    }

    const newPrivateKey = generatePrivateKey();
    fs.writeFileSync(privateKeyFile, newPrivateKey);
    console.log("새로운 지갑 생성 private key 경로 :" + privateKeyFile);

}



/* 
리눅스 명령어 
env | grep PRIVATE_KEY  - > 환경변수 설정  
cat wallet/private_happy/private_key  -> 실행시키는  명령어
*/

initWallet()

function getPrivateKeyFromWallet(){
    const buffer =  fs.readFileSync(privateKeyFile,"utf8");
    return buffer.toString();
}
// function getPublicKeyFromWallet(){
//     const privateKey = getPrivateKeyFromWallet();
//     const key = ec.keyFromPrivate(privateKey, "hex");
//     return key.getPublic().encode("hex");
// }