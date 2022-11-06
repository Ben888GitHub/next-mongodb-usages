import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home({ allPosts }) {
	// console.log(allPosts);
	const [postsState, setPostsState] = useState([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);

	// to delete multiple items
	const [selectedItems, setSelectedItems] = useState([]);
	useEffect(() => {
		setPostsState(allPosts.data);
	}, []);

	const handleAddPost = async (e) => {
		setLoading(true);
		const newPost = await fetch(
			'https://next-mongodb-usages.vercel.app/api/posts',
			{
				method: 'POST',
				body: JSON.stringify({
					title: title,
					content: content
				})
			}
		);
		newPost = await newPost.json();
		console.log(newPost);
		setPostsState([
			...postsState,
			{
				title,
				content
			}
		]);
		setTitle('');
		setContent('');
		setLoading(false);
	};

	const handleDeletePost = async (id) => {
		setLoading(true);
		const deletePost = await fetch(
			`https://next-mongodb-usages.vercel.app/api/posts/${id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		deletePost = await deletePost.json();
		console.log(deletePost);
		const removePost = postsState.filter((post) => id !== post._id);
		setPostsState(removePost);

		setLoading(false);
	};

	// console.log(selectedItems);

	const deleteSelectedPosts = async () => {
		// setLoading(true);
		console.log(selectedItems);
		const deletePosts = await fetch(
			`https://next-mongodb-usages.vercel.app/api/delete-posts/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(selectedItems)
			}
		);

		deletePosts = await deletePosts.json();
		console.log(deletePosts);

		const deleteSelected = postsState.filter(
			(post) => !selectedItems.includes(post._id)
		);
		setPostsState(deleteSelected);
		// setLoading(false);
		setSelectedItems([]);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1>NextJS MongoDB</h1>
				<br />
				<div>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<input
						type="text"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<button disabled={loading} onClick={handleAddPost}>
						Add
					</button>
				</div>
				<br />
				{selectedItems.length > 0 && (
					<button onClick={deleteSelectedPosts}>Delete</button>
				)}

				<br />
				{postsState?.map((post, idx) => (
					<div key={idx}>
						<Link href={`/post/${post._id}`}>
							<a>
								<h3>{post.title}</h3>
								<h5>{post.content}</h5>
							</a>
						</Link>
						<input
							style={{ width: 20, height: 20 }}
							type="checkbox"
							onClick={(e) => {
								e.target.checked === true
									? setSelectedItems([...selectedItems, post._id])
									: setSelectedItems(
											selectedItems.filter(
												(selectedItem) => selectedItem !== post._id
											)
									  );
							}}
						/>
						<button
							disabled={loading}
							onClick={() => handleDeletePost(post._id)}
						>
							Delete {post.title}
						</button>
						<br />
						<br />
					</div>
				))}
			</main>
		</div>
	);
}

export const getServerSideProps = async () => {
	const res = await fetch('https://next-mongodb-usages.vercel.app/api/posts', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	let allPosts = await res.json();

	return {
		props: {
			allPosts
		}
	};
};
