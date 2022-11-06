import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function Post({ post }) {
	const router = useRouter();

	const [editPost, setEditPost] = useState({
		_id: '',
		title: '',
		content: ''
	});

	useEffect(() => {
		const { _id, title, content } = post.data;
		setEditPost({
			_id: _id,
			title: title,
			content: content
		});
	}, []);

	const handleUpdatePost = async () => {
		console.log(editPost);
		const updatePost = await fetch(
			`https://next-mongodb-usages.vercel.app/api/posts/${editPost._id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: editPost.title,
					content: editPost.content
				})
			}
		);

		updatePost = await updatePost.json();
		console.log(updatePost);
		if (updatePost.status === 200) {
			router.push('/');
		}
	};

	return (
		<div className="container" style={{ textAlign: 'center', margin: 20 }}>
			<h1>{editPost._id}</h1>
			<input
				type="text"
				value={editPost.title}
				onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
			/>
			<br />
			<br />
			<input
				type="text"
				value={editPost.content}
				onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
			/>
			<br />
			<br />
			<button onClick={handleUpdatePost}>Update</button>
		</div>
	);
}

export default Post;

export const getServerSideProps = async (context) => {
	console.log(context);

	const res = await fetch(
		`https://next-mongodb-usages.vercel.app/api/posts/${context.query.id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	let post = await res.json();

	console.log(post);

	return {
		props: {
			post
		}
	};
};

// export const getStaticPaths = () => {
// 	return {
// 		paths: [],
// 		fallback: 'blocking'
// 	};
// };
