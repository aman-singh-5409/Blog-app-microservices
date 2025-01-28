import { User } from "../database/entities/User";

export interface ILoginResponse {
  user: User;
  authToken: string;
}
