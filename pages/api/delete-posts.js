import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db('nextjs-mongodb-demo');
	console.log(req.body);
	const { body } = req;

	// let bodyObject = JSON.parse(body);
	const bodyObject = body.map((id) => ObjectId(id));
	console.log(bodyObject);

	const deletePosts = await db.collection('posts').deleteMany({
		_id: {
			$in: bodyObject
		}
	});
	res.json({ status: 200, data: deletePosts });
}
