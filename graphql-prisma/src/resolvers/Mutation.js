import { v4 as uuidv4 } from 'uuid'

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.data.email })

		if (emailTaken) {
			throw new Error('Email taken!!!')
		}

		return prisma.mutation.createUser({ data: args.data }, info)
	},

	async updateUser(parent, args, { prisma }, info) {
		const userExists = await prisma.exists.User({ id: args.id })

		if (!userExists) {
			throw new Error('User not found')
		}

		return prisma.mutation.updateUser(
			{
				where: {
					id: args.id,
				},
				data: args.data,
			},
			info
		)
	},

	async deleteUser(parent, args, { prisma }, info) {
		const userExists = await prisma.exists.User({ id: args.id })

		if (!userExists) {
			throw new Error('User not found')
		}

		return prisma.mutation.deleteUser({ where: { id: args.id } }, info)
	},

	async createPost(parent, args, { prisma }, info) {
		const userExists = await prisma.exists.User({ id: args.id })

		if (!userExists) {
			throw new Error('User not found!!!')
		}

		return prisma.mutation.createPost(
			{
				data: {
					...args.data,
					author: {
						connect: {
							id: args.data.author,
						},
					},
				},
			},
			info
		)
	},

	async updatePost(parent, args, { prisma }, info) {
		const postExists = await prisma.exists.Post({ id: args.id })

		if (!postExists) {
			throw new Error('Post not found')
		}

		return prisma.mutation.updatePost(
			{
				data: args.data,
				where: {
					id: args.id,
				},
			},
			info
		)
	},

	async deletePost(parent, args, { prisma }, info) {
		const postExists = await prisma.exists.Post({ id: args.id })

		if (!postExists) {
			throw new Error('Post not found')
		}

		return prisma.mutation.deletePost({ where: { id: args.id } }, info)
	},

	createComment(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author)
		if (!userExists) {
			throw new Error('User not found!!!')
		}

		const postExists = db.posts.some(
			(post) => post.id === args.data.post && post.published
		)

		if (!postExists) {
			throw new Error('Post not found')
		}

		const comment = {
			id: uuidv4(),
			...args.data,
		}

		db.comments.push(comment)
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: 'CREATED',
				data: comment,
			},
		})
		return comment
	},

	updateComment(parent, args, { db, pubsub }, info) {
		const { id, data } = args
		const comment = db.comments.find((comment) => comment.id === id)

		if (!comment) {
			throw new Error('Comment not found')
		}

		if (typeof data.text === 'string') {
			comment.text = data.text
		}

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: 'UPDATED',
				data: comment,
			},
		})

		return comment
	},

	deleteComment(parent, args, { db, pubsub }, info) {
		const commentIndex = db.comments.findIndex(
			(comment) => comment.id === args.id
		)
		if (commentIndex === -1) {
			throw new Error('Comment not found')
		}

		const [deletedComment] = db.comments.splice(commentIndex, 1)

		pubsub.publish(`comment ${deletedComment.post}`, {
			comment: {
				mutation: 'DELETED',
				data: deletedComment,
			},
		})

		return deletedComment
	},
}

export { Mutation as default }
