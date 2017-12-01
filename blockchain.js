'use strict';
var CryptoJS = require("crypto-js");
var request = require("request");
var ip = require("ip");

// A single block in blockchain
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash.toString();
        this.hash = hash.toString();
        this.data = data;
    };
}

/*
    First block in blockchain, used to validate the first block
    in a list of blocks inorder to validate the rest of them
*/

var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "Genesis block, as in first block", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

var blockchain = [getGenesisBlock()];

var getLatestBlock = () => blockchain[blockchain.length -1];

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

var addBlock = (newBlock) => {
    if(isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        //console.log(newBlock);
    }
};

var postBlock = (newBlock, route) => {

    var options = {
        url: 'http://localhost:5005/get_list',
        method: 'GET',
        form: {'ip': ip.address(), 'port': global.port}
    };
    console.log("POSTING LIST ###################")
    request(options, function(error, response, body) {
        console.log(error)
        console.log(response.statusCode)
        if (!error && response.statusCode == 200) {
            console.log("Got here")
            global.list = JSON.parse(body).addressList;
        }
    });

    console.log("sending block");
    console.log(global.list);
    if (global.list != null) {
        for (var i = 0; i < global.list.length; i++) {
            if (global.list[i].port != global.port) {
              console.log("asd" + global.port);
                request({
                    url: "http://" + global.list[i].ip + ":" + global.list[i].port + route,
                    method: "POST",
                    json: true,
                    body: newBlock
                }, function (error, response, body){});
            }
        }
    }
};

var addNewBlock = (data) => {
    var newBlock = generateNextBlock(data);
    addBlock(newBlock);
}

var isValidNewBlock = (newBlock, previousBlock) => {
if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
return true;
};

var isValidChain = (blocksToValidate) => {
    if (JSON.stringify(blocksToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blocksToValidate[0]];
    for (var i = 1; i < blocksToValidate.length; i++) {
        if (isValidNewBlock(blocksToValidate[i], tempBlocks[i - 1])){
            tempBlocks.push(blocksToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
}

var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log("Received blockchain is valid, replacing current blockchain with received one.");
        blockchain = newBlocks;
    } else {
        console.log("Received blockchain is invalid!");
    }
};

module.exports.addNewBlock = addNewBlock;
module.exports.replaceChain = replaceChain;
module.exports.addBlock = addBlock;
module.exports.blockchain = blockchain;
module.exports.generateNextBlock = generateNextBlock;
module.exports.postBlock = postBlock;
module.exports.getLatestBlock = getLatestBlock;
