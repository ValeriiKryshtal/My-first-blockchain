const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
     constructor(fromAddress, toAddress, amount, signature) {
          this.fromAddress = fromAddress;
          this.toAddress = toAddress;
          this.amount = amount;
          this.signature = signature;
     }

     signTransaction(signingKey) {
          if (signingKey.getPublic('hex') !== this.fromAddress) {
               throw new Error('You cannot sign transactions for other wallets!');
               }
          const txHash = this.calculateHash();
          const sig = signingKey.sign(txHash, 'base64');
          this.signature = sig.toDER('hex');
          }

     calculateHash() {
          return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount).digest('hex');
     }

     isValid() {
          if (this.fromAddress === null) return true;
          if (!this.signature || this.signature.length === 0) {
               throw new Error('No signature in this transaction');
          }

          const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
          return publicKey.verify(this.calculateHash(), this.signature);
     }
}

module.exports = Transaction;