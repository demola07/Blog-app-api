import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
		me: User!
		post: Post!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
	}
`

// Resolvers
const resolvers = {
	Query: {
		me() {
			return {
				id: '123098',
				name: 'Ademola',
				email: 'dem@test.com',
				age: 28,
			}
		},
	},
}

const server = new GraphQLServer({
	typeDefs,
	resolvers,
})

server.start(() => {
	console.log('The Server is running')
})
