import mongoose from 'mongoose';
import { decrypt } from './util/encryption';

const url = decrypt(
  `rEHsfbNLpwcGrxiRqUc8odqlSRRYsy9uAJOUXBwW0r6bX1QA9iaqQi2zJWQFYnt5hIlNiThpftpyW/J2sGGekhYeGOeBeHWE73hUpiPV4waDBvWxeieknQw3DKqF6tdnverGwGxC8KuA4rqDSOA5UpKRrp8dbcmnHzNi1rsukpmjjx049i7VSkYfuok3YWp5itsf/5DQyFESTvV7rEsu5R6HBE4UtVnQkqL211V/xQUcnb7s76TYmhfgxG0PZ8S7qDW5WwqdQpk=`,
);

export const connectToDataBase = () => {
  mongoose.connect(
    url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => {
      console.log('connect to database');
    },
  );
};
