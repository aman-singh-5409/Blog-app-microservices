import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import {
  IAuthRepository,
  ICreateAccountWithEmailAndPasswordArgs,
  ILoginWithEmailAndPasswordArgs,
} from "./AuthRepository.interface";
import { IUserDatastore } from "../datastore/UserDatastore.interface";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { Exception } from "../utils/exceptions/Exception";
import { ErrorCode } from "../utils/exceptions/ErrorCode";
import { LocalizationMessage } from "../utils/messages";
import { User } from "../database/entities/User";

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(INVERSIFY_TYPES.UserDatastore) private userDatastore: IUserDatastore
  ) {}

  public async loginWithEmailAndPassword(
    args: ILoginWithEmailAndPasswordArgs
  ): Promise<void> {}

  public async createAccountWithEmailAndPassword({
    email,
    username,
    password,
  }: ICreateAccountWithEmailAndPasswordArgs): Promise<User> {
    const existingUser = await this.userDatastore.getUserByEmail(email);
    if (existingUser) {
      throw new Exception(
        ErrorCode.Conflict,
        LocalizationMessage.errorMessage.userAlreadyExist
      );
    }

    const hashSalt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, hashSalt);

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;

    return this.userDatastore.saveUser(newUser);
  }
}
