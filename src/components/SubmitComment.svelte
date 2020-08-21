<script>
	import axios from 'axios';
	import { createForm } from "svelte-forms-lib";
	import * as Yup from 'yup';
	import { fly, fade } from 'svelte/transition';

	import Loading from '../components/loading.svelte';
	import Tooltip from './Tooltip.svelte';
	
	import { authenticated , urlApi, screams, screamComments, userData } from '../stores/store.js';
	
	export let screamId = "id";
	let loading = false;
	
	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			body: ""
		},

		validationSchema: Yup.object().shape({
			body: Yup.string()
			.max(200, "El comentario debe ser de 200 characteres maximo ")
			.required( "Obligatorio ")
		}),

		onSubmit: async (value) => {
			loading = true;
			try {
				await axios.post(`${urlApi}/scream/${screamId}/comment`, value);
				$screamComments = [ {  userHandle: $userData.handle, body: value.body , userImage: $userData.imageUrl }, ...$screamComments];
				$screams = $screams.map(scream => {
					if (scream.screamId === screamId) {
						scream.commentCount++;
						return { ...scream }
					}
					else {
						return { ...scream }
					}
				})
				$form.body = "";
				loading = false;
			}
			catch(err) {
				loading = false;
				console.log(err);
			}
		}
	});
</script>

<form class="form" on:submit={handleSubmit} >
	<div class="input-field">
		<textarea
		required
		rows='3'
		maxLength="200"
		type="text"
		name="body"
		on:change={handleChange}
		bind:value={$form.body}/>
		<label>Deja un comentario</label>
		<img src={$userData.imageUrl} alt="perfil">
		<small>{$form.body.length}/200</small>
		{#if $errors.body}
		<small class="error">{$errors.body}<span class="asterisk">*</span></small>
		{/if}
	</div>
	<div class="loading">
		{#if loading }
		<div class="load"><Loading size="30px" loadSize="3px"/></div> 
		{:else}
		<button class="button" type="submit">Comentar</button>
		{/if}
	</div>
</form>
<style>

	.form {
		padding: 10px;
		border-radius: 10px;
		width: 100%;
		background: var(--primary);
		height: 170px;
		margin-bottom: 10px;
	}
	.input-field {
		width: 100%;
		height: 80px;
		position: relative;
	}

	.input-field textarea {
		padding: 15px;
		font-size: 1em;
		color: #f2f2f2;
		background: none;
		margin-left: 90px;
		width: 85%;
		border-style: none;
		outline-style: none;
		border-bottom: 2px solid #d2d2d2;
		transition: 300ms;
		resize: none;
	}

	.input-field label {
		border-radius: 5px;
		padding: 0 3px;
		background: var(--primary);
		font-size: 16px;
		pointer-events: none;
		color: #d2d2d2;
		position: absolute;
		top: 7px;
		left: 85px;
		transition: .3s;
	}

	.input-field img{
		border-radius: 5px;
		width: 80px;
		height: 80px;
		color: #f2f2f2;
		top: 8px;
		left: 0;
		position: absolute;
		transition: .3s;
	}
	
	.input-field textarea:focus + label,
	.input-field textarea:valid + label {
		color: var(--secondary);
		left: 82px;
		top: -5px;
		font-size: .8em;
	}

	.input-field textarea:focus,
	.input-field textarea:valid {
		border-bottom: 2px solid var(--secondary);
	}
	
	.input-field textarea:focus ~ i,
	.input-field textarea:valid ~ i {
		color: var(--secondary);
	}

  textarea:-webkit-autofill,
	textarea:-webkit-autofill:hover, 
	textarea:-webkit-autofill:focus, 
	textarea:-webkit-autofill:active  {
	    -webkit-box-shadow: 0 0 0 30px var(--primary) inset !important;
	}

	textarea:-webkit-autofill {
    -webkit-text-fill-color: white !important;
	}

	.button {
		position: absolute;
		left: 0;
		right: 0;
		display: block;
		width: 100%;
		height: 100%;
		color: #fff;
		font-size: 1em;
		padding: 10px;
		border-style: none;
		border-radius: 25px;
		background: #5DB3E9;
		transition: background, transform 300ms;
	}

	.button:hover {
		transform: scale(1.05);
		background: #50A4D9;
	}
	
	.loading {
    position: relative;
    margin-top: 25px;
    float: right;
    width: 120px;
    height: 35px;
	}

	.load {
		position: relative;
		display: grid;
		place-items: center;
		background: var(--primary);
		width: 100%;
		height: 100%;
	}

	@media (max-width: 520px) {
		.form {
			font-size: .8em;
		}

		.form .input-field textarea{
			width: 220px;
			height: 80px;
			font-size: .9em;
		}
	}

</style>