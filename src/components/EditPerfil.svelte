<script>
	import axios from 'axios';
	import { createForm } from "svelte-forms-lib";
	import * as Yup from 'yup';
	import { fly } from 'svelte/transition';

	import Loading from '../components/loading.svelte';
	import Tooltip from '../components/Tooltip.svelte';
	
	import { userData, urlApi } from '../stores/store.js';

	let loading = false;
	let disabled = false;
	$: saved = false;

	export let bio = 'Tu Descripcion personal va aquí';
	export let website = "Agrega tu sitio web"
	export let location = 'Tu ubicacion actual va aquí';

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			bio: "",
			website: "",
			location: "",
		},
		validationSchema: Yup.object().shape({
			bio: Yup.string()
			.max(200, "la biografía debe ser de 140 characteres maximo"),

			website: Yup.string()
			.max(200, "El url del website debe ser de 200 characteres maximo"),

			location: Yup.string()
			.max(64, "la biografía debe ser de 64 characteres maximo")

		}),
		onSubmit: async (values) => {
			loading = true;
			disabled = true;
			try {
				await axios.post('https://us-central1-socialape-46c64.cloudfunctions.net/api/user', values);
				saved = true;
				if (values.website === "") {
					values.website = "Agrega tu sitio web";
				}
				$userData = { ...$userData, ...values}
				loading = false;
				setTimeout(() => {
					modalActions()
					saved = false;
					disabled = false;
				},2000)
			}
			catch(err){
				loading = false;
				console.log(err);
			}
		}
	});

	$form.bio = bio;
	$form.website = website;
	$form.location = location;


	let modal = false;
	const modalActions = () => {
		modal = !modal;
	}
</script>


<button class="btn" on:click={modalActions}>
	<Tooltip message="Editar perfil" icon="fas fa-pen" />
</button>

{#if modal}
	<div class="modal">
		<div class="close-modal" on:click={modalActions}></div>
		<form class="form" on:submit={handleSubmit} transition:fly={{ y: 50, duration: 300 }}>
			<div class="close" on:click={modalActions}>&times;</div>
			<h1 class="title">Editar Perfil</h1>
			<div class="input-container">
				<i class="icon fas fa-edit"/>
				<textarea
				rows='5'
				maxLength="140"
				placeholder="Tu descripcion o biografía" 
				class='input'
				type="text"
				name="bio"
				on:change={handleChange}
				bind:value={$form.bio}/>
				{#if $errors.bio}
				<small class="error">{$errors.bio}</small>
				{/if}
				<p>{$form.bio.length}/140</p>
			</div>

			<div class="input-container">
				<i class="icon fas fa-map-marker-alt"/>
				<input 
				placeholder="Ubicacion actual" 
				class="input" 
				type="text"
				name="location"
				on:change={handleChange}
				bind:value={$form.location}/>
				{#if $errors.location}
				<small class="error">{$errors.location}</small>
				{/if}
			</div>

			<div class="input-container">
				<i class="icon fas fa-share-alt"/>
				<input 
				placeholder="Url de tu website" 
				class="input" 
				type="text"
				name="website"
				on:change={handleChange}
				bind:value={$form.website}/>
				{#if $errors.website}
				<small class="error">{$errors.website}</small>
				{/if}
			</div>

			{#if saved}
			<div class="saved">Se guardo correctamente</div>
			{/if}
			<div class="loading">
				<button class="button" disabled={disabled} type="submit">Confirmar cambios</button>
				{#if loading }
				<div class="load"><Loading size="26px" loadSize="2.5px"/></div> 
				{/if}
			</div>
		</form>
	</div>
{/if}


<style>
	.btn {
		background: none;
		border-style: none;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		z-index: 10000;
	}

	.close-modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.70);
	}

	.icon {
		color: #69D5CA;
		margin-top: 10px;
		width: 100%;
		margin-right: 5px;
	}

	.form {
		font-family: 'poppins';
		position: relative;
		border-radius: 10px;
		padding: 10px;
		background: url('/img/bg-perfil.jpg') no-repeat center;
		background-size: cover;
		width: 500px;
		height: 500px;
		display: grid;
		place-items: center;
	}

	.close {
		font-size: 2.5em;
		background: none;
		border-style: none;
		outline-style: none;
		cursor: pointer;
		padding: 4px;
		margin: 0;
		color: #d2d2d2;
		font-size: 2em;
		position: absolute;
		right: 10px;
		top: 10px;
		border-radius: 5px;
	}

	.title {
		color: #69D5CA;
		font-size: 1.5em;
		margin-bottom: 20px;
	}
	
	.input-container {
		display: grid;
		grid-template-columns: 7% 93%;
		width: 80%;
		margin-right: 10px;
	}

	.input {
		color: #f2f2f2;
		outline-style: none;
		font-size: 1.2em;
		border-style: none;
		padding: 5px 10px;
		background: none;
		border-bottom: 2px solid #5DB3E9;
		margin-bottom: 20px;
		width: 90%;
		resize: none;
	}

	.error{
		display: inline-block;
		color: red;
	}

	.button {
		outline-style: none;
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		color: #fff;
		font-size: 1em;
		padding: 10px;
		border: none;
		border-radius: 25px;
		background: #5DB3E9;
		cursor: pointer;
		transition: .3s;
	}

	.button:hover {
		transform: scale(1.05);
		background: #50A4D9;
	}

	.input-container input::placeholder,
	.input-container textarea::placeholder {
		color: rgb(255,255,255, .4);
	}

	.loading {
		margin-top: 20px;
		position: relative;
		width: 200px;
		height: 45px;
	} 

	.load {
		display: grid;
		place-items: center;
		position: relative;
		background: #1D6AA4;
		width: 100%;
		height: 100%;
	}

	.edit-perfil {
		display: grid;
		place-items: center;
		visibility: hidden;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,.70);
	}

	.saved {
		color: #f2f2f2;
		border-radius: 5px;
		padding: 2px 6px;
		font-size: 16px;
		font-weight: bold;
		background: #50A4D9;
	}

	@media (max-width: 520px) {
		.form {
			font-size: .8em;
			width: 320px;
			height: 70%;
		}
	}
	
</style>