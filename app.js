import express from 'express';
import mongoose from 'mongoose'
import { Todo } from './db';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
// let mdb = mongoose.connection;

// if (!mdb) {
//   console.log('error connecting to db')
// } else {
//   console.log('Db connected successfully!')
// }

// let Schema = mongoose.Schema;
// let todoSchema = new Schema({
//   title: String,
//   description: String
// });

// const Todo = mongoose.model('Todo', todoSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.post('/api/v1/todos', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required'
    });
  }
  const newTodo = new Todo ({
    title: req.body.title,
    description: req.body.description
  });
  await newTodo.save();
  return res.status(201).send({
    success: 'true',
    message: 'todo added successfully',
    newTodo
  })
});

app.get('/api/v1/todos/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);
  if (todo) {
    return res.status(200).send({
      success: 'true',
      message: 'todo retrieved successfully',
      todo
    });
  } 
  return res.status(404).send({
    success: 'false',
    message: 'todo does not exist',
  });
});

app.delete('/api/v1/todos/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);
  if (todo) {
    await todo.delete()
    return res.status(200).send({
      sucess: 'true',
      message: 'todo deleted'
    })
  }
    
  return res.status(404).send({
    success: 'false',
    message: 'todo not found',
  });
});

app.put('/api/v1/todos/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);
  if (todo) {
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    } else if (!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required',
      });
    }

    todo.title = req.body.title;
    todo.description = req.body.description;
    await todo.save();
    return res.status(200).send({
      success: 'true',
      message: 'todo updated',
      todo
    });
  }

  return res.status(404).send({
    success: 'false',
    message: 'not found'
  });
});


app.get('/api/v1/todos', async (req, res) => {
  const todos = await Todo.find();
  return res.status(200).send({
    sucess: 'true',
    message: 'todos retrieved sucessfully',
    todo: todos
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});