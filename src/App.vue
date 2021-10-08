<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
#app {
  font-family: Microsoft YaHei, PingFangSC-Regular, PingFang SC, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #20242e;
  height: 100vh;
}
.yc-newpage-contaner {
  background-color: #edeff3;
  min-height: 100%;
  overflow: hidden;
  min-width: 1400px;
  .main-wrapper {
    margin: 20px auto;
    background-color: #fff;
    width: 1280px;
    min-height: 94vh;
    .yc-bread-crumb{
      .title{
        color: #20242E;
      }
    }
  }
}
</style>
