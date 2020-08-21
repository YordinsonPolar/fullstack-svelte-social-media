<script>
	import router from 'page';
	import jwtDecode from 'jwt-decode';

	import NavBar from './components/NavBar.svelte';
	import Home from './routes/Home.svelte';
	import SingIn from './routes/SingIn.svelte';
	import SingUp from './routes/SingUp.svelte';
	import UserPerfil from './routes/UserPerfil.svelte';
	import ErrorPage from './routes/ErrorPage.svelte';

	import { authenticated } from './stores/store.js';

	const token = localStorage.token;
	if (token) {
		const decodedToken = jwtDecode(token);
		if (decodedToken.exp * 1000 < Date.now()) {
			$authenticated = false;
		}
		else{
			$authenticated = true;
		}
	}
	else{
		$authenticated = false;
	}
	
	let page;
	let params;
	

	router('/', () => router.redirect('/Home'));
	router('/Home', () => page = Home);
	router('/SingIn', () => {
		if ($authenticated) router.redirect('/Home');
		page = SingIn;
	});
	router('/SingUp', () => {
		if ($authenticated) router.redirect('/Home');
		page = SingUp;
	});
	router('/users/:handle', (ctx, next) => {
     params = ctx.params
     next()
    }, () => page = UserPerfil
	);

  router('/users/:handle/scream/:screamId', (ctx, next) => {
     params = ctx.params
     next()
    }, 
    () => {
    	if ($authenticated) {
    		page = UserPerfil
    	}
    	else {
    		router.redirect('/SingIn')
    	}
    }
  );
  router('*', () => {
		page = ErrorPage;
	});
  router.start();
	
</script>

<main class="main">
	<div class="bg"/>
	<NavBar/>
	<svelte:component this={page} params={params}/>
</main>

<style>
	.main {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: url(/img/bg.jpg) no-repeat center;
		background-size: cover;
		background-attachment: fixed;
		z-index: -100;
	}
</style>