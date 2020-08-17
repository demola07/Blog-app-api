const Query = {
	users(parent, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [
					{
						name_contains: args.query,
					},
					{
						email_contains: args.query,
					},
				],
			}
		}

		return prisma.query.users(opArgs, info)
	},
	posts(parent, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [
					{
						title_contains: args.query,
					},
					{
						body_contains: args.query,
					},
				],
			}
		}

		return prisma.query.posts(opArgs, info)
	},
	me() {
		return {
			id: '123098',
			name: 'Ademola',
			email: 'dem@test.com',
			age: 28,
		}
	},
	comments(parent, args, { db }, info) {
		return db.comments
	},
}

export { Query as default }
