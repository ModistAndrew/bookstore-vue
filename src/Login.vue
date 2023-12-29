<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <n-tabs
        default-value="signIn"
        size="large"
        animated
        style="padding: 3vh 3vw;margin: 20% 30%;min-height: 60%;"
        @update:value="handleTabChange"
    >
      <n-tab-pane name="user" tab="User">
        <n-breadcrumb separator=">">
          <n-breadcrumb-item v-for="(label, index) in breadcrumbItems" :key="index">
            {{ label }}
          </n-breadcrumb-item>
        </n-breadcrumb>
        <n-card :title="currentName" size="huge" style="display: flex; align-items: center; margin: 3vh 0">
          <n-text type="info">
            {{ currentId }}
          </n-text>
        </n-card>
        <n-button type="error" @click="logout" block secondary strong>
          Logout
        </n-button>
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
            <n-button type="info" block secondary strong @click="addClerk">
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
                <n-button type="info" block secondary strong>
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
            <n-button type="error" block secondary strong @click="deleteUser">
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

export default defineComponent({
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
    const breadcrumbItems = ref([]);
    const currentId = ref("");
    const currentName = ref("");
    return {
      userId,
      password,
      userIdAdd,
      userNameAdd,
      passwordAdd,
      userIdAdvanced,
      oldPassword,
      newPassword,
      breadcrumbItems,
      currentId,
      currentName,
      signIn: () => login(userId.value, password.value, data => message.info(data)),
      logout: () => logout(data => message.info(data[0])),
      signUp: () => addUser(userIdAdd.value, userNameAdd.value, passwordAdd.value, false, data => message.info(data)),
      addClerk: () => addUser(userIdAdd.value, userNameAdd.value, passwordAdd.value, true, data => message.info(data)),
      deleteUser: () => deleteUser(userIdAdvanced.value, data => message.info(data)),
      changePassword: () => changePassword(userIdAdvanced.value, oldPassword.value, newPassword.value, data => message.info(data)),
      handleTabChange: (value) => {
        if (value === "user") {
          showUser(data => {
            if (data.length === 0) {
              message.info("No user logged in");
              return;
            }
            breadcrumbItems.value = data.map(account => account.id);
            currentId.value = data[data.length - 1].id;
            currentName.value = data[data.length - 1].name;
          });
        }
      }
    };
  }
});
</script>