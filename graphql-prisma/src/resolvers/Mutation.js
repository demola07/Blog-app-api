import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateJwt from '../utils/generateJwt'

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
			token: generateJwt(user.id),
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
			token: generateJwt(user.id),
		}
	},

	async updateUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const userExists = await prisma.exists.User({ id: userId })

		if (!userExists) {
			throw new Error('User not found')
		}

		return prisma.mutation.updateUser(
			{
				where: {
					id: userId,
				},
				data: args.data,
			},
			info
		)
	},

	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const userExists = await prisma.exists.User({ id: userId })

		if (!userExists) {
			throw new Error('User not found')
		}

		return prisma.mutation.deleteUser({ where: { id: userId } }, info)
	},

	async createPost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

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
							id: userId,
						},
					},
				},
			},
			info
		)
	},

	async updatePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: { id: userId },
		})

		const isPublished = await prisma.exists.Post({
			id: args.id,
			published: true,
		})

		if (!postExists) {
			throw new Error('Unable to update post')
		}

		if (isPublished && args.data.published === false) {
			await prisma.mutation.deleteManyComments({
				where: {
					post: {
						id: args.id,
					},
				},
			})
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

	async deletePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: { id: userId },
		})

		if (!postExists) {
			throw new Error('Unable to delete Post')
		}

		return prisma.mutation.deletePost({ where: { id: args.id } }, info)
	},

	async createComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.data.post,
			published: true,
		})

		if (!postExists) {
			throw new Error('Unable to find post')
		}

		return prisma.mutation.createComment(
			{
				data: {
					text: args.data.text,
					author: {
						connect: {
							id: userId,
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

	async updateComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: { id: userId },
		})

		if (!commentExists) {
			throw new Error('Unable to update comment')
		}

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

	async deleteComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: { id: userId },
		})

		if (!commentExists) {
			throw new Error('Unable to update comment')
		}

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
