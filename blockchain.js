const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Block = require('./Block');
const Transaction = require('./Transaction');

class Blockchain {
     constructor() {
          this.chain = [this.createGenesisBlock()];
          this.pendingTransactions = [];
     }
     createGenesisBlock() {
          return new Block([], '0');
     }
     getLatestBlock() {
          return this.chain[this.chain.length - 1];
     }
     addTransaction(transaction) {
          if (!transaction.fromAddress || !transaction.toAddress) {
               throw new Error('Transaction must include from and to address');
          }
          if (!transaction.isValid()) {
               throw new Error('Cannot add invalid transaction to chain');
          }
          this.pendingTransactions.push(transaction);
     }
     minePendingTransactions(miningRewardAddress) {
          const rewardTx = new Transaction(null, miningRewardAddress, 777);
          this.pendingTransactions.push(rewardTx);
          
          const block = new Block(this.pendingTransactions, this.getLatestBlock().hash);
          this.chain.push(block);
          this.pendingTransactions = [];
     }
     isChainValid() {
          for (let i = 1; i < this.chain.length; i++) {
               const currentBlock = this.chain[i];
               const previousBlock = this.chain[i - 1];
               for (const tx of currentBlock.transactions) {
                    if (!tx.isValid()) {
                         return false;
                    }
               }
               if (currentBlock.hash !== currentBlock.calculateHash() || currentBlock.previousHash !== previousBlock.hash) {
                    return false;
               }
          }
          return true;
     }
     getBalanceOfAddress(address) {
          let balance = 0;
          for (const block of this.chain) {
               for (const trans of block.transactions) {
                    if (trans.fromAddress === address) {
                         balance -= trans.amount;
                    }
                    if (trans.toAddress === address) {
                         balance += trans.amount;
                    }
               }
          }
          return balance;
          }
}
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;