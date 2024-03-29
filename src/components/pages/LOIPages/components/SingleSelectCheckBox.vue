<!--
***********************************
@author Mohanned Hassan
@create_date 1st Sept 2023

***********************************
-->
<script setup>
const emits = defineEmits(["change"]);

const props = defineProps({
  checked: { type: Boolean, required: true },
});
</script>

<template>
  <div class="easy-checkbox" @click.stop.prevent="emits('change')">
    <input type="checkbox" :checked="props.checked" />
    <label for="checbox"></label>
  </div>
</template>

<style lang="scss" scoped>
$checkbox-border-color: rgba(0, 0, 0, 0.54);

$checkbox-size: 1.3em;
$checkbox-margin: 1em 0;
$checkbox-padding: 0.2em;
$checkbox-border-width: 1px;
$checkbox-border-radius: 0.125em;
$checkbox-label-padding: 0.6em;

$checkmark-width: 0.13em;
$checkmark-color: #fff;

$line-width: 0.125em;
$line-color: #fff;

.easy-checkbox {
  position: relative;
  width: $checkbox-size;
  height: $checkbox-size;
  font-size: var(--easy-table-body-row-font-size);
  margin: 0 auto;
  label {
    cursor: pointer;
    display: inline;
    line-height: $checkbox-size;
    vertical-align: top;
    clear: both;

    &:before,
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
    }

    &:before {
      width: $checkbox-size;
      height: $checkbox-size;
      background: #fff;
      border: $checkbox-border-width solid $checkbox-border-color;
      border-radius: $checkbox-border-radius;
      cursor: pointer;
      transition: background 0.3s;
    }
  }

  input[type="checkbox"] {
    outline: 0;
    visibility: hidden;
    width: $checkbox-size;
    margin: 0;
    display: block;
    float: inline-start;
    font-size: inherit;

    &:checked {
      + label:before {
        border: none;
      }
      + label:after {
        $checkmark-size: $checkbox-size - 2 * $checkbox-padding;
        $first: calc(#{$checkbox-size} / 2);
        $second: calc(#{$checkmark-size} / 2.6);
        transform: translate(#{$checkbox-padding}, calc(#{$first} - #{$second}))
          rotate(-45deg);
        width: $checkmark-size;
        height: calc(#{$checkmark-size} / 2);
        border: $checkmark-width solid $checkmark-color;
        border-top-style: none;
        border-right-style: none;
      }
    }

    &.allSelected {
      + label:before {
        border: none;
      }
      + label:after {
        $checkmark-size: $checkbox-size - 2 * $checkbox-padding;
        transform: translate(
            $checkbox-padding,
            calc($checkbox-size / 2) - calc($checkmark-size / 2.6)
          )
          rotate(-45deg);
        width: $checkmark-size;
        height: calc($checkmark-size / 2);
        border: $checkmark-width solid $checkmark-color;
        border-top-style: none;
        border-right-style: none;
      }
    }
    &.partSelected {
      + label:before {
        border: none;
      }
      + label:after {
        $line-size: $checkbox-size - 2 * $checkbox-padding;
        transform: translate(
          $checkbox-padding,
          calc($checkbox-size / 2) - calc($line-width / 2)
        );
        width: $line-size;
        height: calc($line-size / 2);
        border: $line-width solid $line-color;
        border-bottom-style: none;
        border-right-style: none;
        border-left-style: none;
      }
    }
  }
}

*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>
