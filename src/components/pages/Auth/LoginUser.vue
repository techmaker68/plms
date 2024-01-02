<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Login page view

***********************************
-->
<script setup>
import { reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import { useUserStore } from "@/stores";
import ErrorMessages from "@/components/common/ErrorMessages.vue";

const { login } = useUserStore();

const state = reactive({
  form: {
    email: "",
    password: "",
  },
});

const rules = computed(() => ({
  form: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
  },
}));

const v$ = useVuelidate(rules, state);

async function loginUser() {
  try {
    if (!v$.value.form.$invalid) {
      const form = v$.value.form.$model;
      await login(form);
    }
  } catch (error) {
    console.log("Error registering user", error);
  }
}
</script>

<template>
  <div class="wrapper">
    <main class="page-container postion-relative">
      <div
        class="login-container d-flex flex-column justify-content-start align-items-stretch bg-white rounded-4 p-5"
        style="gap: 2rem"
      >
        <div class="page-header d-flex flex-column mb-0">
          <img
            class="navbar-brand__logo text-center"
            alt="PLMS:Home"
            src="@/assets/img/Majnoon.svg"
            height="50"
          />
          <h1 class="page-title text-center mt-2 fs-2">
            <span>People Logistics</span>
          </h1>
          <h1 class="page-title text-center mt-2 fs-3">
            <span v-t="'LOGIN'"></span>
          </h1>
        </div>

        <hr class="m-0" />

        <div class="vertical-form-field required-form-control">
          <label v-t="'Email'"></label>
          <input
            type="text"
            v-model="v$.form.email.$model"
            class="form-control"
            placeholder=""
            @keyup.enter="loginUser"
          />
          <ErrorMessages :errors="v$.form.email.$errors" />
        </div>
        <div class="vertical-form-field required-form-control">
          <label v-t="'Password'"></label>
          <input
            type="password"
            v-model="v$.form.password.$model"
            class="form-control"
            placeholder=""
            @keyup.enter="loginUser"
          />
          <ErrorMessages :errors="v$.form.password.$errors" />
        </div>

        <div
          class="d-flex flex-column justify-content-end align-items-center flex-grow-1"
        >
          <button
            :disabled="v$.form.$invalid"
            class="btn btn-blue align-self-center"
            aria-label="Close"
            @click="loginUser"
          >
            <span v-t="'Login'"></span>
          </button>
        </div>
      </div>
      <p class="text-bottom position-absolute bottom-0 fw-light">
        Powered by ITforce
      </p>
    </main>
  </div>
</template>
<style scoped lang="scss">
.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
.vertical-form-field input {
  text-align: center;
  padding: 15px;
  font-size: 1.3em;
}
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/img/login_bg.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
.login-container {
  // min-height: 35rem;
  aspect-ratio: 1.25;
}
.text-bottom {
  font-size: 12px;
  color: white;
}
.input-errors {
  height: 16px;
}
</style>
