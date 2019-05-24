<template>
<div id="app">
    <div class="logo">
        <!--<img src="./assets/logo.png" >-->
    </div>
    <router-view></router-view>
</div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 120px;
}

.logo {
    width: 28vw;
    margin: 0 auto;
}

.logo img {
    float: left;
    width: 8vw;
}

</style>