//import '/gapi.js';

declare var gapi : any;

export class GDrive {
  public isAuthenticated : boolean = false;

  private scope : string = "https://www.googleapis.com/auth/drive.appfolder";
  private apiKey : string = "AIzaSyDzc71edFxFuYd-GKmPzwb2ke5FNuszJMU";
  private clientId : string = "207628766456-2gg0dua0cnvc0a7b4jt5kjqiphh8imi6.apps.googleusercontent.com";

  public authenticate(immediate : boolean) : Promise<void> {
    var config = {
      "client_id": this.clientId,
      "scope": this.scope,
      "immediate": immediate
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

  private _listFiles(q : string) : Promise<any> {
    var request = gapi.client.drive.files.list({
      'maxResults': 1000,
      'spaces': 'appDataFolder',
      'q': q
    });

    return new Promise<any>(
      (resolve, reject) => {
        gapi.client.load('drive', 'v2',
          () => request.execute((resp) => resolve(resp)));
      }
    );
  }

  public listAllFiles() : Promise<any> {
    return this._loadApi().then(() => this._listFiles(""));
  }

  public listFiles(q : string) : Promise<any> {
    return this._loadApi().then(() => this._listFiles(q));
  }

  public createFile(fileName : string, fileData : string) : Promise<any> {
    var metadata = {
      'title': fileName,
      'mimeType': 'application/octet-stream',
      'parents': [ {id: 'appfolder'} ]
    };
    var multipartRequestBody = this.encodeMultipartBody(metadata, fileData);
    var request = gapi.client.request(
      {
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + this.boundary + '"'
        },
        'body': multipartRequestBody
      });

    return new Promise<any>((resolve, reject) => {
      request.execute((resp) => resolve(resp));
    });
  }

  public updateFile(id: string, metadata: any, data: string): Promise<any> {
    var multipartRequestBody = this.encodeMultipartBody(metadata, data);
    var request = gapi.client.request({
      'path': '/upload/drive/v2/files/' + id,
      'method': 'PUT',
      'params': {'uploadType': 'multipart', 'alt': 'json'},
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + this.boundary + '"'
      },
      'body': multipartRequestBody});

      return new Promise<any>((resolve, reject) => {
        request.execute((resp) => resolve(resp));
      });
  }

  public _deleteFile(fileId : string) : Promise<any> {
    var request = gapi.client.drive.files.delete({
      'fileId': fileId
    });

    return new Promise<any>((resolve, reject) => {
      request.execute((resp) => {
        if(!resp.error) {
          resolve(resp)
        }
        else {
          reject(resp);
        }
      });
    });
  }

  public deleteFile(fileId : string) : Promise<void> {
    return this._loadApi().then(() => this._deleteFile(fileId));
  }

  public downloadFile(url) : Promise<any> {
    var accessToken = gapi.auth.getToken().access_token;

    return new Promise<any>((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      xhr.onload = () => {
        resolve(xhr.responseText);
      };
      xhr.onerror = () => {
        reject("Unable to download file.")
      };
      xhr.send();
    });
  }


  private boundary = '-------314159265358979323846';
  private delimiter = "\r\n--" + this.boundary + "\r\n";
  private close_delim = "\r\n--" + this.boundary + "--";
  private encodeMultipartBody(metaData : any, data : any) : string {
    var base64Data = btoa(data);

    var multipartRequestBody =
    this.delimiter +
    'Content-Type: application/json\r\n' +
    '\r\n' +
    JSON.stringify(metaData) +
    this.delimiter +
    'Content-Type: application/octet-stream\r\n' +
    'Content-Transfer-Encoding: base64\r\n' +
    '\r\n' +
    base64Data +
    this.close_delim;

    return multipartRequestBody;
  }

}
