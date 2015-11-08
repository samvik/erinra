import {Database, EncryptedDatabase, Password} from './store';
import * as forge from 'node-forge';

export class Crypto {
  private salt : string = "please change me";

  public generateIv() : any {
    return forge.random.getBytesSync(16);
  }

  public generateKey(password : string) : any {
    return forge.pkcs5.pbkdf2(password, this.salt, 40, 16);
  }

  public encrypt(plainText : string, key : any, iv : any) : any {
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(plainText));
    cipher.finish();
    var cipherText = cipher.output.getBytes();
    return cipherText;
  }

  public decrypt(cipherText : string, key : any, iv : any) : any {
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(cipherText));
    decipher.finish();
    var plainText = decipher.output;
    return plainText;
  }

  public encryptPasswordDatabase(db : Database, key : any) : EncryptedDatabase {
    var iv : any = this.generateIv();

    var json : string = JSON.stringify(db.passwords);
    var data : any = this.encrypt(json, key, iv);
    var base64 : string = forge.util.encode64(data);

    var edb : EncryptedDatabase = {
      name: db.name,
      iv: forge.util.encode64(iv),
      passwords: base64
    }
    return edb;
  }

  public decryptPasswordDatabase(edb : EncryptedDatabase, key : any) : Database {
    var db : Database = null;
    try {
      var iv : any = forge.util.decode64(edb.iv);

      var data : any = forge.util.decode64(edb.passwords);
      var json : string = this.decrypt(data, key, iv);
      var passwords : Array<Password> = JSON.parse(json);

      db = {
        name: edb.name,
        passwords: passwords
      }
    }
    catch(e) {
      db = null;
    }
    return db;
  }
}
