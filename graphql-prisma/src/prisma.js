import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
	secret: 'thisismysupersecretpassword',
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
// 	const userExists = await prisma.exists.User({ id: authorId })
// 	if (!userExists) {
// 		throw new Error('User not found!!!')
// 	}

// 	const post = await prisma.mutation.createPost(
// 		{
// 			data: {
// 				...data,
// 				author: {
// 					connect: {
// 						id: authorId,
// 					},
// 				},
// 			},
// 		},
// 		'{ author { id name email posts { id title published } } }'
// 	)
// 	return post.author
// }

// createPostForUser('ckdw0lmp700m6074300njrwqi', {
// 	title: 'Great books to read3',
// 	body: 'The art of war',
// 	published: true,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2))
// 	})
// 	.catch((err) => console.log(err.message))

// const updatePostForUser = async (postId, data) => {
// 	const postExists = await prisma.exists.Post({ id: postId })

// 	if (!postExists) {
// 		throw new Error('Cannot find post')
// 	}

// 	const post = await prisma.mutation.updatePost(
// 		{
// 			data,
// 			where: {
// 				id: postId,
// 			},
// 		},
// 		'{ author { id name email posts { id title body published } } }'
// 	)

// 	return post.author
// }

// updatePostForUser('ckdxh556v00a40743odgh569q', {
// 	published: false,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2))
// 	})
// 	.catch((err) => console.log(err))
