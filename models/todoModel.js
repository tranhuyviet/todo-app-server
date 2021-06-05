import mongoose from 'mongoose'

const {Schema, model} = mongoose

const todoSchema = new Schema({
    title: {
        type: String,
        required : true
    },
    status: {
        type: Boolean,
        default: false
    }
})

const Todo = model('Todo', todoSchema)
export default Todo