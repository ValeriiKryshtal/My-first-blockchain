const crypto = require('crypto');

class Block {
     constructor(transactions, previousHash = '') {
          this.timestamp = Date.now();
          this.transactions = transactions;
          this.previousHash = previousHash;
          this.hash = this.calculateHash();
     }

     calculateHash() {
          return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions)).digest('hex');
     }
}

module.exports = Block;
