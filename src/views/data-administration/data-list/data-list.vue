<!--
 * @Description: 数据列表
-->
<style lang="less" >
  .data-list-view {
    height: calc(100% - 20px);
    // margin: 10px;
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
    .keywordView{
      width: 188px;
      .ant-input-affix-wrapper{
        height: 32px;
      }
      .ant-input-suffix{
        // height: 15px;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
      }
    }
</style>
<template>
  <div class="p-4 data-list-view">
    <!-- 
       title="表单管理"
      titleHelpMessage="表单管理"
     -->
    <BasicTable
      :columns="BasicTableData.columns"
      :dataSource="BasicTableData.list"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      showTableSetting
      editable
      :rowSelection="{type: 'checkbox', fixed: true, checkStrictly: false, CheckRowBox: true}"
      :pagination="pagination"
      @change="handlerChange"
      @columns-change="handleColumnChange"
      @row-click="rowClick"
    >
      <template #toolbar>
        <div style="display: flex;flex-direction: row;
        flex-wrap: nowrap;flex: 1;
        justify-content: space-between;">
        <div>
          <Button type="primary" @click="goBack" :icon="h(ArrowLeftOutlined)" style="margin: 0 10px">
          {{ '返回' }}
        </Button>
          <Button type="primary" @click="handleOpenModal(eFormAddValue)" :icon="h(PlusOutlined)">
          {{ '新增' }}
        </Button>
          <Button type="link" :icon="h(EditOutlined)" > 编辑 </Button>
          <Button type="link" :icon="h(CopyOutlined)" > 复制 </Button>
          <Button type="link" :icon="h(UploadOutlined)" > 导入 </Button>
          <Button type="link" :icon="h(DownloadOutlined)" > 导出 </Button>
          <Button type="link" :icon="h(DeleteOutlined)" > 删除 </Button>
          <Button type="link" :icon="h(WarningOutlined)" > 回收站 </Button>
        </div>
        <div>
          <InputSearch
              ref="keywordRef"
              placeholder="请输入"
              v-model:value="keyword"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
          <Button type="link" :icon="h(FunnelPlotOutlined)" > 筛选 </Button>
        </div>
        </div>
      </template>
      <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div class="FilterDropdown-view">
          <Input
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
    </BasicTable>
  <VFormAddValue ref="eFormAddValue" :key="formConfig.title" :formConfig="formConfig" :handleGetDatas="handleGetDatas" :updateDynamicValue="updateDynamicValue"/>
  <VFormAddValueN ref="VFormAddValue1" :key="formConfig.title" :formConfig="formConfig" :handleGetDatas="handleGetDatas" :updateDynamicValue="updateDynamicValue" :changeIsEdit="changeIsEdit"/>
  <JsonModal ref="jsonModal" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, h, reactive, watch } from 'vue';
  import { BasicTable, ColumnChangeParam } from '@/components/Table';
  import { PlusOutlined, ArrowLeftOutlined, EditOutlined, CopyOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined, WarningOutlined, FunnelPlotOutlined} from '@ant-design/icons-vue';
  import VFormAddValue from '@/views/form-design/components/VFormAddValue/index.vue';
  import VFormAddValueN from '@/views/form-design/components/VFormAddValue/index.vue';
  import JsonModal from '@/views/form-design/components/VFormDesign/components/JsonModal.vue';
  import { useRouter } from 'vue-router';
  import { Button, Input, InputSearch } from 'ant-design-vue';
  import { getRandomOneApi } from '@/api/sys/form';
  import { getOneFieldApi, getAllDynamicValueApi, AddDynamicValueApi, getOneDynamicValueApi, UpdataDynamicValueApi } from '@/api/sys/data';
  import { IFormConfig  } from '@/views/form-design/typings/v-form-component';
  import { IToolbarMethods } from '@/views/form-design/typings/form-type';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useFormStore } from '@/store/modules/form';  
  const FormStore = useFormStore();

  const { notification } = useMessage();
  const canResize = ref(true);
  const loading = ref(true);
  const striped = ref(false);
  const border = ref(true);
  const pagination = ref<any>(true);
  const searchInput = ref<any>();
  const keyword = ref<any>('');
  const keywordRef = ref<any>(true);
  const jsonModal = ref<null | IToolbarMethods>(null);
  const eFormAddValue = ref<null | IToolbarMethods | any>(null);
  const VFormAddValue1 = ref<null | IToolbarMethods>(null);
  const RandomOneData = ref<any>(null);
  const isEdit = ref<boolean>(false);
  const recordValue = ref<any>(null);
  const recordObj = ref<any>(null);
  // const key = Symbol();
  const formConfig = ref<IFormConfig>({
    title: '新增表单',
    submitFormTemplateTxt: '保存数据',
    // 表单配置
    schemas: [],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    currentItem: {
      component: '',
      componentProps: {},
    },
    activeKey: 1,
  });
  const { go } = useRouter();
  const onSearchKeyword = (searchValue: string) => {
    console.log('searchValue',searchValue)
    getFormManagerList()
  }
  const goBack = () =>{
    go(-1)
  }
  const changeIsEdit = (Edit: any)=>{
    isEdit.value = Edit
  }   
    /**
   * 打开模态框
   * @param Modal {IToolbarMethods}
   */
   const handleOpenModal = async (Modal: IToolbarMethods, id?: string |number | any, type?: any) => {
    FormStore.updateIsPreview(false)
    formConfig.value =  await getOneFieldApi({ id: history.state.id, formVersion: history.state.formVersion }) as any;

    const RandomOne = formConfig.value?.schemas.some(
      (item) => item.component ==='Correlation',
    );
    RandomOne&&!type ? RandomOneData.value = await getRandomOneApi() : RandomOne&&type ? RandomOneData.value = recordObj.value.joinValue : null
    const config = await cloneDeep(formConfig.value);
    await Modal?.showModal(config, id);
  };
  watch(
    () => FormStore.addchildrenData,
    async (value:any) => {
      console.log('value', value)
      /* if(value){
        // 
        const config = cloneDeep(formConfig.value.childrenData[value]);
        if(isEdit.value){
          VFormAddValue1!.value!.setFormModelfun(config, true)
          VFormAddValue1.value!?.showModal(config, value);

        }else{
          VFormAddValue1.value!?.showModal(config, value);
        }

        // await handleOpenModal(VFormAddValue1.value!, value);
      }else{
        
      } */
    },
  );
  watch(
    () => FormStore.childrenSubmit,
    async (value:any) => {
      if(value.text === '打开子表单1'){
        const config = cloneDeep(formConfig.value.childrenData[FormStore.addchildrenData]);
        if(isEdit.value){
          // const data = await getOneDynamicValueApi({valueId: record.id})
          VFormAddValue1!.value!.setFormModelfun(recordValue.value, true)
          VFormAddValue1.value!?.showModal(config, FormStore.addchildrenData);
        }else{
          VFormAddValue1.value!?.showModal(config, FormStore.addchildrenData);
        }
      }
      /* if(value){
        // 
        const config = cloneDeep(formConfig.value.childrenData[value]);
        if(isEdit.value){
          VFormAddValue1!.value!.setFormModelfun(config, true)
          VFormAddValue1.value!?.showModal(config, value);

        }else{
          VFormAddValue1.value!?.showModal(config, value);
        }

        // await handleOpenModal(VFormAddValue1.value!, value);
      }else{
        
      } */
    },
    { deep: true },
  );
  // const columns = getBasicColumns(searchInput);
  const BasicTableData = reactive({
    list:[],
    versionList: [],
    columns: [],
    current: 1,
    size: 10,
  });
  
  const handleGetDatas = async (_data,id) => {
    const data = await AddDynamicValueApi({fieldValueJson: JSON.stringify(_data), fromId: id,joinValue: RandomOneData.value})
    notification.success({
      message: data,
      duration: 3,
    });
    getFormManagerList();
    handleBasicColumns();
    FormStore.updateIsPreview(true)
    isEdit.value = false
    if(FormStore.childrenSubmit.text === '子表单提交'){
      FormStore.updateChildrenSubmit('')
    }
  };
  const updateDynamicValue = async (_data,fromId) => {
    const data = await UpdataDynamicValueApi({fieldValueJson: JSON.stringify(_data), fromId: fromId, id: recordObj.value.id,joinValue: RandomOneData.value })
    notification.success({
      message: data,
      duration: 3,
    });
    getFormManagerList();
    handleBasicColumns();
    FormStore.updateIsPreview(true)
    isEdit.value = false
    if(FormStore.childrenSubmit.text === '子表单提交'){
      FormStore.updateChildrenSubmit('')
    }
  };
  const handleBasicColumns = () =>{
    getOneFieldApi({
      id: history.state.id,
      formVersion: history.state.formVersion
    }).then(res=>{
      if(res&&res.schemas&&res.schemas.length){
      let arr = [];
        if(res.joinFrom&& res.joinFrom.length){
          res.joinFrom.split(',').forEach(el=>{
            arr = [...arr, ...res.childrenData[el].schemas]
          })
        }
        arr =  [...arr, ...res.schemas]
        BasicTableData.columns = arr.map((item, index)=>{
          console.log('index',index)
          return {
            title: item.label,
            dataIndex: item.key,
            sorter: true,
            // customFilterDropdown: true,
          }
        })
        BasicTableData.columns = [...BasicTableData.columns, {title: "提交者",dataIndex: 'createBy', sorter: true,/* customFilterDropdown: true, */},{title: "提交时间",dataIndex: 'createTime', sorter: true,/* customFilterDropdown: true, */},{title: "更新者",dataIndex: 'modifiedBy', sorter: true,/* customFilterDropdown: true, */},{title: "更新时间",dataIndex: 'modifiedAt', sorter: true,/* customFilterDropdown: true, */}]

      }
    }).catch(e=>{console.log('e', e)})
  }
  const handlerChange = params =>{
    BasicTableData.current = params.current
    BasicTableData.size = params.pageSize
    // 更新翻页器参数
    pagination.value= {current: params.current};
    getFormManagerList()
  }
  const getFormManagerList = async () =>{
    try{
      const data = await getAllDynamicValueApi({current: BasicTableData.current, size: BasicTableData.size, fromId: history.state.id, sortType: 0, param: keyword.value});
      loading.value = false;
      BasicTableData.list = data!.records
      pagination.value = {total: data.total}
    }catch(e){
      loading.value = false;
    }
  return BasicTableData.list
}
  const state = reactive({
    searchText: '',
    searchedColumn: '',
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters({ confirm: true });
    state.searchText = '';
  };
  const rowClick = async  (record) => {
    recordObj.value = record;
    //点击行
    // const data = await getOneDynamicValueApi({valueId: record.id})
    recordValue.value = await getOneDynamicValueApi({valueId: record.id})
    await eFormAddValue.value!.setFormModelfun(recordValue.value, true)
    await handleOpenModal(eFormAddValue.value!, record.id, '编辑');
    FormStore.updateIsPreview(false)
    isEdit.value = true
  }
  function handleColumnChange(data: ColumnChangeParam[]) {
    console.log('data',data)
  }
  onMounted(() => {
    getFormManagerList();
    handleBasicColumns();
  });
</script>
