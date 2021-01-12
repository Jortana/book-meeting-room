<template>
  <div id="view">
    <nav-menu></nav-menu>
    <router-view/>
  </div>
</template>

<script>
import NavMenu from '../NavMenu'
export default {
  name: 'Manager',
  components: {
    NavMenu
  }
}
</script>

<style scoped>
#view {
  width: 70%;
  margin: 0 auto;
}

#logo {
  text-align: left;
}
</style>
