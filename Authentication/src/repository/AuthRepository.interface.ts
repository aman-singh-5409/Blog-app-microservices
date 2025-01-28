import { User } from "../database/entities/User";
import { ILoginResponse } from "../Types/ILogin";

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
  ): Promise<ILoginResponse>;
  
  createAccountWithEmailAndPassword(
    args: ICreateAccountWithEmailAndPasswordArgs
  ): Promise<User>;
}
