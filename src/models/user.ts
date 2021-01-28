import mongoose from 'mongoose';

interface IUser {
  email: string;
  telefone: string;
  senha: string;
  cpf: string;
}

interface UserModelInterface extends mongoose.Model<any> {
  build(attr: IUser): any
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true
  }
})

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
}

export const User = mongoose.model<any, UserModelInterface>('User', userSchema);

