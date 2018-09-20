import {User} from './user.model';

export class Session {
  public access_token: string;
  public refresh_token: string;
  public user: User;
  public failed: boolean;
}
