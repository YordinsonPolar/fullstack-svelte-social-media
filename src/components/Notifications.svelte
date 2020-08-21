<script>
	import axios from 'axios';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	import ScreamDialog from '../components/ScreamDialog.svelte';

	import { userNotifications, screams, urlApi } from '../stores/store.js';

	let handleNotifications = false;
	const closeNotifications = async () => {
		try {
			let notiToMarkRead = [];
			$userNotifications.forEach(noti => {
				if (!noti.read) {
					noti.read = true;
					notiToMarkRead = [ ...notiToMarkRead, noti.notificationId]
				}
			});
			if (notiToMarkRead.length > 0) {
					await axios.post(`${urlApi}/notifications`, { notifications :notiToMarkRead});
					$userNotifications = $userNotifications.map(noti =>{
						noti.read = true
					 return { ...noti }
					})
			}
			handleNotifications = false;
		}
		catch(err){
			console.log(err);
		}


	}

      
</script>

<div class="bell">
	<button class="button" on:click={() => handleNotifications = !handleNotifications}>
		<i class="icon fas fa-bell">
			{#if $userNotifications.some( noti => !noti.read)}
				<p class="count">{$userNotifications.filter( noti => !noti.read).length }</p>
			{/if}
		</i></button>
	<p class="tooltip">Notificaciones</p>
	{#if handleNotifications} 
		<div class="close" on:click={closeNotifications}></div>
		<div class="notifications">
			<h2 class="title">Notificaciones</h2>
			<div class="line"></div>
			{#each $userNotifications as noti, index}
				<button class="noti">
					{#if noti.type === 'comment'}
						{#if noti.read}
							<i class="icon fas fa-comment-alt"/>
						{:else}
							<i class="icon far fa-comment-alt"/>
						{/if}
						<div class="username"><i>{noti.sender}</i> ha comentado tu Scream </div>
					{:else}
						{#if noti.read}
							<i class="icon fas fa-heart"/>
						{:else}
							<i class="icon far fa-heart"/>
						{/if}
						<div class="username"><i>{noti.sender}</i> le ha gustado tu Scream </div>
					{/if}
					<span class="createdAt">  {dayjs(noti.createdAt).fromNow()}</span>
					<div class="dialog">
						{#each $screams as scream, index}
						{#if scream.screamId === noti.screamId}
							<ScreamDialog screamId={noti.screamId} userHandle={noti.recipient} commentCount={scream.commentCount} />
						{/if}
						{/each}
					</div>
				</button>
			{:else}
				<p class="no-notifications">No tienes notificaciones</p>
			{/each}
		</div>
	{/if}
</div>

<style>
	.bell {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.bell .button {
		position: relative;
    cursor: pointer;
		border-radius: 50%;
		font-size: 1.5em;
		width: 100%;
		height: 100%;
    border-style: none;
    background: none;
    color: #fff;
	}

	.bell i {
		position: relative;
	}

	.bell i p {
		color: var(--primary);
	}

	.bell .tooltip {
    position: absolute;
    left: -22px;
    bottom: -21px;
    font-size: 1em;
    opacity: 0;
    visibility: hidden;
    transition: opacity 300ms;
	}

	.bell:hover .tooltip {
		opacity: 1;
		visibility: visible;
	}

	.count {
		font-weight: bold;
	  position: absolute;
    left: -8px;
    width: 18px;
    height: 18px;
    bottom: -6px;
    line-height: 20px;
    background-color: var(--secondary);
    border-radius: 50%;
    font-size: 12px;
	}

	.close {
		position: fixed;
		top: 0;
		left: 0;
		background: transparent;
		width: 100vw;
		height: 100vh;
	}

	.notifications {
		font-size: 1.2em;
		background: var(--primary);
		position: absolute;
		width: 400px;
		left: -120px;
		top: 55px;
		border: solid 2px #50A4D9;
		box-shadow: -5px 3px 5px rgba(0, 0, 0, .5);
		border-radius: 5px;
		z-index: 10000;
	}

	.notifications .title {
		text-align: center;
		margin-top: 5px;
		font-size: 1.1em;
	}

	.notifications .line {
		margin-top: 10px;
		margin-bottom: 10px; 
		height: 2px;
		width: 100%;
		background-color: var(--secondary);
	}

	.notifications .noti {
		font-size: 1em;
		color: #fff;
		border-style: none;
		background: transparent;
		display: flex;
		font-size: .8em;
		padding: 12px 10px;
		width: 100%;
		cursor: pointer;
	}

	.notifications .noti:hover {
		background: #50A4D9;
	}

	.noti {
		position: relative;
	}

	.noti .icon {
		margin-right: 5px;
	}

	.noti .icon .fas {
		color: var(--secondary);
	}

	.noti .username i{
		color:  var(--secondary);
	}

	.noti .dialog {
		position: absolute;
		right: 5px;
		top: 10px;
		text-align: left;
	}

	.noti .createdAt {
		margin-left: 4px;
	}

	.no-notifications {
		width: 100%;
		text-align: center;
	}

	@media (max-width: 520px) {
		.notifications {
			left: -220px;
			width: 320px;
			font-size: 1em;
		}  
	}
</style>	