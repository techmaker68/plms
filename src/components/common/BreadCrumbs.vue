<!--
***********************************
@author Mohanned Hassan
@create_date 4th Dec 2023

***********************************
-->
<script setup>
import { Routes } from "@/data";
import { translateObject } from "@/helpers";
import { useRouterStore } from "@/stores";
import { storeToRefs } from "pinia";
import Breadcrumb from "primevue/breadcrumb";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  parentName: {
    type: String,
    default: "",
  },
  overrideRouteName: {
    type: String,
    default: "",
  },
});

const home = ref({
  icon: "pi pi-home",
  route: Routes.DashboardModule,
});

const { getActiveModule } = storeToRefs(useRouterStore());
const route = useRoute();

const items = computed(() => {
  let temp = [];

  if (props.parentName) {
    const parentRoute = getActiveModule.value.children.find(
      (element) => element.name == props.parentName
    );

    if (parentRoute) {
      const { label, label_ar, name } = parentRoute;
      temp.push({
        label,
        label_ar,
        route: name,
      });
    }
  }

  const routeName = props.overrideRouteName || route.name;
  const { label, label_ar, name } = getActiveModule.value.children.find(
    (element) => element.name == routeName
  );

  temp.push({
    label,
    label_ar,
    route: name,
    current: true,
  });

  return temp;
});
</script>

<template>
  <div class="flex justify-content-center">
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="{ name: item.route }"
          custom
        >
          <a
            :href="href"
            v-bind="props.action"
            @click="navigate"
            :class="{
              'active-breadcrumb': !item?.current,
              'inactive-breadcrumb': item.current,
            }"
          >
            <span :class="[item.icon, 'text-color']" />
            <span class="font-semibold">{{
              translateObject(item, "label")
            }}</span>
          </a>
        </router-link>
      </template>
    </Breadcrumb>
  </div>
</template>
<style scoped lang="scss">
:deep(.p-breadcrumb) {
  background: transparent;
  padding-block-start: 0px;
  padding-inline-start: 0px;

  .pi {
    font-size: 1.44rem;
  }
}

a {
  color: unset;
  text-transform: capitalize;

  &.active-breadcrumb {
    color: var(--primary-color);
  }

  &.inactive-breadcrumb {
    cursor: normal;
    pointer-events: none;
  }
}
</style>
