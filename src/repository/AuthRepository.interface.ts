import { User } from "../database/entities/User";

export interface ILoginWithEmailAndPasswordArgs {
  email: string;
  password: string;
}

export interface ICreateAccountWithEmailAndPasswordArgs {
  username: string;
  email: string;
  password: string;
}

export interface IAuthRepository {
  loginWithEmailAndPassword(
    args: ILoginWithEmailAndPasswordArgs
  ): Promise<void>;
  
  createAccountWithEmailAndPassword(
    args: ICreateAccountWithEmailAndPasswordArgs
  ): Promise<User>;
}
