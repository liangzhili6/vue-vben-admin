<!--
 * @Description: 表单管理
-->
<template>
  <div class="form-manager-view">
    <!-- 
       title="表单管理"
      titleHelpMessage="表单管理"
     -->
    <BasicTable
      :columns="columns"
      :dataSource="data"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      showTableSetting
      editable
      :pagination="pagination"
      @columns-change="handleColumnChange"
    >
      <template #toolbar>
        <Button type="primary" @click="handleAddView" :icon="h(PlusOutlined)">
          {{ '新增' }}
        </Button>
      </template>
      <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div class="FilterDropdown-view">
          <a-input
            ref="searchInput"
            :placeholder="`请输入 ${column.title}`"
            :value="selectedKeys[0]"
            class="FilterDropdownInput"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @press-enter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <Button
            type="primary"
            size="small"
            class="FilterDropdownButton"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            搜索
          </Button>
          <Button size="small" class="FilterDropdownButtonTwo" @click="handleReset(clearFilters)">
            重置
          </Button>
        </div>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'formVersion'">
          <Dropdown :trigger="['click']" :destroyPopupOnHide="true">
            <a class="ant-dropdown-link" @click.prevent="handleFormVersion(record)">
              版本{{ text }}
              <DownOutlined />
            </a>
            <template #overlay>
              <Menu @click="openFormVersion">
                <Menu.Item v-for="item in BasicTableData.list" :key="item">
                  <a href="javascript:;">{{ item }}</a>
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </template>

        <template v-if="column.key === 'formType'">
          <Dropdown :trigger="['click']">
            <Button class="ant-dropdown-link" @click.prevent>
              <span
                class="MenuItem-span-view"
                :style="{ 'background-color': record.formType === 'CRF' ? '#52c41a' : '#1890ff' }"
              ></span>
              <span>&nbsp;&nbsp;</span>
              {{ record.formType ? record.formType : 'CRF' }}
              <DownOutlined />
            </Button>
            <template #overlay>
              <Menu>
                <Menu.Item>
                  <a href="javascript:;" class="CRF-view"> <span>&nbsp;&nbsp;</span>CRF </a>
                </Menu.Item>
                <Menu.Item>
                  <a href="javascript:;" class="CRF-view-t"> <span>&nbsp;&nbsp;</span>系统表单 </a>
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </template>
        <template v-if="column.key === 'status'">
          <Switch v-model:checked="record.status" @change="changeStatus(record)" />
        </template>
        <template v-if="column.key === 'operation'">
          <Button type="link" @click="AddForm"> 数据 </Button>
          <Button type="link" @click="handleLookView"> 查看 </Button>
          <Button type="link" @click="AddForm"> 编辑 </Button>
          <Dropdown :trigger="['click']">
            <SettingOutlined @click.prevent />
            <template #overlay>
              <Menu>
                <Menu.Item>
                  <a href="javascript:;">复制</a>
                </Menu.Item>
                <Menu.Item>
                  <a href="javascript:;">删除</a>
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, h, reactive } from 'vue';
  import { BasicTable, ColumnChangeParam } from '@/components/Table';
  import { getBasicColumns, getBasicData } from './tableData';
  import { SettingOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { Dropdown, Menu, Button, Switch } from 'ant-design-vue';
  import {
    FormManagerListApi,
    FormVersionListApi,
    UpdataDynamicFromStatusApi,
  } from '@/api/sys/form';

  const canResize = ref(true);
  const loading = ref(true);
  const striped = ref(false);
  const border = ref(true);
  const pagination = ref<any>(true);
  const searchInput = ref();
  const { replace } = useRouter();
  const columns = getBasicColumns(searchInput);
  const data = getBasicData();
  const BasicTableData = reactive({
    list: [],
    versionList: [],
  });
  const changeStatus = async (record) => {
    await UpdataDynamicFromStatusApi({ id: record.id, status: record.status ? 1 : 0 });
    getFormManagerList();
  };
  const openFormVersion = (e) => {
    console.log('openFormVersion', e);
  };
  const handleFormVersion = async (record) => {
    console.log('handleFormVersion', record);
    BasicTableData.list = await FormVersionListApi({ unCode: 1 });
    console.log('BasicTableData.list', BasicTableData.list);
  };
  const getFormManagerList = async () => {
    const data = await FormManagerListApi({ current: 1, size: 10, formName: '11', sortType: 0 });
    BasicTableData.list = data!.records;
    console.log('BasicTableData.list', BasicTableData.list);

    return (() => {
      const arr: any = [];
      for (let index = 0; index < 40; index++) {
        arr.push({
          id: `${index}`,
          name: 'John Brown',
          age: `1${index}`,
          no: `${index + 10}`,
          address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
          beginTime: new Date().toLocaleString(),
          endTime: new Date().toLocaleString(),
        });
      }
      console.log('arr', arr);
      return arr;
    })();
  };
  const handleAddView = () => {
    replace({ name: 'Design' });
  };
  const handleLookView = () => {
    replace({ name: 'CRF' });
  };
  const state = reactive({
    searchText: '',
    searchedColumn: '',
  });
  function AddForm() {
    console.log('AddForm');
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
  };

  const handleReset = (clearFilters) => {
    clearFilters({ confirm: true });
    state.searchText = '';
  };
  function handleColumnChange(data: ColumnChangeParam[]) {
    console.log('ColumnChanged', data);
  }
  onMounted(() => {
    getFormManagerList();
    // console.log('getFormManagerList', getFormManagerList());
    setTimeout(() => {
      loading.value = false;
      pagination.value = { pageSize: 20 };
    }, 3000);
  });
</script>
<style lang="less" scoped>
  .form-manager-view {
    height: calc(100% - 20px);
    margin: 10px;

    .MenuItem-span-view {
      width: 5px;
      height: 5px;
      margin-bottom: 3px;
      border-radius: 50%;
      background-color: #52c41a;
    }
  }

  .FilterDropdown-view {
    padding: 8px;
  }

  .FilterDropdownInput {
    display: block;
    width: 188px;
    margin-bottom: 8px;
  }

  .FilterDropdownButton {
    width: 90px;
    margin-right: 8px;
  }

  .FilterDropdownButtonTwo {
    width: 90px;
  }

  .CRF-view,
  .CRF-view-t {
    position: relative;
  }

  .CRF-view ::after,
  .CRF-view-t ::after {
    content: ' ';
    position: absolute;
    top: 8px;
    left: -3px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #52c41a;
  }

  .CRF-view-t ::after {
    background-color: #1890ff;
  }
</style>
