import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
let mdb = mongoose.connection;

if (!mdb){
    console.log('error connecting to db');
} else {
    console.log('Db connected sucessfully!')
}

let Schema = mongoose.Schema;
let todoSchema = new Schema({
    title: String,
    description: String
});

export const Todo = mongoose.model('Todo', todoSchema);