import { GraphQLServer } from 'graphql-yoga'

const users = [
	{
		id: '1',
		name: 'Andrew',
		email: 'andrew@test.com',
		age: 27,
	},
	{
		id: '2',
		name: 'Sarah',
		email: 'sarah@test.com',
	},
	{
		id: '3',
		name: 'Mike',
		email: 'mike@test.com',
		age: 36,
	},
]

const posts = [
	{
		id: '1',
		title: 'My first Post',
		body: 'this is my first post using graphql',
		published: true,
	},
	{
		id: '2',
		title: 'My Secong Post',
		body: 'this is my second post using graphql',
		published: false,
	},
	{
		id: '3',
		title: 'My third Post',
		body: 'this is my third post using graphql',
		published: true,
	},
]
// Type definitions (schema)
const typeDefs = `
    type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
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
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users
			}
			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase())
			})
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts
			}
			return posts.filter((post) => {
				return post.title.toLowerCase().includes(args.query.toLowerCase())
			})
		},
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
