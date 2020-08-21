<script>
	import axios from 'axios';
	import { createForm } from "svelte-forms-lib";
	import * as Yup from 'yup';
	import { fly, fade } from 'svelte/transition';

	import Loading from '../components/loading.svelte';
	import Tooltip from './Tooltip.svelte';
	
	import { authenticated , urlApi, screams } from '../stores/store.js';
	
	let inputFocus;
	let loading = false;

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			body: ""
		},

		validationSchema: Yup.object().shape({
			body: Yup.string()
			.max(300, "El Scream debe ser de 300 characteres maximo ")
			.required( "Obligatorio ")
		}),

		onSubmit: async (value) => {
			loading = true;
			try {
				await axios.post(`${urlApi}/scream`, value);
				const { data } = await axios.get(`${urlApi}/screams`);
				$screams = data;
				$form.body = "";
				loading = false;
				modalActions();
			}
			catch(err) {
				loading = false;
				console.log(err);
			}
		}
	});

	let modal = false;
	const modalActions = () => {
		modal = !modal;
	}
</script>

	<button 
		class="add"
		on:click={modalActions}>
			<i class="fas fa-plus-circle"/>
			<p class="tooltip">Crear Scream</p>
		</button>
		{#if modal}
			<section class="add-scream">
				<div class="close-modal" on:click={modalActions}></div>
				<form class="form" on:submit={handleSubmit} transition:fly={{ y: 50, duration: 300 }}>
					<div class="close" on:click={modalActions}>&times;</div>
					<h2 class="title">Crear Scream</h2>
					<div class="input-field">
						<textarea
						required
						rows='5'
						maxLength="300"
						type="text"
						name="body"
						on:change={handleChange}
						bind:value={$form.body}/>
						<label>Escribe un mensaje</label>
						<i class="fas fa-envelope"></i>
						<small>{$form.body.length}/300</small>
						{#if $errors.body}
						<small class="error">{$errors.body}<span class="asterisk">*</span></small>
						{/if}
					</div>
					<div class="loading">
						{#if loading }
						<div class="load"><Loading size="30px" loadSize="3px"/></div> 
						{:else}
						<button class="button" type="submit">Crear</button>
						{/if}
					</div>
				</form>
			</section>
		{/if}


<style>

	.add {
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

	.add p {
		width: 120px;
		font-size: .7em;
		position: absolute;
		bottom: -18px;
		left: -29px;
		visibility: hidden; 
		opacity: 0;
		transition: opacity 300ms;
	}

	.add:hover p{
		opacity: 1;
		visibility: visible;
	}


	
	.add-scream {
		padding-top: 18vh;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		grid-template-columns: 1fr;
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

	.form {
		position: relative;
		border-radius: 15px;
		background: url(/img/bg-perfil.jpg) no-repeat center;
		background-size: cover;
		display: grid;
		place-items: center;
		width: 600px;
		padding: 40px;
		margin-bottom: 120px;
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
		color: #f2f2f2;
		margin-bottom: 20px;
	}
	
	.input-field {
		width: 100%;
		height: 80px;
		position: relative;
	}

	.input-field textarea {
		padding: 10px;
		font-size: 18px;
		color: #f2f2f2;
		background: none;
		margin-left: 25px;
		width: 90%;
		border-style: none;
		outline-style: none;
		border-bottom: 2px solid #d2d2d2;
		transition: .3s;
		resize: none;
	}

	.input-field label {
		border-radius: 5px;
		padding: 0 3px;
		background: #1D6AA4;
		font-size: 20px;
		pointer-events: none;
		color: #d2d2d2;
		position: absolute;
		top: 7px;
		left: 35px;
		transition: .3s;
	}

	.input-field i{
		font-size: 24px;
		color: #f2f2f2;
		top: 8px;
		left: 0;
		position: absolute;
		transition: .3s;
	}
	
	.input-field textarea:focus + label,
	.input-field textarea:valid + label {
		color: #69D5CA;
		left: 32px;
		top: -10px;
		font-size: 12px;
	}

	.input-field textarea:focus,
	.input-field textarea:valid {
		border-bottom: 2px solid #69D5CA;
	}
	
	.input-field textarea:focus ~ i,
	.input-field textarea:valid ~ i {
		color: #69D5CA;
	}

  textarea:-webkit-autofill,
	textarea:-webkit-autofill:hover, 
	textarea:-webkit-autofill:focus, 
	textarea:-webkit-autofill:active  {
	    -webkit-box-shadow: 0 0 0 30px #1D6AA4 inset !important;
	}

	textarea:-webkit-autofill {
    -webkit-text-fill-color: white !important;
	}

	.asterisk {
		color: red;
	}

	.error {
		margin-top: 5px;
		grid-column: 1 / -1;
		color: #f2f2f2;
	}

	.button {
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
		font-family: 'poppins', sans-serif;
		cursor: pointer;
		transition: .3s;
	}

	.button:hover {
		transform: scale(1.05);
		background: #50A4D9;
	}
	
	.loading {
		margin-top: 80px;
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

	@media (max-width: 520px) {
		.add-scream {
			display: flex;
			flex-direction: column;
		}
		.form {
			font-size: .8em;
			width: 320px;
			height: 100%;
		}

		.form .input-field {
			font-size: 1em;
		}
		.form .input-field  textarea {
			font-size: .9em;
		}

		.form .input-field  label {
			font-size: .9em;
		}
	}
</style>