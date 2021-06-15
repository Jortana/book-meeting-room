<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <div id="main-container">
      <router-view/>
    </div>
    <div id="footer">
      <p>Copyright © 2010-{{ new Date().getFullYear() }} All rights reserved. 南京师范大学教育科学学院 版权所有</p>
      <p>联系方式：025-83598571（随园） 025-85891035（仙林）</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  /*width: 80%;*/
  margin: 0 auto;
  /*height: 100vh;*/
}

body {
  margin: 0;
  height: 100vh;
  background-color: #397D58;
}

textarea {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

#main-container {
  min-height: 100%;
  /*height: auto !important;*/
  /*height: 100vh;*/
}

h2 {
  font-weight: bold;
}

#footer {
  height: 10vh;
  padding-top: 2rem;
  padding-bottom: 3rem;
  color: #fff;
  background-color: #30694A;
}

.el-icon-success {
  color: #67C23A;
}

.el-icon-warning {
  color: #E6A23C;
}

.el-icon-error {
  color: #F56C6C;
}

main {
  text-align: left;
  margin-top: 1rem;
  min-height: 92vh;
  background-color: #fff;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding-top: 0.1rem;
  padding-left: 1.6rem;
  overflow: hidden;
  max-width: 1350px;
}

h2 {
  color: #666666;
}

@media only screen and (max-width : 376px) {
  main {
    margin-top: 0;
  }
}
</style>
