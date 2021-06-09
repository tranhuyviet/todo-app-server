import { gql } from 'apollo-server-express';

export default gql`
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
        addTodo(title: String!): Todo!
        deleteTodo(_id: ID!): String!
        updateTodo(_id: ID!, title: String, status: Boolean): Todo!
    }
`;
