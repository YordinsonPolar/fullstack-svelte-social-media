<script>
	export let message = 'tooltip message';
	export let icon = ''
</script>

<div class="tooltip">
	<div class="edit-image"><i class={icon}/><slot/></div>
	<span class="tooltiptext">{message}</span>
</div>

<style>
	.edit-image {
		position: relative;
		display: grid;
		place-items: center;
		cursor: pointer;
		width: 40px;
		height: 40px;
		background: #EFEFEF;
		border-radius: 50%;
		transition: .3s;
		/* overflow: hidden; */
	}

	.edit-image i {
		color: #5DB3E9;
	}

	.edit-image:hover {
		transform: scale(1.03);
	}

	.tooltip {
	  position: relative;
	  display: inline-block;
	}

	.tooltip .tooltiptext {
		font-size: 1em;
	  visibility: hidden;
	  width: 120px;
	  background-color: #50A4D9;
	  color: #fff;
	  text-align: center;
	  border-radius: 20px;
	  padding: 2px 4px;
	  position: absolute;
	  z-index: 1;
	  bottom: 125%;
	  left: 50%;
	  margin-left: -60px;
	  opacity: 0;
	  transition: opacity 0.3s;
	}

	.tooltip .tooltiptext::after {
	  content: "";
	  position: absolute;
	  top: 100%;
	  left: 50%;
	  margin-left: -5px;
	  border-width: 5px;
	  border-style: solid;
	  border-color: #50A4D9 transparent transparent transparent;
	}

	.tooltip:hover .tooltiptext {
	  visibility: visible;
	  opacity: 1;
	}

</style>