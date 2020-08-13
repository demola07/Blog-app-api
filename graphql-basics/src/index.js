import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid'

let users = [
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

let posts = [
	{
		id: '11',
		title: 'My first Post',
		body: 'this is my first post using graphql',
		published: true,
		author: '1',
	},
	{
		id: '21',
		title: 'My Secong Post',
		body: 'this is my second post using graphql',
		published: false,
		author: '2',
	},
	{
		id: '31',
		title: 'My third Post',
		body: 'this is my third post using graphql',
		published: true,
		author: '2',
	},
]

let comments = [
	{
		id: '111',
		text: 'First comment',
		author: '1',
		post: '11',
	},
	{
		id: '222',
		text: 'second comment',
		author: '1',
		post: '11',
	},
	{
		id: '333',
		text: 'Third comment',
		author: '2',
		post: '21',
	},
	{
		id: '444',
		text: 'Fourth comment',
		author: '1',
		post: '31',
	},
]

// Type definitions (schema)
const typeDefs = `
    type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments: [Comment!]!
		post: Post!
		me: User!
	}

	type Mutation {
		createUser(data: CreateUserInput!): User!
		deleteUser(id: ID!): User!
		createPost(data: CreatePostInput!): Post!
		deletePost(id: ID!): Post!
		createComment(data: CreateCommentInput!): Comment!
		deleteComment(id: ID!): Comment!
	}

	input CreateUserInput {
		name: String!
		email: String!
		age: Int
	}

	input CreatePostInput {
		title: String!
		body: String!
		published: Boolean!
		author: ID!
	}

	input CreateCommentInput {
		text: String!
		author: ID!
		post: ID!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!

	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
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
		comments(parent, args, ctx, info) {
			return comments
		},
	},

	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => user.email === args.data.email)
			if (emailTaken) {
				throw new Error('Email taken!!!')
			}

			const user = {
				id: uuidv4(),
				...args.data,
			}

			users.push(user)

			return user
		},

		deleteUser(parent, args, ctx, info) {
			const userIndex = users.findIndex((user) => user.id === args.id)
			if (userIndex === -1) {
				throw new Error('User not found')
			}

			const deletedUser = users.splice(userIndex, 1)

			posts = posts.filter((post) => {
				const match = post.author === args.id

				if (match) {
					comments = comments.filter((comment) => comment.post !== post.id)
				}

				return !match
			})

			comments = comments.filter((comment) => comment.author !== args.id)

			return deletedUser[0]
		},

		createPost(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author)
			if (!userExists) {
				throw new Error('User not found!!!')
			}

			const post = {
				id: uuidv4(),
				...args.data,
			}

			posts.push(post)
			return post
		},

		deletePost(parent, args, ctx, info) {
			const postIndex = posts.findIndex((post) => post.id === args.id)
			if (postIndex === -1) {
				throw new Error('Post not found')
			}

			const deletedPost = posts.splice(postIndex, 1)

			comments = comments.filter(
				(comment) => (ismatch = comment.post !== args.id)
			)

			return deletedPost[0]
		},

		createComment(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author)
			if (!userExists) {
				throw new Error('User not found!!!')
			}

			const postExists = posts.some(
				(post) => post.id === args.data.post && post.published
			)

			if (!postExists) {
				throw new Error('Post not found')
			}

			const comment = {
				id: uuidv4(),
				...args.data,
			}

			comments.push(comment)
			return comment
		},

		deleteComment(parent, args, ctx, info) {
			const commentIndex = comments.findIndex(
				(comment) => comment.id === args.id
			)
			if (commentIndex === -1) {
				throw new Error('Comment not found')
			}

			const deletedComment = comments.splice(commentIndex, 1)

			return deletedComment[0]
		},
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id
			})
		},
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id
			})
		},
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => {
				return post.id === parent.post
			})
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
