//httpServer.js
const express = require ("express")//웹통신을 하기위한 라이브러리
const bodyParser = require ("body=parser")
const res = require("express/lib/response")

const http_port = prosess.env.HTTP_PORT || 3001


function initHttpServer(){
	const app = express()
        app.use(bodyParser.json())

	app.get("/blocks", (req, res)=>{
		res.send(getBlock())
	}) 
	app.post("/mindBlock", (req, res)=>{
	     const data = req.body.data || []
	     const block = nextBlock(data)
	     addBlock(block) 
	     
	     res.send(block)
	})
	app.get("/version", (req, res)=>{
		res.send(getVersion())
	})
	app.post("/stop", (req,res) =>{
		res.send({"msg":"stop Server!"})
		process.exit()
	})

	app.get("/address",(req,res)=>{
		const address =getPublicKeyFromWallet().toString();
		if(address !=  ""){
		res.send ({"address" : address});	
	    }
	    else {
			res.send("empty address!");
		}
	})

	app.listen(http_port, ()=> {
		console.log("Llisening Http port" + http_port)
	})
	

i]

