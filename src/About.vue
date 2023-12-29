<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <n-grid x-gap="0" :cols="2" style="margin: 10% 20%;">
      <n-gi>
        <img src="./assets/modist.jpg" alt="logo" style="width: 100%; height: 100%">
      </n-gi>
      <n-gi>
        <n-card size="huge" style="width: 100%; height: 100%">
          <n-space vertical justify="space-between" style="height: 100%">
            <n-space vertical>
              <n-h2>
                <n-gradient-text strong type="warning">
                  My <b>PROUD</b> First Vue.js Project
                </n-gradient-text>
              </n-h2>
              <n-h3>
                <n-a href="https://github.com/ModistAndrew/bookstore" target="_blank">
                  Github Repo
                </n-a>
              </n-h3>
            </n-space>
            <n-switch :value="currentTheme" @update:value="changeTheme" size="large">
              <template #checked>
                Dark
              </template>
              <template #unchecked>
                Light
              </template>
            </n-switch>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script>
import {theme} from "./App.vue";
import {defineComponent, ref} from "vue";
import {darkTheme, lightTheme} from "naive-ui";

export default defineComponent({
  setup() {
    const currentTheme = ref(theme.value.name===darkTheme.name);
    return {
      currentTheme,
      changeTheme: (on) => {
        theme.value = on ? darkTheme : lightTheme;
        currentTheme.value = on;
      }
    }
  }
});
</script>