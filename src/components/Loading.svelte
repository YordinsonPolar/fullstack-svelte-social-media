<script>
		export let size = '20px';
		export let loadSize = '3px';
</script>

<div 
	class="loader" 
				style={`
					 width: ${size};
					 height: ${size};
		 			 border-top: ${loadSize} solid rgba(255,255,255, .3);
					 border-bottom: ${loadSize} solid #69D5CA;
					 border-left: ${loadSize} solid #69D5CA;
		 			 border-right: ${loadSize} solid #69D5CA;
		 `}></div>

<style>
	.loader {
		display: inline-block;
	  border-radius: 50%;
	  animation: spin .7s linear infinite;
}

@keyframes spin {
  0%,100% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>