const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");

class Encryptor {
  constructor() {
    this.saltRounds = 10;
    this.cryptr = new Cryptr("ADCET@12345");
  }
  async hash(key) {
    return await bcrypt.hash(key, this.saltRounds);
  }
  async comapare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  async encrypt(key) {
    return this.cryptr.encrypt(key);
  }
  async decrypt(key) {
    return this.cryptr.decrypt(key);
  }
}

export default new Encryptor();