<script>
	import { fly, fade } from 'svelte/transition';
	import CreateScream from './CreateScream.svelte';
	import Notifications from './Notifications.svelte';
	import Update from './Update.svelte';

	import { authenticated , urlApi, screams } from '../stores/store.js';

</script>
 
<nav class="navbar">
	{#if $authenticated}
		<div class="routes" transition:fly={{ y: -50, duration: 300 }} >
			<div class="button">
				<Update />
			</div>
			<div class="button">
				<CreateScream/>
			</div>
			<div class="button">
				<a href="/Home" class="home"><i class="fas fa-home icon"/><p class="tooltip">Inicio</p></a>
			</div>
			<div class="button">
				<Notifications/>
			</div>
		</div>
	{:else}
		<div class="routes" transition:fade>
			<a class="route" href="/SingIn">Iniciar Sesión</a>
			<a class="route" href="/singUp">Registrarse</a>
		</div>
	{/if}
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		display: grid;
		place-items: center;
		width: 100%;
		height: 55px;
		z-index: 100;
	}

	.routes {	
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color: #f2f2f2;
		background: var(--primary);
	}

	.routes .button {
		border-radius: 50%;
    display: grid;
    place-items: center;
    margin: 5px;
    width: 50px;
    height: 50px;
    background: transparent;
    transition: background 300ms;
	}

	.routes .button:hover {
		background-color: rgba(255,255,255, .3);
	}
	 


	.routes .button i {
		line-height: 50px;
		font-size: 1.5rem;
	}

	.routes .home {
		text-align: center;
		width: 100%;
		height: 100%;
		color: #fff;
		position: relative;
	}

	.routes .home .tooltip {
		font-size: 1em;
		position: absolute;
		bottom: -22px;
		left: 7px;
		opacity: 0;
		visibility: hidden;
		transition: opacity 300ms;
	}

	.routes .home:hover .tooltip {
		opacity: 1;
		visibility: visible;
	}

	.routes .route {
		border-radius: 10px;
		padding: 0px 6px;
		text-decoration: none;
    margin: 5px;
    color: #fff;
    line-height: 50px;
    display: block;
    transition: background 300ms;
	}

	.routes .route:hover {
		background-color: rgba(255,255,255, .3);
	}


</style>
