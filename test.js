const { Blockchain, Transaction } = require('./blockchain'); // импортируйте классы из файла blockchain.js
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Ваши ключи (кошелек)
const myKey = ec.keyFromPrivate('0a32ae1f8e293d3896afc62ffa4441bf798a1473a386eead82933c850bd3a303');
const myWalletAddress = myKey.getPublic('hex');

// Инициализация блокчейна
let simpleCoin = new Blockchain();

// Создание транзакции и её подписание
const tx1 = new Transaction(myWalletAddress, '04583bbdc8d8a7ccee98051189722a96e8a262ba9580005b085ca09861b06b956f8f9290b4520832025ea3fb366941fc238cb340ade173a45101bc31dbeba86da7', 10);
tx1.signTransaction(myKey);
simpleCoin.addTransaction(tx1);

// Майнинг
console.log('Starting mining...');
simpleCoin.minePendingTransactions(myWalletAddress);
console.log(`Balance of my wallet is ${simpleCoin.getBalanceOfAddress(myWalletAddress)}`);

// Проверка валидности блокчейна
console.log('Blockchain valid?', simpleCoin.isChainValid() ? 'Yes' : 'No');
