declare var gapi : any;

export class GDrive {
  public isAuthenticated : boolean = false;

  private scope : string = "https://www.googleapis.com/auth/drive.appfolder";
  private apiKey : string = "AIzaSyDzc71edFxFuYd-GKmPzwb2ke5FNuszJMU";
  private clientId : string = "207628766456-2gg0dua0cnvc0a7b4jt5kjqiphh8imi6.apps.googleusercontent.com";

  public authenticate() : Promise<void> {
    var config = {
      "client_id": this.clientId,
      "scope": this.scope,
      "immediate": false
    };

    return new Promise<void>(
      (resolve, reject) => {
        gapi.client.setApiKey(this.apiKey);
        gapi.auth.authorize(config,
          (token : any) => {
            if (token && !token.error) {
              this.isAuthenticated = true;
              resolve();
            }
            else if(token){
              this.isAuthenticated = false;
              reject("Authentication failed: " + token.error.toString);
            }
            else {
              this.isAuthenticated = false;
              reject("Authentication failed: Unknown error.");
            }
          }
        );
      }
    );
  }

  private _loadApi() : Promise<void> {
    return new Promise<any>(
      (resolve, reject) => {
        gapi.client.load('drive', 'v2',
          () => resolve());
      }
    );
  }

  private _listFiles() : Promise<Array<string>> {
    var request = gapi.client.drive.files.list({
      'maxResults': 10,
      'spaces': 'appDataFolder'
    });

    return new Promise<any>(
      (resolve, reject) => {
        gapi.client.load('drive', 'v2',
          () => request.execute((resp) => resolve(resp)));
      }
    );
  }

  public listFiles() : Promise<Array<string>> {
    return this._loadApi().then(this._listFiles)

  }

}
