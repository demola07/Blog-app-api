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
		id: '10',
		title: 'My first Post',
		body: 'this is my first post using graphql',
		published: true,
		author: '1',
	},
	{
		id: '20',
		title: 'My Secong Post',
		body: 'this is my second post using graphql',
		published: false,
		author: '2',
	},
	{
		id: '30',
		title: 'My third Post',
		body: 'this is my third post using graphql',
		published: true,
		author: '2',
	},
]

const comments = [
	{
		id: '100',
		text: 'First comment',
		author: '1',
		post: '10',
	},
	{
		id: '200',
		text: 'second comment',
		author: '1',
		post: '10',
	},
	{
		id: '300',
		text: 'Third comment',
		author: '2',
		post: '20',
	},
	{
		id: '400',
		text: 'Fourth comment',
		author: '1',
		post: '30',
	},
]

const db = {
	users,
	posts,
	comments,
}

export { db as default }
