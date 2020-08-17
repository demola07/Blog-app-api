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

	async createComment(parent, args, { prisma }, info) {
		return prisma.mutation.createComment(
			{
				data: {
					text: args.data.text,
					author: {
						connect: {
							id: args.data.author,
						},
					},
					post: {
						connect: {
							id: args.data.post,
						},
					},
				},
			},
			info
		)
	},

	async updateComment(parent, args, { prisma }, info) {
		return prisma.mutation.updateComment(
			{
				where: {
					id: args.id,
				},
				data: args.data,
			},
			info
		)
	},

	async deleteComment(parent, args, { prisma }, info) {
		return prisma.mutation.deleteComment(
			{
				where: {
					id: args.id,
				},
			},
			info
		)
	},
}

export { Mutation as default }