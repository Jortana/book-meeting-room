<template>
  <div id="view">
    <nav-menu id="nav"></nav-menu>
    <router-view/>
  </div>
</template>

<script>
import NavMenu from './NavMenu'
export default {
  name: 'Home',
  components: {
    NavMenu
  }
}
</script>

<style scoped>
#view {
  width: 90%;
  margin: 0 auto;
}

#logo {
  text-align: left;
}

#nav {}
</style>
