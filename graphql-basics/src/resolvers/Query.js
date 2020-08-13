const Query = {
	users(parent, args, { db }, info) {
		if (!args.query) {
			return db.users
		}
		return db.users.filter((user) => {
			return user.name.toLowerCase().includes(args.query.toLowerCase())
		})
	},
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts
		}
		return db.posts.filter((post) => {
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
	comments(parent, args, { db }, info) {
		return db.comments
	},
}

export { Query as default }
