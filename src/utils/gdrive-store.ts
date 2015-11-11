import { Injectable } from 'angular2/angular2';
import { GDrive } from './gdrive';

import {Database, EncryptedDatabase, DatabaseDescription, Password} from  './store';

import {Crypto} from './crypto';

@Injectable()
export class GDriveStore {
  private _gdrive: GDrive = new GDrive();

  public isAuthenticated: boolean = false;
  public databaseList: Array<DatabaseDescription> = [];

  public database: Database;
  public databaseDesc: DatabaseDescription;

  public key: any;

  public constructor() {
  }

  public authenticate(immediate: boolean) : Promise<void> {
    return this._gdrive.authenticate(immediate).then(() => {
      this.isAuthenticated = true;
      return null;
    });
  }

  public loadDatabaseList() : Promise<any> {
    this.databaseList = [];
    return this._gdrive.listAllFiles().then((resp : any) => {
      var databaseList : Array<DatabaseDescription> = [];
      if(resp && resp.items) {
        for(var item of resp.items) {
          databaseList.push(item);
        }
      }
      this.databaseList = databaseList;
      return this.databaseList;
    });
  }

  public listDatabases(query : string) : Promise<Array<DatabaseDescription>> {
    return this._gdrive.listFiles(query).then((resp) => {
      return resp.items;
    });
  }

  public createDatabase(name: string, password: string) : Promise<DatabaseDescription> {
    var db : Database = {name: name, passwords: [
      {
        id: Date.now(),
        title: "example",
        username: "erinra",
        password: "my_password",
        url: "https://erinra.samvik.se",
        note: "I use erinra to store all my passwords."}
    ]};

    var crypto : Crypto = new Crypto;
    var key = crypto.generateKey(password);
    var encDatabase : EncryptedDatabase = crypto.encryptPasswordDatabase(db, key);

    return this._gdrive.createFile(name, JSON.stringify(encDatabase)).then((resp) => {
      this.databaseList.push(resp);
      return resp;
    });
  }

  public deleteDatabase(desc: DatabaseDescription) : Promise<void> {
    return this._gdrive.deleteFile(desc.id).then((resp) => {
      this.databaseList = this.databaseList.filter((item) => {
        return item.id != desc.id;
      });
    });
  }

  public loadDatabase(desc: DatabaseDescription, password: string) : Promise<Database> {
    this.database = null;

    return this._gdrive.downloadFile(desc.downloadUrl).then((data) => {
      var encDatabase: EncryptedDatabase = JSON.parse(data);
      this.databaseDesc = desc;

      var crypto : Crypto = new Crypto;
      this.key = crypto.generateKey(password);
      var database: Database = crypto.decryptPasswordDatabase(encDatabase, this.key);
      if(database != null) {
        this.database = database;
        return this.database;
      }
      else {
        return Promise.reject<Database>("Decryption failed, did you enter the correct password?");
      }
    });
  }

  public unloadDatabase(): void {
    this.database = null;
    this.databaseDesc = null;
    this.key = null;
  }

  public save() : Promise<DatabaseDescription> {
    var crypto : Crypto = new Crypto;
    var encDatabase : EncryptedDatabase = crypto.encryptPasswordDatabase(this.database, this.key);
    return this._gdrive.updateFile(this.databaseDesc.id, this.databaseDesc, JSON.stringify(encDatabase));
  }

}
