import { gql } from 'apollo-server-express';

export default gql`
    type User {
        _id: ID!
        email: String!
        token: String!
    }

    type Todo {
        _id: ID!
        title: String!
        status: Boolean!
    }

    type ReturnTodos {
        total: Int!
        hasMore: Boolean!
        todos: [Todo]!
    }

    type Query {
        getTodos(offset: Int, limit: Int): ReturnTodos!
    }

    type Mutation {
        # USER
        register(
            email: String!
            password: String!
            confirmPassword: String!
        ): User!
        # TODO
        addTodo(title: String!): Todo!
        deleteTodo(_id: ID!): String!
        updateTodo(_id: ID!, title: String, status: Boolean): Todo!
    }
`;
