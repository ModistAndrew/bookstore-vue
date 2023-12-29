<template>
  <n-layout has-sider>
    <n-layout-sider bordered content-style="padding: 24px;">
      <n-menu class="custom-menu" :options="menuOptions" :on-update:value="quit"/>
    </n-layout-sider>
    <n-layout-content>
      <router-view style="height: 100vh"></router-view>
    </n-layout-content>
  </n-layout>
</template>

<script>
import {defineComponent, h} from "vue";
import {RouterLink} from "vue-router";
import {NIcon, NText, useMessage, useThemeVars} from "naive-ui";
import {
  PersonOutline,
  BookOutline,
  NewspaperOutline,
  LogOutOutline
} from "@vicons/ionicons5";
import {ipcRenderer} from "electron";

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}

const menuOptions = [
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
    icon: renderIcon(BookOutline)
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
    icon: renderIcon(NewspaperOutline)
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
];

export default defineComponent({
  setup() {
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
    ipcRenderer.on('error', (event, data) => {
      message.error(data);
    });
  }
});
</script>

<style scoped>
.custom-menu:active {
  color: aqua;
}
</style>