import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db('nextjs-mongodb-demo');

	const { method, body } = req;
	if (method === 'POST') {
		let bodyObject = JSON.parse(body);
		let newPost = await db.collection('posts').insertOne(bodyObject);
		res.json(newPost);
	} else if (method === 'GET') {
		const allPosts = await db.collection('posts').find({}).toArray();
		res.json({ status: 200, data: allPosts });
	}
}
