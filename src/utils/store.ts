export interface Password {
  id: number; // Timestamp

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

export interface EncryptedDatabase {
  name : string;
  iv : any;
  passwords : string;
};
