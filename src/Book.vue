<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; margin: 0 8vw">
    <n-input-group style="justify-content:center">
      <n-popselect v-model:value="searchType" :options="searchOptions">
        <n-button style="width:10%" type="primary">{{ searchType }}</n-button>
      </n-popselect>
      <n-input style="width:60%" v-model:value="searchInput" @keydown.enter="handleInput">
      </n-input>
      <n-button style="width:10%" type="info" @click="showAll">Show All</n-button>
    </n-input-group>
    <n-data-table
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="books"
        :pagination="pagination"
        @checked-row-keys-change="changeSelection"
        min-height="50vh"
        max-height="50vh"
    />
    <div style="display: flex; align-items: center; justify-content:space-evenly; width:100%">
      <n-popconfirm :show-icon="false" @positive-click="buyBtn">
        <template #trigger>
          <n-button secondary type="primary" style="width: 20%" :disabled="checkedRowKeys.length===0">Buy</n-button>
        </template>
        <n-form>
          <n-form-item label="Count">
            <n-input-number v-model:value="buyCnt" clearable precision="0"/>
          </n-form-item>
        </n-form>
      </n-popconfirm>
      <n-divider vertical/>
      <n-popconfirm :show-icon="false" @positive-click="addBtn">
        <template #trigger>
          <n-button secondary type="info" style="width: 20%">Add</n-button>
        </template>
        <n-form>
          <n-form-item label="ISBN">
            <n-input v-model:value="addISBN"/>
          </n-form-item>
        </n-form>
      </n-popconfirm>
      <n-popconfirm :show-icon="false" @positive-click="editBtn">
        <template #trigger>
          <n-button secondary type="info" style="width: 20%">Edit</n-button>
        </template>
        <n-form>
          <n-form-item label="ISBN">
            <n-input v-model:value="editISBN"/>
          </n-form-item>
          <n-form-item label="Name">
            <n-input v-model:value="editName"/>
          </n-form-item>
          <n-form-item label="Author">
            <n-input v-model:value="editAuthor"/>
          </n-form-item>
          <n-form-item label="Keyword">
            <n-input v-model:value="editKeyword"/>
          </n-form-item>
          <n-form-item label="Price">
            <n-input-number v-model:value="editPrice" clearable precision="2"/>
          </n-form-item>
        </n-form>
      </n-popconfirm>
      <n-popconfirm :show-icon="false" @positive-click="importBtn">
        <template #trigger>
          <n-button secondary type="info" style="width: 20%">Import</n-button>
        </template>
        <n-form>
          <n-form-item label="Count">
            <n-input-number v-model:value="importCnt" clearable precision="0"/>
          </n-form-item>
          <n-form-item label="Total Cost">
            <n-input-number v-model:value="totalCost" clearable precision="2"/>
          </n-form-item>
        </n-form>
      </n-popconfirm>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import {useMessage} from "naive-ui";
import {add, buy, edit, importBook, search, select} from "@/api";

const createColumns = () => {
  return [
    {
      type: "selection",
      multiple: false
    },
    {
      title: "ISBN",
      key: "ISBN"
    },
    {
      title: "Name",
      key: "Name"
    },
    {
      title: "Author",
      key: "Author"
    },
    {
      title: "Keyword",
      key: "Keyword"
    },
    {
      title: "Price",
      key: "Price"
    },
    {
      title: "Stock",
      key: "Stock"
    }
  ];
};

export default defineComponent({
  setup() {
    const searchInput = ref("");
    const searchType = ref("ISBN");
    const message = useMessage();
    const checkedRowKeysRef = ref([]);
    const books = ref([]);
    const buyCnt = ref(0);
    const addISBN = ref("");
    const editISBN = ref("");
    const editName = ref("");
    const editAuthor = ref("");
    const editKeyword = ref("");
    const editPrice = ref(0.00);
    const importCnt = ref(0);
    const totalCost = ref(0.00);
    return {
      searchInput,
      searchType,
      books,
      buyCnt,
      editISBN,
      editName,
      editAuthor,
      editKeyword,
      editPrice,
      importCnt,
      totalCost,
      addISBN,
      searchOptions: [
        {
          label: "ISBN",
          value: "ISBN"
        },
        {
          label: "Name",
          value: "Name"
        },
        {
          label: "Author",
          value: "Author"
        },
        {
          label: "Keyword",
          value: "Keyword"
        }
      ],
      handleInput: () => search(searchType.value, searchInput.value, data => books.value = data),
      showAll: () => search("", "", data => books.value = data),
      changeSelection: (value) => select(value, data => message.info(data[0])),
      buyBtn: () => buy(checkedRowKeysRef.value[0], buyCnt.value, data => message.info(data[0])),
      addBtn: () => add(addISBN.value, data => message.info(data[0])),
      editBtn: () => edit({
        ISBN: editISBN.value,
        Name: editName.value,
        Author: editAuthor.value,
        Keyword: editKeyword.value,
        Price: editPrice.value
      }, data => message.info(data[0])),
      importBtn: () => importBook(importCnt.value, totalCost.value, data => message.info(data[0])),
      checkedRowKeys: checkedRowKeysRef,
      pagination: {
        pageSize: 20
      },
      columns: createColumns()
    };
  }
});
</script>