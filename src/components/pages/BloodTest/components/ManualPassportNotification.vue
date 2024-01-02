<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
-->
<script setup>
import CustomEditor from "@/components/common/CustomEditor.vue";
</script>
<template>
  <div class="row">
    <div class="col d-flex gap-5 required-form-control">
      <label
        for="Passport"
        class="form-label d-inline-block w-auto me-3 text-primary"
        >To:</label
      >
      <strong class="text-primary ps-3"
        ><span id="notifyCheckCount">0</span> Selected Persons</strong
      >
    </div>
  </div>
  <div class="row">
    <div class="col d-flex gap-5">
      <label class="text-primary">Actions:</label>
      <div class="radio-list">
        <div class="form-check form-check">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions2"
            id="inlineRadio5"
            value="option1"
          />
          <label class="form-check-label" for="inlineRadio5"
            >Passport Submission</label
          >
        </div>
        <div class="form-check form-check">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions2"
            id="inlineRadio6"
            value="option2"
          />
          <label class="form-check-label" for="inlineRadio6"
            >Blood Test Appointment</label
          >
        </div>
        <div class="form-check form-check">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions2"
            id="inlineRadio7"
            value="option3"
          />
          <label class="form-check-label" for="inlineRadio7"
            >Passport Return</label
          >
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col d-flex flex-row">
      <label for="Passport" class="form-label text-primary w-25"
        >Due Time:</label
      >

      <input
        type="time"
        class="form-control me-5"
        id="Passport"
        placeholder="HH:MM"
      />
      <input
        type="date"
        class="form-control"
        id="Passport"
        placeholder="DD/MM/YY"
      />
    </div>
  </div>

  <div class="row">
    <div class="col d-flex">
      <label for="Passport" class="form-label text-primary" style="width: 12%"
        >Subject:
      </label>
      <input
        type="text"
        class="form-control"
        placeholder="% Subject %"
        id="Passport"
        Value=""
      />
    </div>
  </div>
  <div class="row">
    <div class="col d-flex">
      <label for="Passport" class="form-label text-primary" style="width: 12%"
        >Message:
      </label>
      <CustomEditor value=""></CustomEditor>
    </div>
  </div>
  <div class="btn-grp d-flex justify-content-center mt-4">
    <button class="btn btn-blue reminder-btn">
      <svg
        class="svg-icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L16 8L0 16V0ZM0 6.4V9.6L8 8L0 6.4Z" fill="white" />
      </svg>
      Send Notification
    </button>
  </div>
</template>
