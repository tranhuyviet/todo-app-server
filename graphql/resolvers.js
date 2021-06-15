import { UserInputError } from 'apollo-server-express';
import Todo from '../models/todoModel.js';
import User from '../models/userModel.js';
import {
    registerSchema,
    loginSchema,
    validateErrors,
} from '../utils/validateSchema.js';

export default {
    // QUERY
    Query: {
        // USER
        login: async (_, { email, password }) => {
            try {
                // VALIDATE INPUT
                console.log({ email, password });
                let errors = {};
                try {
                    await loginSchema.validate(
                        { email, password },
                        { abortEarly: false }
                    );
                } catch (error) {
                    errors = validateErrors(error);

                    throw new UserInputError('REGISTER ERROR - VALIDATE', {
                        errors,
                    });
                }

                const user = await User.findOne({ email });

                // CHECK EMAIL AND CORRECT PASSWORD
                if (!user || !user.isValidPassword(password)) {
                    errors.global = 'Invalid credentials';
                    throw new UserInputError(
                        'LOGIN ERROR - INVALID CREDENTIALS',
                        { errors }
                    );
                }

                return user.returnAuthUser();
            } catch (error) {
                return error;
            }
        },
        // TODO
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
        // USER
        register: async (_, { email, password, confirmPassword }) => {
            try {
                // VALIDATE INPUT
                console.log({ email, password, confirmPassword });
                let errors = {};
                try {
                    await registerSchema.validate(
                        { email, password, confirmPassword },
                        { abortEarly: false }
                    );
                } catch (error) {
                    errors = validateErrors(error);

                    throw new UserInputError('REGISTER ERROR - VALIDATE', {
                        errors,
                    });
                }

                // CHECK EMAIL IS EXIST
                const userExist = await User.findOne({ email });
                if (userExist) {
                    errors.email = 'This email is already taken';
                    throw new UserInputError('SIGNUP ERROR - EMAIL EXIST', {
                        errors,
                    });
                }

                // CREATE NEW USER
                const user = new User({
                    email,
                });

                // HASH PASSWORD
                user.hashPassword(password);
                await user.save();

                // RETURN USER
                return user.returnAuthUser();
            } catch (error) {
                return error;
            }
        },
        // TODO
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
