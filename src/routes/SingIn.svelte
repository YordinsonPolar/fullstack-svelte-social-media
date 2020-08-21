<script>
	import axios from 'axios';
	import { createForm } from "svelte-forms-lib";
	import * as Yup from 'yup';
	import router from 'page';
	import { fly } from 'svelte/transition';

	import Loading from '../components/loading.svelte';

	import { authenticated , urlApi } from '../stores/store.js';
	
	let inputFocus;
	let loading = false;

	let networkError;

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
			.max(64, "Email debe ser de 64 characteres maximo ")
			.email("Ingresa un Email valído ")
			.required( "Obligatorio "),

			password: Yup.string()
			.min(7,"La contraseña debe ser de minimo 8 characteres ")
			.max(64,"La contraseña debe ser de maximo 64 characteres ")
			.required("Obligatorio "),
		}),
		onSubmit: async (values) => {
			loading = true;
			try {
				const { data: { token } } = await axios.post(`${urlApi}/login`, values);
				localStorage.setItem('token', `Bearer ${token}`);
				loading = false;
				$authenticated = true;
				router.redirect('/');
			}
			catch(err) {
				loading = false;
				console.log(err);
				const { email, password } = err.response.data;

				if (email) {
					return $errors.email = 'Correo no encontrado, intenta nuevamente';
				}
				if (password) {
					return $errors.password = 'La contraseña no coincide, intenta nuevamente';
				}
			}
		}
	});
</script>

<section class="singin" transition:fly={{ y: 50, duration: 500 }}>
	<form class="form" on:submit={handleSubmit}>
		<h1 class="title">Iniciar Sesion</h1>
		<div class="input-field">
			<input
			required
			type="text"
			name="email"
			on:change={handleChange}
			bind:value={$form.email}/>
			<label>Correo</label>
			<i class="fas fa-envelope"></i>
			{#if $errors.email}
			<small class="error">{$errors.email}<span class="asterisk">*</span></small>
			{/if}
		</div>
		<div class="input-field ">
			<input 
			required
			type="password"
			name="password"
			on:change={handleChange}
			bind:value={$form.password}/>
			<label>Contraseña</label>
			<i class="fas fa-lock"></i>
			{#if $errors.password}
			<small class="error">{$errors.password}<span class="asterisk">*</span></small>
			{/if}
		</div>
		<div class="loading">
			{#if loading }
			<div class="load"><Loading size="30px" loadSize="3px"/></div> 
			{:else}
			<button class="button" type="submit">Iniciar Sesion</button>
			{/if}
		</div>
		<small class="singup">¿No tiene una cuenta? <a href="/SingUp">Registrate!</a></small>
	</form>
</section>

<style>
	.singin {
		font-family: 'poppins';
		padding-top: 18vh;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: grid;
		place-items: center;
	}

	.form {
		border-radius: 15px;
		background: url(/img/bg-perfil.jpg) no-repeat center;
		background-size: cover;
		display: grid;
		place-items: center;
		width: 400px;
		padding: 40px;
		margin-bottom: 100px;
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

	.input-field input {
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
	}

	.input-field label {
		border-radius: 5px;
		padding: 0 3px;
		background: #1D6AA4;
		font-size: 18px;
		pointer-events: none;
		color: #d2d2d2;
		position: absolute;
		top: 7px;
		left: 35px;
		transition: .3s;
	}

	.input-field i{
		font-size: 18px;
		color: #f2f2f2;
		top: 8px;
		left: 0;
		position: absolute;
		transition: .3s;
	}
	
	.input-field input:focus + label,
	.input-field input:valid + label {
		color: #69D5CA;
		left: 32px;
		top: -10px;
		font-size: 12px;
	}

	.input-field input:focus,
	.input-field input:valid {
		border-bottom: 2px solid #69D5CA;
	}
	
	.input-field input:focus ~ i,
	.input-field input:valid ~ i {
		color: #69D5CA;
	}

  input:-webkit-autofill,
	input:-webkit-autofill:hover, 
	input:-webkit-autofill:focus, 
	input:-webkit-autofill:active  {
	    -webkit-box-shadow: 0 0 0 30px #1D6AA4 inset !important;
	}

	input:-webkit-autofill {
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
	
	.singup {
		color: #fff;
		margin-top: 10px;
	}
	
	.singup a{
		color: #69D5CA;
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

	@media (max-width: 520px) {
		.form {
			height: 100%;
		}
	}


</style>