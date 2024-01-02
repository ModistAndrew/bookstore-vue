<template>
  <n-layout has-sider>
    <n-layout-sider bordered content-style="padding: 24px;">
      <n-menu :options="menuOptions" :on-update:value="quit"/>
    </n-layout-sider>
    <n-layout-content>
      <router-view style="height: 100vh"></router-view>
    </n-layout-content>
  </n-layout>
</template>

<script>
import {computed, defineComponent, h} from "vue";
import {RouterLink} from "vue-router";
import {NIcon, NText, useMessage, useThemeVars} from "naive-ui";
import {
  PersonOutline,
  BookOutline,
  NewspaperOutline,
  LogOutOutline
} from "@vicons/ionicons5";
import {ipcRenderer} from "electron";
import {currentPrivilege} from "@/Login.vue";

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}

export default defineComponent({
  setup() {
    const menuOptions = computed(() => [
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "About",
              }
            },
            {default: () => "Modist's Bookstore"}
        ),
        key: "about",
      },
      {
        key: "divider-1",
        type: "divider",
        props: {
          style: {
            marginLeft: "32px"
          }
        }
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "Login",
              }
            },
            {default: () => "Login"}
        ),
        key: "login",
        icon: renderIcon(PersonOutline)
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "Book",
              }
            },
            {default: () => "Book"}
        ),
        key: "book",
        icon: renderIcon(BookOutline),
        show: currentPrivilege.value >= 1
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "Log",
              }
            },
            {default: () => "Log"}
        ),
        key: "log",
        icon: renderIcon(NewspaperOutline),
        show: currentPrivilege.value >= 7
      },
      {
        label: () => h(
            NText,
            {
              type: "error",
            },
            {default: () => "Quit"}
        ),
        key: "quit",
        icon: () => h(
            NIcon,
            {
              color: useThemeVars().value.errorColor,
            },
            {default: () => h(LogOutOutline)}
        )
      }
    ]);
    return {
      menuOptions,
      quit: (key) => {
        if (key === "quit") {
          ipcRenderer.send('quit');
        }
      }
    };
  },
  mounted() {
    const message = useMessage();
    ipcRenderer.on('errorMessage', (event, data) => {
      message.error(data);
    });
  },
  unmounted() {
    ipcRenderer.removeAllListeners('errorMessage');
  }
});
</script>