//httpServer.js
const express = require("express"); //웹통신을 하기위한 라이브러리
const app = express();
const bodyParser = require("body-parser");
const { getPublicKeyFromWallet, initWallet } = require("./encryption");
const { getBlocks, getVersion, nextBlock } = require("./chainedBlock");
const { addBlock } = require("./checkValidBlock");

const http_port = process.env.HTTP_PORT || 3001;

function initHttpServer() {
  app.use(bodyParser.json());

  app.get("/blocks", (req, res) => {
    res.send(getBlocks());
  });
  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
  });
  // 알려준것
  // curl -H "Content-Type: application/json" --data "{\"data\" : [\"Anything1\",\"Anything2\"]}" http://localhost:3001/mineBlock
  //curl -H "Content-Type: application/json" --data "{\"data\":[\"Anything3\",\"Anything4\"]}" http://localhost:3001/mineBlock | python3 -m json.tool
  app.get("/version", (req, res) => {
    res.send(getVersion());
  });

  // curl -X POST http://localhost:3001/stop -> 메서드
  app.post("/stop", (req, res) => {
    res.send({ msg: "stop Server!" });
    process.exit();
  });

  app.get("/address", (req, res) => {
    const address = getPublicKeyFromWallet().toString();
    if (address != "") {
      res.send({ address: address });
    } else {
      res.send("empty address!");
    }
  });

  app.listen(http_port, () => {
    console.log("Listening Http port" + http_port);
  });
}
initHttpServer();
initWallet();
