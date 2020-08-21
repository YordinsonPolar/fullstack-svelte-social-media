<script>
	import axios from 'axios';
	import { urlApi } from '../stores/store.js';
	import dayjs from 'dayjs';
	import { fly } from 'svelte/transition';

	import Loading from '../components/Loading.svelte';
	import Profile from '../components/Profile.svelte';
	import Scream from '../components/Scream.svelte';

	import { userLikes, userData, screams, userNotifications, authenticated } from '../stores/store.js';

	export let params;

	const getUserData = async() => {
		try {
			if ($authenticated) {
				axios.defaults.headers.common['Authorization'] = localStorage.token;
				const { data: { credentials, likes, notifications } } = await axios.get(`${urlApi}/user/`);
				$userData = credentials;
				$userLikes = likes;
				$userNotifications = notifications;
			}
			const { data } = await axios.get(`${urlApi}/user/${params.handle}`);
			$screams = data.screams;
			return data;
		}catch(err){
			console.log(err);
		}
	}

</script>

<section class="home">
	<div class="container">
		{#await getUserData()}
		<div class="loading">
			<Loading size="64px" loadSize="2px"/>
		</div>
		{:then data}
		<div class="screams" transition:fly={{ x: -50, duration: 500 }}>
			{#each $screams as screamData}
				<div class="scream">
					<Scream {...screamData} params={params}/>
				</div>
			{:else}
				<h2>Este usuario no tiene Screams</h2>
			{/each}
		</div>
		<div class="profile">
			<div class="user-data">
				<div class="image-container">
					<img class="image" src={data.user.imageUrl} alt={data.user.imageUrl}/>
				</div>
				<div class="user-info">
						<p class="username">@{data.user.handle}</p>
					{#if data.user.bio}
						<p class="bio">{data.user.bio}</p>
					{/if}
					{#if data.user.location}
						<p class="location"><i class="icon fas fa-map-marker-alt"/>{data.user.location}</p>
					{/if}
					{#if data.user.website}
						<a class="website" href={data.user.website} title={data.user.website}><i class="icon fas fa-share-alt"/>{data.user.website}</a>
					{/if}
					<p class="createdAt"><i class="icon far fa-calendar"/>Registrado: {dayjs(data.user.createdAt).format('DD/MM/YYYY') }</p>
				</div>
			</div>
		</div>
		{:catch error}
			<h2>Error Del servidor</h2>
		{/await}
	</div>
</section>



<style>
	
	.home {
		font-family: 'poppins';
		margin-top: 9vh;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	} 
	
	.loading {
		width: 100%;
		display: grid;
		place-items: center;
	}


	.container {
		position: relative;
		margin: 0 auto;
		width: 90%;
		display: grid;
		grid-template-columns: 3.5fr 1fr;
		grid-gap: 20px;
	}

	.profile {
		display: grid;
		place-items: center;
		min-width: 350px;
		padding: 20px;
		background: url(/img/bg-perfil.jpg) no-repeat center;
		background-size: cover;
		border-radius: 10px;
		box-shadow: 0px 3px 5px rgba(0,0,0,.5);
		max-height: 80vh;
	}
	
	.icon {
		margin-right: 8px;
	}

	.container {
		margin-top: 10px;
		position: relative;
	}
	.user-data {
		width: 100%;
	}

	.image-container {
		position: relative;
		border-radius: 50%;
		margin: 0 auto;
		width: 200px;
		height: 200px;
	} 

	.image-container .image {
		border-radius: 50%;
		width: 100%;
		height: 100%;
	}

	.user-info {
		text-align: center;
		color: #69D5CA;
		position: relative;
		display: grid;
		place-items: center;
	}

	.username {
		font-size: 2em;
		margin-bottom: 16px;
	}

	.bio {
		max-width: 350px;
		color: #fff;
		margin-bottom: 10px;
	}

	.location {
		font-size: 1.4em;
	}

	.website {
		margin-top: 10px;
		color: #69D5CA;
	}

	.createdAt {
		font-size: 1.2em;
		color: #69D5CA;
		margin-top: 10px;
	}

	@media (max-width: 1024px) {
		.container {
			display: grid;
			grid-template-columns: 1fr;
		}

		.profile {
			margin: 0 auto;
			max-width: 320px;
			grid-row-start: 1;
		}
	}

		@media (max-width: 520px) {
		.container {
			width: 90%;
		}
	}


</style>