<script>
	import axios from 'axios';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	
	import Loading from '../components/Loading.svelte';
	import SubmitComment from '../components/SubmitComment.svelte';
	import { urlApi, userLikes, authenticated, screamComments, screams } from '../stores/store.js';

	export let screamId = 'id';
	export let userHandle;
	export let params = {};
	export let commentCount = 0;
	let modal = false;

	const getScream = async (screamId) => {
		try {
			const { data } = await axios.get(`${urlApi}/scream/${screamId}`);
			if (data) {
				$screamComments = data.comments;
				return data;
			}
		}catch(err) {
				console.log(err);
		}
	}
	
	onMount(() => {
		if (screamId === params.screamId) {
			dialogOpen()
		}
	})

	let oldPath = window.location.pathname;
	const newPath = `/users/${userHandle}/scream/${screamId}`
	if (oldPath === newPath) {
		let oldPath = `/users/${userHandle}/`;
	}

	const dialogOpen = () => {
		window.history.pushState(null, null, newPath);
		modal = true;
	}

	const dialogClose = () => {
		window.history.pushState(null, null, oldPath);
		modal = false
	}

	const likeScream = async (screamId) => {
		try {
			const likes = await axios.get(`${urlApi}/scream/${screamId}/like`);
			$userLikes = [ ...$userLikes, { screamId } ];
			$screams = $screams.map((scream) => {
				if (scream.screamId === screamId) {
					scream.likeCount++;
					return { ...scream }
				}
				else {
					return { ...scream}
				}
			})
		}
		catch(err){
			console.log(err)
		}
	}

	const unlikeScream = async (screamId) => {
		try{
			const unlikes = await axios.get(`${urlApi}/scream/${screamId}/unlike`);
			$userLikes = $userLikes.filter(scream => scream.screamId !== screamId);
				$screams = $screams.map((scream) => {
				if (scream.screamId === screamId) {
					scream.likeCount--
					return { ...scream }
				}
				else {
					return { ...scream}
				}
			})
		}
		catch(err){
			console.log(err)
		}
	}

</script>


<button on:click={dialogOpen} class="btn-dialog">
	<i class="fas fa-edit"></i>
	<p>Ver Scream</p>
</button>

 {#if modal}
 	<section class="dialog" transition:fade>
 		<div class="close-modal" on:click={dialogClose} transition:fade/>
		<div class="content">
			{#await getScream(screamId)}
				<div class="loading">
					<Loading size="80px" loadSize="3px"/>
				</div>
			{:then data}
			<div class="perfil">
				<div class="close" on:click={dialogClose}>&times;</div>
				<div class="image">
					<img src={data.userImage} alt={data.userImage} >
				</div>
				<div class="data">
					<a href={`/users/${data.userHandle}`} class="username">{data.userHandle}</a>
					<p class="createdAt">{dayjs(data.createdAt).fromNow()}</p>
					<p class="body">{data.body}</p>
					<div class="actions">
							{#if $userLikes.find(scream => scream.screamId === screamId)}
								<button  
									on:click={() => unlikeScream(screamId)} 
									class="like"><i class="fas fa-heart"/>{data.likeCount--} Me gusta</button>
							{:else}
								<button 
									on:click={() => likeScream(screamId)} 
									class="unlike" disabled={!$authenticated}><i class="far fa-heart"/>{data.likeCount++} Me gusta</button>
							{/if}
								<button class="comment"><i class="far fa-comment-alt"/>{commentCount} Comentarios</button>
					</div>
				</div>
			</div>
				<div class="comments">
					{#if $authenticated}
						<div class="add-comment">
							<SubmitComment screamId={screamId} />
						</div>
					{/if}
					{#each $screamComments as user, index}
						<div class="content" >
							<div class="image">
								<img src={user.userImage} alt={user.userImage}>
							</div>
							<div class="data">
								<a href={`/users/${user.userHandle}`} class="username">{user.userHandle}</a>
								<div class="createdAt">{dayjs(user.createdAt).fromNow()}</div>
								<div class="body">{user.body}</div>
							</div>
						</div>
					{/each}
				</div>
			{:catch error}
				<p>{error}</p>
			{/await}
		</div>
	</section>
 {/if}

<style>
	
	.btn-dialog {
		position: relative;
		color: #fff;
		border-style: none;
		background: none;
		font-size: 1.2em;
		cursor: pointer;
		margin-right: 5px;
	}

	.btn-dialog:hover {
		color: var(--secondary);
	}

	.btn-dialog p {
		padding: 2px 6px;
		background: #50A4D9;
		border-radius: 10px;
		width: 90px;
		color: #fff;
		position: absolute;
		top: -24px;
		left: -30px;
		visibility: hidden;
		font-size: 13px;
		opacity: 0;
		transition: 300ms opacity;
	}

	.btn-dialog:hover p {
		opacity: 1;
		visibility: visible;
	}

	.dialog {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		z-index: 10000;
		display: grid;
		place-items: center;
	}

	.close-modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0, .80);
	}

	.dialog .content {
		position: relative;
	}

	.content {
		width: 768px;
	}

	.content .loading {
		margin-top: 50px;
		width: 100%;
		display: grid;
		place-items: center;
	}

	.content .perfil {
		margin-top: 50px;
		overflow: hidden;
		border-radius: 10px;
		position: relative;
		height: 200px;
		background: var(--primary);
		display: flex;
	}

	.content .close {
		font-size: 2.5em;
		background: none;
		border-style: none;
		outline-style: none;
		cursor: pointer;
		padding: 4px;
		margin: 0;
		color: #f2f2f2;
		font-size: 2em;
		position: absolute;
		right: 5px;
		top: -5px;
		border-radius: 5px;
		z-index: 1000;
	}

	.content .perfil .image img{
		width: 200px;
		height: 200px;
	}

	.content .perfil .data {
		position: relative;
		margin-left: 20px;
		width: 100%;
		height: 100%;
	}

	.content .perfil .data .username {
		text-decoration: none;
		font-size: 2em;
		color: var(--secondary);
	}

	.content .perfil .data .createdAt {
		font-weight: bold;
		color: #d2d2d0;
		font-size: .8em;
		margin-left: 3px;
		line-height: 2px;
	}

	.content .perfil .data .body {
		font-size: .9em;
		margin: 20px 20px 20px 0;
	}

	.content .perfil .data .actions {
		position: absolute;
		bottom: 10px;
		left: 0px;
	}

	.content .perfil .actions .like {
		color: var(--secondary);
		
	}

	.content .perfil .actions button {
		text-align: center;
		color: #fff;
		cursor: pointer;
		border-style: none;
		background: none;
		font-size: .7em;
	}

	.content .perfil .actions button i {
		font-size: 1.3em;
		margin-right: 5px;
		margin-left: 4px;
	}

	.content .perfil .actions button:hover {
		color: #69D5CA;
	}

	.comments{
		padding: 10px;
		position: relative;
		margin-top: 10px;
		overflow: auto;
		height: 450px;
	}

	.comments .content{
		margin-bottom: 10px;
		border-radius: 5px;
		width: 100%;
		background: var(--primary);
		display: flex;
		align-items: center;
		height: 150px;
		overflow: hidden;
	}
	.comments .content .image {
		width: 150px;
		height: 150px;

	}

	.comments .content img {
		border-radius: 5px;
		width: 150px;
		height: 150px;
	}

	.comments .content .data {
		width: 100%;
		height: 100%;
		margin-left: 8px;
	}

	.comments .content .data .username {
		text-decoration: none;
		color: var(--secondary);
		font-size: 1.8em;
	}

	.comments .content .data .createdAt {
		font-weight: bold;
		color: #d2d2d0;
		font-size: .7em;
		margin-left: 1px;
		line-height: 1px;
	}

	.comments .content .data .body {
		margin: 10px 5px 0 5px;
		font-size: .8em;
	} 
	@media (max-width: 520px) {

		.content .perfil {
			width: 360px;
			height: 460px;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.content .perfil .data {
			font-size: .9em;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.comments {
			width: 360px;

		}


		.comments .content {
			font-size: .7em;
			height: 150px;
		}

		.comments .content .image {
			border-radius: 50%;
			overflow: hidden;
			width: 80px;
			height: 80px;
		}

		.comments .content .image img {
			width: 80px;
			height: 80px;
		}

		.comments .content .data .username {
			margin-left: -10px;
		}

		.comments .content .data .body {
			margin: 10px;
			font-size: .9em;
		} 
	}
</style>