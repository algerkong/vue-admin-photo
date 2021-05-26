<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.user .el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-dialog {
  border-radius: 10px;
}
</style>
