
<script>
	import axios from 'axios';

	import { urlApi, screams, userNotifications, authenticated } from '../stores/store.js'

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

	const getNotifications = async () => {
		if ($authenticated) {
			axios.defaults.headers.common['Authorization'] = localStorage.token;
			const { data: { notifications }} = await axios.get(`${urlApi}/user`);
			if(notifications) {
				$userNotifications = notifications;
			}
			else{
				throw Error('Error Interno');
			}
		}
	}

</script>


<button on:click={getNotifications} on:click={getScreams} href="/Home" class="update"><i class="fas fa-sync-alt icon"/><p class="tooltip">Actualizar</p></button>


<style>
 .update {
		position: relative;
		width: 100%;
		height: 100%;
		background: none;
		color: #fff;
		font-size: 1.5em;
		border-style: none;
		cursor: pointer;
		border-radius: 50%;
		transition: background 300ms;
	}

	.update p {
		width: 120px;
		font-size: .7em;
		position: absolute;
		bottom: -20px;
		left: -32px;
		visibility: hidden; 
		opacity: 0;
		transition: opacity 300ms;
	}

	.update:hover p{
		opacity: 1;
		visibility: visible;
	}
</style>