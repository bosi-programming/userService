import { checkForExistingUser } from './checkForExistingUser';


export const validateUser = async (userName: string) => {
  const user = await checkForExistingUser(userName);

  if (!user) {
    throw { message: 'User not found', status: 400 };
  }

  return user;
}

