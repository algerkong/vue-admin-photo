<template></template>

<script>
import { getUser } from "@/api/userset";
export default {
  name: "user",
  data() {
    return {};
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getUser();
    },
  },
};
</script>

<style>
</style>
