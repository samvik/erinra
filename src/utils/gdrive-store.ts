import { Injectable } from 'angular2/angular2';
import { GDrive } from './gdrive';

export interface Password {
  title: string;
  username: string;
  password: string;
  url: string;
  note: string;
}

export interface Database {
  name: string;
  passwords: Array<Password>;
}

export interface DatabaseDescription {
  id: string;
  title: string;
  downloadUrl: string;
}

@Injectable()
export class GDriveStore {
  private _gdrive: GDrive = new GDrive();

  public isAuthenticated: boolean = false;
  public databaseList: Array<DatabaseDescription> = [];

  public database: Database;
  public databaseDesc: DatabaseDescription;


  public constructor() {
  }

  public authenticate(immediate: boolean) : Promise<void> {
    return this._gdrive.authenticate(immediate).then(() => {
      this.isAuthenticated = true;
      return null;
    });
  }

  public loadDatabaseList() : void {
    this._gdrive.listAllFiles().then((resp : any) => {
      var databaseList : Array<DatabaseDescription> = [];
      if(resp && resp.items) {
        for(var item of resp.items) {
          databaseList.push(item);
        }
      }
      this.databaseList = databaseList;
    });
  }

  public listDatabases(query : string) : Promise<Array<DatabaseDescription>> {
    return this._gdrive.listFiles(query).then((resp) => {
      return resp.items;
    });
  }

  public createDatabase(name: string, password: string) : Promise<DatabaseDescription> {
    var db = {name: name, passwords: [
      {  title: "facebook",
        username: "netbear",
        password: "My super secret password!",
        url: "https://facebook.com",
        note: "This is my facebook credentials."}
    ]};

    return this._gdrive.createFile(name, JSON.stringify(db)).then((resp) => {
      console.log(resp);
      this.databaseList.push(resp);
      return resp;
    });
  }

  public deleteDatabase(desc: DatabaseDescription) : Promise<void> {
    return this._gdrive.deleteFile(desc.id).then((resp) => {
      console.log("Delete: ", resp);
      this.databaseList = this.databaseList.filter((item) => {
        return item.id != desc.id;
      });
    });
  }

  public loadDatabase(desc: DatabaseDescription) : Promise<Database> {
    this.database = null;

    return this._gdrive.downloadFile(desc.downloadUrl).then((data) => {
      this.database = JSON.parse(data);
      this.databaseDesc = desc;
      return this.database;
    });
  }

  public save() : Promise<DatabaseDescription> {
    return this._gdrive.updateFile(this.databaseDesc.id, this.databaseDesc, JSON.stringify(this.database));
  }

}
