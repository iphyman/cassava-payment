import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";
import { verify } from "jsonwebtoken";
import { User } from "../models/user";

/**
 * Secret should be handled by AWS secret manager
 * hardcoded for simplicity
 */
const JWT_SECRET = "jwtSecretPassword";

export interface CreateUser {
  email: string;
  name?: string;
  password: string;
}

export class UserService {
  /**
   * Create new user record in database
   * @param email
   * @param name
   * @param password
   */
  public createUser = async (props: CreateUser): Promise<any> => {
    const { email, name, password } = props;
    const encryptedPassword = await hash(password, 9);

    const params = {
      userId: uuidv4(),
      name,
      email,
      password: encryptedPassword,
      createdAt: new Date()
    };

    const response = await User.put(params);
    return response;
  };

  /**
   *
   * @param email
   * @returns promise<user|null>
   */
  public getUserByEmail = async (email: string): Promise<any> => {
    const parmas = {
      email,
      sk: "User"
    };

    const response = await User.get(parmas);
    return response;
  };

  /**
   * Get the authorized user from JWT token
   * @param token
   */
  public getUserFromToken = async (token: string): Promise<any> => {
    const decodedToken = verify(token, JWT_SECRET);

    return decodedToken;
  };
}
