<script>
	import axios from 'axios';
	import { fly } from 'svelte/transition';

	import Scream from '../components/Scream.svelte';
	import Profile from '../components/Profile.svelte';
	import Loading from '../components/Loading.svelte';

	import { screams, authenticated, userData, userLikes, userNotifications, urlApi } from '../stores/store.js';
	
	const getUserLoggedData = async () => {
		axios.defaults.headers.common['Authorization'] = localStorage.token;
		const { data: { credentials, likes, notifications }} = await axios.get(`${urlApi}/user`);
		if(credentials) {
			$userData = {...$userData, ...credentials};
			$userLikes = likes;
			$userNotifications = notifications;
			return credentials;
		}
		else{
			throw Error('Error Interno');
		}
	}

	const getScreams = async () => {
		try{
			const { data } = await axios.get(`${urlApi}/screams`);
			if (data) {
				$screams = data;
			}
		}
		catch(err){
			console.log(err);
			throw Error('Opss! Parece que ha ocurrido un error.')
		}
	}
	
</script>


<section class="home">
	<div class="container">
		<div class="screams" transition:fly={{ x: -50, duration: 500 }}>
			{#await getScreams()}
				<div class="loading">
					<Loading size="64px" loadSize="2px"/>
				</div>
			{:then screamData}
				{#each $screams as screamData, i}
					<div class="scream">
						<Scream {...screamData}/>
					</div>
				{:else}
					<h2>No hay Screams para mostrar</h2>
				{/each}
			{:catch error}
				<p>{error}</p>
			{/await}
		</div>
			<div class="profile" transition:fly={{ x: 50, duration: 500 }}>
				{#await getUserLoggedData()}
					<Loading size="64px" loadSize="2px"/>
				{:then}
					<Profile getUserLoggedData={getUserLoggedData}/>
				{:catch error}
					{#if !$authenticated}
					<div class="need-auth"  transition:fly={{ y: -50, duration: 500 }}>
						Inicia sesión o Registrate para crear Screams!
					</div>
					{/if}
					<div class="buttons">
						<a href="/SingIn" >Inicia Sesión</a>
						<a href="/SingUp" >Registrate</a>
					</div>
				{/await}
			</div>
			<h6 class="createdBy">Daniel Vnzla</h6>
	</div>
</section>

<style> 

	.loading {
		width: 100%;
		display: grid;
		place-items: center;
	}
	
	.home {
		font-family: 'poppins';
		margin-top: 80px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
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
		margin-top: 20px;
		font-family: 'poppins';
		display: grid;
		place-items: center;
		min-width: 320px;
		max-width: 450px;
		padding: 20px;
		background: url(/img/bg-perfil.jpg) no-repeat center;
		background-size: cover;
		border-radius: 10px;
		box-shadow: 0px 3px 5px rgba(0,0,0,.5);
		max-height: 600px; 
	}

	.buttons {
		display: flex;

	}

	.buttons a {
		padding: 20px;
    color: #fff;
    text-decoration: none;
    background: #50A4D9;
    font-size: 1em;
    margin: 5px;
    border-radius: 5px;
	}

	.no-auth {
		text-align: center;
	}

	.need-auth {
		position: fixed;
		font-size: 1em;
		font-weight: bold;
		border-radius: 10px;
		padding: 10px 15px;
		top: 60px;
		left: 10px;
		width: 400px;
		color: #f2f2f2;
		background: #5DB3E9;
	}

	@media (max-width: 1024px) {
		.container {
			position: relative;
			display: grid;
			grid-template-columns: 1fr;
		}

		.profile {
			margin: 30px auto 0  auto;
			grid-row-start: 1;
		}
	}

	@media (max-width: 520px) {
		.container {
			width: 90%;
		}
	}

	.createdBy {
		padding: 5px;
		position: fixed;
		right: 0;
		bottom: 0;
	} 

</style>