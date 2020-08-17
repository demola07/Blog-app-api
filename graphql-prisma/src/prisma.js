import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
})

const createPostForUser = async (authorId, data) => {
	const post = await prisma.mutation.createPost(
		{
			data: {
				...data,
				author: {
					connect: {
						id: authorId,
					},
				},
			},
		},
		'{ id }'
	)

	const user = await prisma.query.user(
		{
			where: {
				id: authorId,
			},
		},
		'{ id name email posts { id title published } }'
	)
	return user
}

// createPostForUser('ckdw0lmp700m6074300njrwqi', {
// 	title: 'Great books to read',
// 	body: 'The art of war',
// 	published: true,
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2))
// })

const updatePostForUser = async (postId, data) => {
	const post = await prisma.mutation.updatePost(
		{
			data,
			where: {
				id: postId,
			},
		},
		'{ author { id } }'
	)
	const user = await prisma.query.user(
		{
			where: {
				id: post.author.id,
			},
		},
		'{ id name email posts { id title body published } }'
	)
	return user
}

// updatePostForUser('ckdy9sr1q00750743bu0ll1jg', {
// 	published: true,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2))
// 	})
// 	.catch((err) => console.log(err))
