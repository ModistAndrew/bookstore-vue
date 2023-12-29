<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <n-tabs
        default-value="finance"
        size="large"
        animated
        style="padding: 3vh 3vw;margin: 20% 30%;min-height: 60%;"
    >
      <n-tab-pane name="finance" tab="Finance">
        <n-statistic label="Income">
          {{ Income }}
        </n-statistic>
        <n-statistic label="Outcome">
          {{ Outcome }}
        </n-statistic>
        <n-input-number style="margin-top: 1vh" v-model:value="financeCnt" clearable precision="0"
                        placeholder="Enter Count or Show All" @keydown.enter="showFinance"/>
        <n-divider/>
        <n-log
            :rows="5"
            :log="financeLog"
            class="logStyle"
        />
        <n-button block style="margin-top: 1vh" @click="showFinanceLog">
          Show Finance Log
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="logs" tab="Logs">
        <n-log
            :rows="5"
            :log="employeeLog"
            class="logStyle"
        />
        <n-button block style="margin-top: 1vh" @click="showEmployeeLog">
          Show Employee Log
        </n-button>
        <n-divider/>
        <n-log
            :rows="5"
            :log="logs"
            class="logStyle"
        />
        <n-button block style="margin-top: 1vh" @click="showLogs">
          Show Logs
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import {report, showFinance} from "@/api";

export default defineComponent({
  setup() {
    const financeCnt = ref(null);
    const Income = ref("0.00");
    const Outcome = ref("0.00");
    const financeLog = ref("");
    const employeeLog = ref("");
    const logs = ref("");
    return {
      financeCnt,
      Income,
      Outcome,
      financeLog,
      employeeLog,
      logs,
      showFinance: () => showFinance(financeCnt.value, (data) => {
        Income.value = data[0];
        Outcome.value = data[1];
      }),
      showFinanceLog: () => report("report finance", (data) => financeLog.value = data.join('\n')),
      showEmployeeLog: () => report("report employee", (data) => employeeLog.value = data.join('\n')),
      showLogs: () => report("log", (data) => logs.value = data.join('\n'))
    };
  }
});
</script>

<style scoped>
.logStyle {
  background: aliceblue;
}
</style>