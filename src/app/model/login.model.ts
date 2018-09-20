export class LoginObject {
  public username: string;
  public password: string;
  public rememberMe: boolean;

  constructor(object: any) {
    this.username = (object.username) ? object.username : null;
    this.password = (object.password) ? object.password : null;
    this.rememberMe = (object.remember) ? object.remember : false;
  }
}
