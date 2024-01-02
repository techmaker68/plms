<!--
***********************************
@author Mohanned Hassan
@create_date 14th Nov 2023

Redirect users here on invalid route

***********************************
-->
<script setup>
import { Routes } from "@/data";
</script>
<template>
  <div class="d-flex align-items-center justify-content-center vh-100">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-2">
        <span class="text-danger" v-t="'Oops!'"></span>
        {{ $t("Page not found") }}
      </p>
      <p class="lead" v-t="'The page you’re looking for doesn’t exist'"></p>
      <router-link
        :to="{ name: Routes.DashboardModule }"
        class="btn btn-primary"
        v-t="'Go Home'"
      ></router-link>
    </div>
  </div>
</template>
<style scoped></style>
