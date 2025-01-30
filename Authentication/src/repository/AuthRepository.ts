import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  IAuthRepository,
  ICreateAccountWithEmailAndPasswordArgs,
  ILoginWithEmailAndPasswordArgs,
} from "./AuthRepository.interface";
import { IUserDatastore } from "../datastore/UserDatastore.interface";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { Exception } from "../../../common/exceptions/Exception";
import { ErrorCode } from "../../../common/exceptions/ErrorCode";
import { LocalizationMessage } from "../../../common/helpers/messages";
import { User } from "../database/entities/User";
import { ILoginResponse } from "../Types/ILogin";
import { COMMON_INVERSIFY_TYPES } from "../../../common/Inversify/InversifyTypes";
import { IMessageBroker } from "../../../common/Services/MessageBroker.interface";

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(INVERSIFY_TYPES.UserDatastore) private userDatastore: IUserDatastore,
    @inject(COMMON_INVERSIFY_TYPES.MessageBroker) private messageBroker: IMessageBroker
  ) {}

  public async loginWithEmailAndPassword({
    email,
    password,
  }: ILoginWithEmailAndPasswordArgs): Promise<ILoginResponse> {
    const userExists = await this.userDatastore.getUserByEmail(email);

    if (!userExists) {
      throw new Exception(
        ErrorCode.Unauthorised,
        LocalizationMessage.errorMessage.badCredentials
      );
    }

    const isCorrectPassword = bcrypt.compareSync(password, userExists.password);
    if (!isCorrectPassword) {
      throw new Exception(
        ErrorCode.Unauthorised,
        LocalizationMessage.errorMessage.badCredentials
      );
    }

    const authToken = jwt.sign(
      {
        id: userExists.id,
        email: userExists.email,
      },
      process.env.JWT_SECRET!
    );

    return {
      user: userExists,
      authToken,
    };
  }

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

    this.messageBroker.publishToQueue('hello', {
      message: "Hello, from authenctication",
    });

    return this.userDatastore.saveUser(newUser);
  }
}
