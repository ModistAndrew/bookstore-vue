<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-config-provider :theme="theme">
            <demo/>
          </n-config-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<script>
import {defineComponent, ref} from "vue";
import Demo from "./Menu.vue";
import {lightTheme, darkTheme} from 'naive-ui'
export const theme = ref(lightTheme);

export default defineComponent({
  setup() {
    return {
      theme
    }
  },
  components: {
    Demo,
  }
});
</script>