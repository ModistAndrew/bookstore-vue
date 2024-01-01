<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <n-tabs
        v-model:value="currentTab"
        size="large"
        animated
        style="padding: 3vh 3vw;margin: 20% 30%;min-height: 60%;"
    >
      <n-tab-pane name="user" tab="User">
        <n-empty :show-description="false" size="huge" v-if="notUser">
          <template #icon>
            <img src="./assets/empty.jpg" alt="empty" style="width: 100%"/>
          </template>
          <template #extra>
            <n-button size="small" @click="toLog">
              Logged in
            </n-button>
          </template>
        </n-empty>
        <div v-else>
          <n-breadcrumb separator=">">
            <n-breadcrumb-item v-for="(label, index) in currentUsers" :key="index">
              {{ label }}
            </n-breadcrumb-item>
          </n-breadcrumb>
          <n-card :title="currentId" size="huge" style="display: flex; align-items: center; margin: 3vh 0">
            <n-text :type="currentColor" strong>
              {{ currentName }}
            </n-text>
          </n-card>
          <n-button type="error" @click="logout" block secondary strong>
            Logout
          </n-button>
        </div>
      </n-tab-pane>
      <n-tab-pane name="signIn" tab="Sign in">
        <n-form>
          <n-form-item-row label="User Id">
            <n-input v-model:value="userId"/>
          </n-form-item-row>
          <n-form-item-row label="Password">
            <n-input type="password" v-model:value="password"/>
          </n-form-item-row>
        </n-form>
        <n-button @click="signIn" type="primary" block secondary strong>
          Sign In
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signUp" tab="Sign up">
        <n-form>
          <n-form-item-row label="User Id">
            <n-input v-model:value="userIdAdd"/>
          </n-form-item-row>
          <n-form-item-row label="User Name">
            <n-input v-model:value="userNameAdd"/>
          </n-form-item-row>
          <n-form-item-row label="Password">
            <n-input v-model:value="passwordAdd" type="password"/>
          </n-form-item-row>
        </n-form>
        <n-grid x-gap="12" cols="2">
          <n-gi>
            <n-button type="primary" block secondary strong @click="signUp">
              Sign Up
            </n-button>
          </n-gi>
          <n-gi>
            <n-button type="info" block secondary strong @click="addClerk" :disabled="notAdmin">
              Add Clerk
            </n-button>
          </n-gi>
        </n-grid>
      </n-tab-pane>
      <n-tab-pane name="advanced" tab="Advanced">
        <n-form>
          <n-form-item-row label="User Id">
            <n-input v-model:value="userIdAdvanced"/>
          </n-form-item-row>
        </n-form>
        <n-grid x-gap="12" cols="2">
          <n-gi>
            <n-popconfirm :show-icon="false" @positive-click="changePassword" placement="bottom">
              <template #trigger>
                <n-button type="info" block secondary strong :disabled="notUser">
                  Change Password
                </n-button>
              </template>
              <n-form>
                <n-form-item label="Old Password">
                  <n-input type="password" v-model:value="oldPassword"/>
                </n-form-item>
                <n-form-item label="New Password">
                  <n-input type="password" v-model:value="newPassword"/>
                </n-form-item>
              </n-form>
            </n-popconfirm>
          </n-gi>
          <n-gi>
            <n-button type="error" block secondary strong @click="deleteUser" :disabled="notAdmin">
              Delete User
            </n-button>
          </n-gi>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import {useMessage} from "naive-ui";
import {addUser, changePassword, deleteUser, login, logout, showUser} from "@/api";
const currentUsers = ref([]);
const currentId = ref("");
const currentName = ref("");
export const currentPrivilege = ref(0);
const colorMap = {
  0: "info",
  1: "info",
  3: "primary",
  7: "warning"
};

export default defineComponent({
  computed: {
    notUser: () => currentPrivilege.value < 1,
    notClerk: () => currentPrivilege.value < 3,
    notAdmin: () => currentPrivilege.value < 7,
    currentColor: () => colorMap[currentPrivilege.value],
  },
  setup() {
    const message = useMessage();
    const userId = ref("");
    const password = ref("");
    const userIdAdd = ref("");
    const userNameAdd = ref("");
    const passwordAdd = ref("");
    const userIdAdvanced = ref("");
    const oldPassword = ref("");
    const newPassword = ref("");
    const currentTab = ref("signIn");
    const updateUser = () => {
      showUser(data => {
        currentUsers.value = data.map(user => user.id);
        if (data.length > 0) {
          let last = data[data.length - 1];
          currentId.value = last.id;
          currentName.value = last.name;
          currentPrivilege.value = Number(last.privilege);
        } else {
          currentId.value = "";
          currentName.value = "";
          currentPrivilege.value = 0;
        }
      });
    }
    return {
      userId,
      password,
      userIdAdd,
      userNameAdd,
      passwordAdd,
      userIdAdvanced,
      oldPassword,
      newPassword,
      currentUsers,
      currentId,
      currentName,
      currentPrivilege,
      currentTab,
      signIn: () => login(userId.value, password.value, data => {
        updateUser();
        message.success("Signed in");
      }),
      logout: () => logout(data => {
        updateUser();
        message.success("Logged out");
      }),
      signUp: () => addUser(userIdAdd.value, userNameAdd.value, passwordAdd.value, false, data => {
        message.success("Signed up");
      }),
      addClerk: () => addUser(userIdAdd.value, userNameAdd.value, passwordAdd.value, true, data => {
        message.success("Clerk added");
      }),
      deleteUser: () => deleteUser(userIdAdvanced.value, data => {
        message.success("User deleted");
      }),
      changePassword: () => changePassword(userIdAdvanced.value, oldPassword.value, newPassword.value, data => {
        message.success("Password changed");
      }),
      toLog: () => {
        currentTab.value = "signIn";
      }
    };
  }
});
</script>