<script>
	import axios from 'axios';
	import { fly } from 'svelte/transition';

	import Loading from '../components/Loading.svelte';
	import Tooltip from '../components/Tooltip.svelte';

	import { screams, authenticated, urlApi, userData, userLikes } from '../stores/store.js';

	
	export let screamId;
	let closeModal = false;
	let modalActions = false;
	
	let deleteLoading = false;
	let deleteScreamMessage;
	const deleteScream = async (screamId) => {
		modalActions = false
		deleteLoading = true;
		try {
			deleteScreamMessage = 'Eliminando Scream... ';
			await axios.delete(`${urlApi}/scream/${screamId}`);
			$screams = $screams.filter( scream => scream.screamId !== screamId);
			deleteScreamMessage = 'Scream eliminado correctamente ';
			setTimeout(() => {
				deleteLoading = false;
			}, 3000)

		}
		catch(err){
			console.log(err)
			deleteScreamMessage = 'Ocurrio un Error';
			setTimeout(() => {
				deleteLoading = false;
			}, 3000)
		}
	}
</script>

<button class="delete" on:click={() => modalActions = true}>
	<Tooltip icon="fas fa-trash-alt" message="Eliminar Scream"/>
</button>
{#if modalActions}
<div class="dialog-delete" >
	<div class="close-modal"></div>
	<div class="dialog-content" transition:fly={{ y: -50, duration: 500 }}>
		<h4>¿Estas seguro que quieres eliminar este Scream?</h4>
		<div class="actions-delete">
			<button class="del" on:click={() => modalActions = false}>cancel</button>
			<button class="conf" on:click={() => deleteScream(screamId)}>confirmar</button>
		</div>
	</div>
</div>
{/if}

{#if $authenticated && deleteLoading}
	<div class="deleting"  transition:fly={{ y: -50, duration: 500 }}>
		{deleteScreamMessage} <Loading/>
	</div>
	{/if}

<style>
		.delete {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border-style: none;
		background: none;
	}

	.dialog-delete {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		background: transparent;
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

	.dialog-content {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #1D6AA4;
		width: 500px;
		height: 160px;
		border-radius: 8px;
		padding: 10px;
	}

	.actions-delete{
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.actions-delete button {
		font-size: 1.2em;
		padding: 10px 20px;
		color: #fff;
		border-radius: 10px;
		margin: 10px;
		border-style: none;
		cursor: pointer;
	}

	.actions-delete .del {
		background: red;
	}

	.actions-delete .conf {
		background: #5DB3E9;
	}

	.deleting {
		position: fixed;
		font-size: 1em;
		font-weight: bold;
		border-radius: 10px;
		padding: 10px 15px;
		top: 10vh;
		left: 10px;
		width: 400px;
		color: #f2f2f2;
		background: #5DB3E9;
	}
	
	@media (max-width: 520px) {
		.dialog-content {
			font-size: .8em;
			width: 300px;
		}
	}
</style>