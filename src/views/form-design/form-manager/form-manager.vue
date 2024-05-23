<!--
 * @Description: 表单管理
-->
<style lang="less" scoped>
  .form-manager-view {
    height: calc(100% - 20px);
    .MenuItem-span-view{
      background-color: #52c41a;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      margin-bottom: 3px;

    }
  }
  .FilterDropdown-view{
      padding: 8px;
    }
    .FilterDropdownInput{
      width: 188px;
      margin-bottom: 8px;
      display: block;
    }
    .FilterDropdownButton{
      width: 90px;
      margin-right: 8px;
    }
    .FilterDropdownButtonTwo{
      width: 90px;
    }
    .CRF-view, .CRF-view-t{
      position: relative;
    }
    .CRF-view ::after, .CRF-view-t ::after{
      position: absolute;
      content: " ";
      background-color: #52c41a;
      left: -3px;
      top: 8px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }
    .CRF-view-t ::after{
      background-color: #1890ff;
    }
</style>
<template>
  <div class="p-4 form-manager-view">
    <!-- 
       title="表单管理"
      titleHelpMessage="表单管理"
      :rowSelection="{type: 'checkbox', fixed: true, checkStrictly: false}"
     -->
    <BasicTable
      :columns="columns"
      :dataSource="BasicTableData.list"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      showTableSetting
      editable
      :pagination="pagination"
      @change="handlerChange"
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
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
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
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'formVersion'">
          <Dropdown :trigger="['click']" :destroyPopupOnHide="true">
            <a class="ant-dropdown-link" @click.prevent="handleFormVersion(record)">
              {{record.formVersion}}
              <DownOutlined />
            </a>
            <template #overlay>
              <Menu @click="openFormVersion">
                <Menu.Item v-for="(item, index) in BasicTableData.versionList" :key="item.versionName" :item="record" :index="index">
                  <a href="javascript:;">{{item.formVersion}}</a>
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
                :style="{'background-color': record.formType ==='CRF'?'#52c41a':'#1890ff'}"
              ></span>
              <span>&nbsp;&nbsp;</span>
              {{ record.formType ? record.formType : 'CRF' }}
              <DownOutlined />
            </Button>
            <template #overlay>
              <Menu  @click="UpdateFormType">
                <Menu.Item key="CRF" :item="record">
                  <a href="javascript:;" class="CRF-view" >
                    <span>&nbsp;&nbsp;</span>CRF
                  </a>
                </Menu.Item>
                <Menu.Item key="系统表单" :item="record">
                  <a href="javascript:;" class="CRF-view-t" >
                    <span>&nbsp;&nbsp;</span>系统表单
                  </a>
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </template>
        <template v-if="column.key === 'status'">
          <Switch v-model:checked="record.statusNew" @change="changeStatus(record)"/>
        </template>
        <template v-if="column.key === 'operation'">
          <Button type="link" @click="AddForm(record)"> 数据 </Button>
          <Button type="link" @click="handleLookView(record)"> 查看 </Button>
          <Button type="link" @click="changeForm(record)"> 编辑 </Button>
          <Dropdown :trigger="['click']">
            <SettingOutlined @click.prevent />
            <template #overlay>
              <Menu @click="editForm">
                <Menu.Item key="复制" :item="record">
                  <a href="javascript:;">复制</a>
                </Menu.Item>
                <Menu.Item key="删除" :item="record">
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
  import { ref, onMounted, h, reactive  } from 'vue';
  import { BasicTable, ColumnChangeParam } from '@/components/Table';
  import { getBasicColumns } from './tableData';
  import {
    SettingOutlined,
    DownOutlined,
    PlusOutlined,
  } from '@ant-design/icons-vue';
  import { useFormStore } from '@/store/modules/form'; 
  import { useRouter } from 'vue-router';
  import { Dropdown, Menu, Button, Switch } from 'ant-design-vue';
  import { FormManagerListApi, FormVersionListApi, UpdataDynamicFromStatusApi, UpdataTypeForIdApi, CopyDynamicFromApi, DeleteFromApi } from '@/api/sys/form';
  import { useMessage } from '@/hooks/web/useMessage';
  const { notification } = useMessage();
  const canResize = ref(true);
  const loading = ref(true);
  const striped = ref(false);
  const border = ref(true);
  const pagination = ref<any>(true);
  const searchInput = ref();
  const {   push } = useRouter();
  const columns = getBasicColumns(searchInput);
  const BasicTableData = reactive({
    list:[],
    versionList: [],
    current: 1,
    size: 10,
    formName: '',
    sortType: 0,
    searchText: '',
    searchedColumn: '',
  });
  const handlerChange = params =>{
    BasicTableData.current = params.current
    BasicTableData.size = params.pageSize
    // 更新翻页器参数
    pagination.value= {current: params.current};
    getFormManagerList()
  }
  const UpdateFormType = async (val) =>{
    const data = await UpdataTypeForIdApi({id: val.item.item.id, fromType: val.key})
    notification.success({
      message: data,
      duration: 3,
    });
    getFormManagerList()
  }
  const changeStatus = async (record) =>{
    const data = await UpdataDynamicFromStatusApi({id: record.id,status: record.statusNew?1:0})
    notification.success({
      message: data,
      duration: 3,
    });
    getFormManagerList()
  }
  const openFormVersion = (FormVersion) =>{
    push({ name: 'Design1', state: { id: FormVersion.item.item.id, formVersion: FormVersion.key,formType: FormVersion.item.item.formType, isEdit: true }});
  }
  const handleFormVersion = async (record) =>{
    BasicTableData.versionList = await FormVersionListApi({unCode: record.unCode});
  }
  const getFormManagerList = async () =>{
  const data = await FormManagerListApi({current: BasicTableData.current, size: BasicTableData.size, formName: BasicTableData.formName, sortType: BasicTableData.sortType});
  loading.value = false;
  BasicTableData.list = data!.records.map((item)=>{
    return {
      ...item,
      statusNew: item.status===1? true:false
    }
  })
  pagination.value = {total: data.total}
  return BasicTableData.list
}
  const handleAddView = () => {
    push({ name: 'Design'});
  };
  const handleLookView = (record) => {
    const FormStore = useFormStore();
    FormStore.updateIsPreview(true)
    push({ name: 'Example2', state: { id: record.id, formVersion: record.formVersion }});
    //state--> History API 方式传递
  }
  async function editForm (val) {
    if(val.key === '复制'){
      const data = await CopyDynamicFromApi({fromId: val.item.item.id})
      notification.success({
        message: data,
        duration: 3,
      });
      getFormManagerList()
    }else{
      const data = await DeleteFromApi({fromId: val.item.item.id})
      notification.success({
        message: data,
        duration: 3,
      });
      getFormManagerList()
    }
  }
  async function  changeForm (record) {
    push({ name: 'Design1', state: { id: record.id, formVersion: record.formVersion,formType: record.formType, isEdit: true }});
  }
  function AddForm(record) {
    push({ name: 'DataList', state: { id: record.id, formVersion: record.formVersion }/* , query: { id: record.id, formVersion: record.formVersion }  */});
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    BasicTableData.formName = selectedKeys[0];
    BasicTableData.searchedColumn = dataIndex;
    confirm();
  };

  const handleReset = (clearFilters) => {
    BasicTableData.formName = '';
    clearFilters({ confirm: true });
  };
  function handleColumnChange(data: ColumnChangeParam[]) {
    console.log('data', data)
  }
  onMounted(() => {
    getFormManagerList();
  });
</script>
