<script>
	import axios from 'axios';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { fly, fade } from 'svelte/transition';
	dayjs.extend(relativeTime);

	import Loading from '../components/Loading.svelte';
	import ScreamDialog from '../components/ScreamDialog.svelte';
	import DeleteScream from '../components/DeleteScream.svelte';

	import { screams, authenticated, urlApi, userData, userLikes } from '../stores/store.js';

	//Props
	export let screamId;
	export let likeCount;
	export let body;
	export let commentCount;
	export let createdAt;
	export let userHandle;
	export let userImage;
	export let params = {};
	
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
<div class="card" loading="lazy" transition:fade>
	<div class="img-container">
		<a href={`/${userHandle}`}><img class="img" src={ $userData.handle === userHandle ? $userData.imageUrl : userImage} alt={userHandle} /></a>
	</div>
	<div class="data">
		<a href={`/users/${userHandle}`} class="username">{userHandle} <p>Click para ver Perfil</p></a>
		<div class="date">{dayjs(createdAt).fromNow()}</div>
		<div class="body">{body}</div>
		<div class="actions">
			
			{#if $userLikes.find(scream => scream.screamId === screamId)}
				<button  
					on:click={() => unlikeScream(screamId)} 
					class="like"><i class="fas fa-heart"/>{likeCount} Me gusta</button>
			{:else}
				<button 
					on:click={() => likeScream(screamId)} 
					class="unlike" disabled={!$authenticated}><i class="far fa-heart"/>{likeCount} Me gusta</button>
			{/if}
			<button class="comment"><i class="far fa-comment-alt"/>{commentCount} Comentarios</button>
			<div class="screamDialog">
				<ScreamDialog screamId={screamId} userHandle={userHandle} params={params} commentCount={commentCount}/>
			</div>
		</div>
		{#if userHandle === $userData.handle}
		<div class="delete">
			<DeleteScream screamId={screamId} />
		</div>
		{/if}
	</div>
</div>
<style >

	.loading {
		margin-top: 10px;
		width: 100%;	
		display: grid;
		place-items: center;
	}

	.card {
		position: relative;
		margin-top: 20px;
		background: #1D6AA4;
		display: flex;
		width: 100%;
		align-items: center;
		box-shadow: 0px 3px 5px rgba(0,0,0,.5);
		border-radius: 4px; 
		height: 220px;
	}

	.liked {
		color: #69D5CA;
	}

	.img-container {
		margin: 5px;
		border-radius: 50%;
		width: 180px;
		height: 180px;
	}

	.img {
		border-radius: 50%;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.data {
		position: relative;
		color: #fff;
		margin-left: 10px;
		width: 100%;
		height: 100%;
	}

	.data .username {
		position: relative;
		color: var(--secondary);
		text-decoration: none;
		font-size: 1.8em;
	}

	.data .username p {
		width: 180px;
		text-align: center;
		position: absolute;
		top: -15px;
		left: -20px;
		border-radius: 10px;
		padding: 0px 3px;
		background: #50A4D9;
		color: #fff;
		font-size: 14px;
		opacity: 0;
		visibility: hidden;
		transition: 300ms opacity;
	}

	.data .username:hover p {
		opacity: 1;
		visibility: visible;
	}

	.data .date {
		line-height: 0;
		font-weight: bold;
		margin-left: 10px;
		color: #d2d2d0;
		font-size: .7em;
		margin-top: -3px;
	}

	.data .body {
		font-size: .9em;
		margin: 20px;
	}

	.actions {
		position: absolute;
		bottom: 7px;
		left: -5px;
		width: 100%;
	}

	.actions .like {
		color: #69D5CA;
		
	}

	.actions button {
		color: #fff;
		cursor: pointer;
		border-style: none;
		background: none;
		font-size: .7em;
	}

	.actions button i {
		font-size: 1.3em;
		margin-right: 5px;
		margin-left: 4px;
	}

	.actions button:hover {
		color: #69D5CA;
	}

	.actions .screamDialog{
		float: right;
	}


	.delete {
		position: absolute;
		top: 10px;
		right: 10px;
	}
	
	@media (max-width: 520px) {
		.card {
			font-size: 1.1em;
			height: 420px;
			display: flex;
			flex-direction: column;
		}

		.img-container {
			margin: 5px;
			border-radius: 50%;
			width: 120px;
			height: 120px;
		}

		.data {
			display: flex;
			align-items: center;
			flex-direction: column;

		}

		.data .body {
			font-size: .8em;
		}

		.data .actions {
			left: 10px;
		}

		.data .actions .screamDialog {
			margin-right: 20px;
		}

		.delete {
			top: -120px;
		}
	}

</style>