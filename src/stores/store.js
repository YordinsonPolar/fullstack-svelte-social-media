import { writable} from 'svelte/store';

export const urlApi = 'https://us-central1-socialape-46c64.cloudfunctions.net/api';

export let authenticated = writable(false);

export let userData = writable({
	handle: "No User Logged",
	website: "Agrega tu sitio web",
	location: "Deja a otros saber de que pais eres",
	createdAt: "No User Logged",
	imageUrl: "No User Logged",
	bio: "Agrega algo a tu biografia",
});
export let userNotifications = writable([]);
export let screamComments = writable([]);
export let userLikes = writable([]);
export let screams = writable([]);



