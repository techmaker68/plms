<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

***********************************
-->
<template>
  <a @click="goBack" class="d-inline-block sidebar__backbutton me-5">
    <img class="svg-icon" src="../../assets/img/arrow-left.svg" />
  </a>
</template>

<script>
export default {
  name: "BackButton",
  methods: {
    goBack() {
      return this.$router.go(-1);
    },
  },
};
</script>
