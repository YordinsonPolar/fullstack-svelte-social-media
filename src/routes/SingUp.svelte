<script>
	import axios from 'axios';
	import { createForm } from "svelte-forms-lib";
	import * as Yup from 'yup';
	import { fly, fade } from 'svelte/transition';
	import router from 'page';

	import { authenticated , urlApi } from '../stores/store.js';

	import Loading from '../components/loading.svelte';

	let loading = false;
	let userCorrectlyCreated = false;
	const { form, errors, state, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: "",
			handle: "",
			password: "",
			confirmPassword: ""
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
			.max(64, "Email debe ser de 64 characteres maximo")
			.email("Ingresa un Email valído ")
			.required( "Obligatorio"),

			handle: Yup.string()
			.min(3, "El usuario debe ser de 3 characteres minimo")
			.max(32, "El usuario debe ser de 32 characteres maximo")
			.required("Obligatorio"),

			password: Yup.string()
			.min(8,"La contraseña debe ser de minimo 8 characteres")
			.max(64,"La contraseña debe ser de maximo 64 characteres")
			.required("Obligatorio*"),

			confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'la contraseña no coincide')
	  	.required("Obligatorio*")
		}),
		onSubmit: async (values) => {
			loading = true;
			try{
				const { data: { token } } = await axios.post(`${urlApi}/singup`, values);
					localStorage.setItem('token', `Bearer ${token}`);
					userCorrectlyCreated = true;
				if (token) {
					const login = await axios.post(`${urlApi}/login`, {
							email: values.email,
							password: values.password
					});
					setTimeout(() => {
						userCorrectlyCreated = false;
						$authenticated = true;
						router.redirect('/');
						loading = false;
					},2000)
				}
			}catch(err){
				loading = false;
				console.log(err);
				const { handle, email } = err.response.data;
				if (handle) {
					$errors.handle = 'El nombre de usuario ya fue registrado';
				}
				if (email) {
					$errors.email = 'El correo ya fue registrado';
				}
			}
		}
	});

</script>

<div class="container">
	
<form class="form" on:submit={handleSubmit} transition:fly={{ y: 50, duration: 500 }} >
	<h1 class="title">Crear una cuenta</h1>
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
		type="text"
		name="handle"
		on:change={handleChange}
		bind:value={$form.handle}/>
		<label>Nombre de usuario</label>
		<i class="fas fa-user"></i>
		{#if $errors.handle}
		<small class="error">{$errors.handle}<span class="asterisk">*</span></small>
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
		<div class="input-field ">
		<input 
		required
		type="password"
		name="confirmPassword"
		on:change={handleChange}
		bind:value={$form.confirmPassword}/>
		<label>Confirmar contraseña</label>
		<i class="fas fa-lock"></i>
		{#if $form.confirmPassword !== $form.password || $form.confirmPassword === ''}
		<small class="error">
			{$errors.confirmPassword}
		</small>
		{/if}
	</div>
	{#if userCorrectlyCreated}
		<small transition:fade class="created">Usuario Creado Correctamente</small>
	{/if}
	<div class="loading">
		{#if loading }
			<div class="load"><Loading size="30px" loadSize="3px"/></div> 
		{:else}
			<button class="button" type="submit">Regitrarse</button>
		{/if}
	</div>
	
	<small class="singup">¿Ya tienes una cuenta? <a href="/SingIn">Iniciar Sesión!</a></small>
</form>
</div>

<style>
	.container {
		font-family: 'poppins';
		margin-top: 10vh;
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
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 400px;
		padding: 40px;
	}

	.title {
		font-size: 24px;
		color: #f2f2f2;
		margin-bottom: 40px;
	}
	
	.input-field {
		width: 100%;
		position: relative;
		height: 80px;
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
		display: block;
		width: 100%;
		grid-column: 1 / -1;
		color: #f2f2f2;
	}

	.button {
		font-weight: bold;
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

	.singup {
		font-size: 14px;
		color: #fff;
		margin-top: 15px;
	}
	
	.singup a{
		color: #69D5CA;
	}

	.created {
		color: #f2f2f2;
		border-radius: 5px;
		padding: 2px 6px;
		font-size: 16px;
		font-weight: bold;
		background: #50A4D9;
	}

</style>