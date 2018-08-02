const SHA265 = require('crypto-js/sha256')
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(createdAt, transactions, previousHash = '') {
        this.createdAt = createdAt;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA265(this.index + this.previousHash + this.createdAt + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined", this.hash);
    }
}
class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningRewards = 100;
    }
    createGenesis() {
        return new Block("01/01/2018", "inception", "0");
    }
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardsAddress) {
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty)
        console.log("BLoCk SUccessFUlly MIned");
        this.chain.push(block);
        this.pendingTransaction = [new Transaction(null, miningRewardsAddress, this.miningRewards)];
    }
    createTransaction(transaction) {
        this.pendingTransaction.push(transaction);
    }
    getBalanceAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
let newCoin = new BlockChain();
newCoin.createTransaction(new Transaction('address1', 'address2', 100));
newCoin.createTransaction(new Transaction('address2', 'address1', 50));
console.log("MIning blocks!@########@!@");
newCoin.minePendingTransactions('nadeem-address');
console.log("balance now", newCoin.getBalanceAddress('nadeem-address'));
newCoin.minePendingTransactions('nadeem-address');
console.log("balance update ROTO", newCoin.getBalanceAddress('nadeem-address'));
// console.log(JSON.stringify(newCoin,null,4));
// console.log("is chain valid "+newCoin.isChainValid());