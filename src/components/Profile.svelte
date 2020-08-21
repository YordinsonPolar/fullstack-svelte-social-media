<script>
	import axios from 'axios';
	import dayjs from 'dayjs';
	import router from 'page';
	
	import Loading from '../components/loading.svelte';
	import EditPerfil from '../components/EditPerfil.svelte';
	import Tooltip from '../components/Tooltip.svelte';

	import { userData, urlApi, authenticated } from '../stores/store.js';

	let display = false;
	export let getUserLoggedData;

	const handleImageChange = async (e) =>{
		const image = e.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		try {
			const data = await axios.post(`${urlApi}/user/image`, formData);
			getUserLoggedData();
		}
		catch(err){
			console.log(err)
		}
	}

	const logout = () => {
		delete localStorage.token;
		$authenticated = false;
		router.redirect('/SingIn');
	}

</script>		
	<div class="container">
		<div class="user-data">
			<div class="image-container">
				<img class="image" src={$userData.imageUrl} alt={$userData.imageUrl}/>
				<div class="tooltip">
					<Tooltip message="Cambiar imagen" icon="fas fa-pen">
						<input type="file" name="file" id="file" class="inputfile" on:change={handleImageChange}  />
						<label for="file"></label>
					</Tooltip>
				</div>
			</div>
			<div class="user-info">
			<a href={`/users/${$userData.handle}`} class="username">@{$userData.handle} <p>Click para ver tus Screams</p></a>
			<p class="bio">{$userData.bio}</p>
			<p class="location"><i class="icon fas fa-map-marker-alt"/>{$userData.location}
			</p>
			<a class="website" href={$userData.website} title={$userData.website}><i class="icon fas fa-share-alt"/>{$userData.website}
		</a>
			<p class="createdAt"><i class="icon far fa-calendar"/>Registrado: {dayjs($userData.createdAt).format('DD/MM/YYYY') }</p>
			</div>
		</div>
		<div class="actions">
			<button class="logout" on:click={logout}>
				<Tooltip icon="fas fa-reply" message="Cerrar Sesión"/>
			</button>
			<div class="edit-perfil">
					<EditPerfil 
						bio={$userData.bio}
						location={$userData.location}
						website={$userData.website}
					/>
			</div>
		</div>
	</div>

<style>
	
	.container {
		margin-top: 10px;
		position: relative;
	}
	.user-data {
		width: 100%;
	}

	.icon {
		margin-right: .8em;
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

	.tooltip {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.tooltip label{
		position: absolute;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		background: transparent;
		cursor: pointer;
	}

	.inputfile {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}

	.user-info {
		text-align: center;
		color: var(--secondary);
		position: relative;
		display: grid;
		place-items: center;
	}

	.username {
		color: var(--secondary);
		text-decoration: none;
		position: relative;
		font-size: 1.8em;
		margin-bottom: 5px;
	}

	.username p {
		width: 240px;
		border-radius: 10px;
		padding: 0px 3px;
		background: #50A4D9;
		color: #fff;
		font-size: 15px;
		position: absolute;
		top: -40px;
		left: -20px;
		visibility: hidden;
		opacity: 0;
		transition: 300ms opacity;
	}

	.username:hover p {
		opacity: 1;
		visibility: visible;
	}

	.bio {
		max-width: 350px;
		color: #fff;
		margin-bottom: 10px;
		font-size: .9em;
	}

	.location {
		font-size: 1.3em;
	}

	.website {
		font-size: .9em;
		margin-top: 10px;
		color: var(--secondary);
	}

	.createdAt {
		font-size: 1.2em;
		color: var(--secondary);
		margin-top: 10px;
	}

	.actions {
		margin-top: 20px;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.actions .logout {
		border-style: none;
		outline: none;
		border-radius: 50%;
	}

	@media (max-width: 1024px) {
		.container {
			font-size: 1em;
		}

		.user-data .image-container {
			width: 150px;
			height: 150px;
		}
	}

</style>