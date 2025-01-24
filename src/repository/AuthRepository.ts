import { injectable } from "inversify";
import {
  IAuthRepository,
  ICreateAccountWithEmailAndPasswordArgs,
  ILoginWithEmailAndPasswordArgs,
} from "./AuthRepository.interface";

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor() {}

  public async loginWithEmailAndPassword(
    args: ILoginWithEmailAndPasswordArgs
  ): Promise<void> {}

  public async createAccountWithEmailAndPassword(
    args: ICreateAccountWithEmailAndPasswordArgs
  ): Promise<void> {}
}
