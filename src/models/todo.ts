import mongoose from 'mongoose';

enum status {
  'naoIniciado',
  'emProgresso',
  'completo'
}

interface ITodo {
  userId: string;
  nome: string;
  data: Date;
  hora: string;
  status?: status
}

interface TodoModelInterface extends mongoose.Model<any> {
  build(attr: ITodo): any
}

const todoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  }, 
  nome: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['naoIniciado', 'emProgresso', 'completo'],
    required: false
  }
})

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr);
}

export const Todo = mongoose.model<any, TodoModelInterface>('Todo', todoSchema);
