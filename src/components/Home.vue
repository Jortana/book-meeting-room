<template>
  <div id="view">
    <nav-menu id="nav"></nav-menu>
    <router-view />
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
  max-width: 1350px;
  margin: 0 auto;
}

#logo {
  text-align: left;
}
</style>
