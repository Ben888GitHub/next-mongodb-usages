import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db('nextjs-mongodb-demo');

	const { query, method, body } = req;

	if (method === 'GET') {
		const post = await db
			.collection('posts')
			.findOne({ _id: ObjectId(query.id) });

		res.json({ status: 200, data: post });
	} else if (method === 'DELETE') {
		const deletePost = await db
			.collection('posts')
			.deleteOne({ _id: ObjectId(query.id) });
		res.json({ status: 200, data: deletePost });
	} else if (method === 'PUT') {
		// let bodyObject = JSON.parse(body);
		const updatePost = await db.collection('posts').updateOne(
			{ _id: ObjectId(query.id) },
			{
				$set: {
					title: body.title,
					content: body.content
				}
			}
		);
		res.json({ status: 200, data: updatePost });
	}
}
