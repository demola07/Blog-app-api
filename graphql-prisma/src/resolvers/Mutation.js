import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
		if (args.data.password.length < 8) {
			throw new Error('Password must be 8 characters or longer')
		}

		const hashedPassword = await bcrypt.hash(args.data.password, 12)

		const emailTaken = await prisma.exists.User({ email: args.data.email })

		if (emailTaken) {
			throw new Error('Email taken!!!')
		}

		const user = await prisma.mutation.createUser({
			data: {
				...args.data,
				password: hashedPassword,
			},
		})
		return {
			user,
			token: jwt.sign({ userId: user.id }, 'thisisasecret'),
		}
	},

	async login(parent, args, { prisma }, info) {
		const userExists = await prisma.exists.User({ email: args.data.email })

		if (!userExists) {
			throw new Error('Unable to Login!!!')
		}

		if (args.data.password.length < 8) {
			throw new Error('Unable to login!!!')
		}

		const user = await prisma.query.user({ where: { email: args.data.email } })

		const isPasswordMatch = await bcrypt.compare(
			args.data.password,
			user.password
		)

		if (!isPasswordMatch) {
			throw new Error('Unable to Login!!!')
		}

		return {
			user,
			token: jwt.sign({ userId: user.id }, 'thisisasecret'),
		}
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
