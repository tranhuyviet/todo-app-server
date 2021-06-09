import Todo from '../models/todoModel.js';

export default {
    // QUERY
    Query: {
        // Get all todos
        getTodos: async (_, { offset = 0, limit = 3 }) => {
            try {
                console.log('OFFSET: ', offset, ' - LIMIT: ', limit);
                const total = await Todo.find().countDocuments();
                const hasMore = total - offset - limit > 0 ? true : false;
                const todos = await Todo.find().limit(limit).skip(offset);

                if (!todos) {
                    throw new Error('Can not get any todo');
                }

                const returnTodos = {
                    total,
                    hasMore,
                    todos,
                };

                return returnTodos;
            } catch (error) {
                console.log(error);
            }
        },
    },

    // MUTATION
    Mutation: {
        // add todo
        addTodo: async (_, { title }) => {
            try {
                // const todo = new Todo({
                //     title,
                //     status
                // })

                // await todo.save()
                const todo = await Todo.create({ title, status: false });

                if (!todo) {
                    throw new Error('Add todo error');
                }

                return todo;
            } catch (error) {
                console.log(error);
            }
        },

        // delete todo
        deleteTodo: async (_, { _id }) => {
            try {
                // const todo = await Todo.findById(_id)
                // if(!todo) {
                //     throw new Error('Todo id is not correct !!!')
                // }

                const todo = await Todo.findByIdAndDelete(_id);
                if (!todo) throw new Error('Todo id is not correct');
                // console.log(todo);
                return 'Delete todo is successfull';
            } catch (error) {
                console.log(error);
            }
        },

        // update todo
        updateTodo: async (_, { _id, title, status = false }) => {
            try {
                const existTodo = await Todo.findById(_id);
                if (!existTodo) throw new Error('Todo id is not correct');

                const updatedTodo = await Todo.findByIdAndUpdate(
                    _id,
                    { title, status },
                    { new: true }
                );

                // console.log(updatedTodo);

                return updatedTodo;
            } catch (error) {
                console.log(error);
            }
        },
    },
};
