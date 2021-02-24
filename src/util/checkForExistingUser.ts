import { User } from '../models/user';

export const checkForExistingUser = async (userName: string) => {
  const user = await User.find({ userName });

  if (!user || user.length === 0) {
    return null;
  }

  return user[0];
};
