<template>
  <div class="p-4 my-gantt">
    <!-- follow-up-list 随访 -->
    <BasicTable
      :columns="BasicTableData.columns"
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
      @row-click="rowClick"
      @filterDropdown="filterDropdown"
    >
   <!--  <template #headerCell="{ column }">
      {{column }}
    </template> -->

    <template #form-custom> custom-slot </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据 </a-button>
    </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import {
    reactive,
    toRefs,
    onBeforeMount,
    onMounted,
    watchEffect,
    defineExpose,
    h,
    ref,
  } from 'vue';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import {
    getOneFieldApi,
    getAllDynamicValueApi,
    AddDynamicValueApi,
    getOneDynamicValueApi,
    UpdataDynamicValueApi,
    DeleTeDynamicValueApi,
  } from '@/api/sys/data';
  const loading = ref(true);
  const pagination = ref<any>(true);
  const keyword = ref<any>('');
  const keywordRef = ref<any>(true);
  const striped = ref(false);
  const border = ref(true);
  const canResize = ref(true);
  const BasicTableData = reactive({
    list: [],
    versionList: [],
    columns: [],
    current: 1,
    size: 10,
  });
  const filterDropdown = () => {
    // console.log('filterDropdown')
  }
  const rowClick = async  (record) => {
    // recordObj.value = record;

  }
  const [registerTable, { getForm }] = useTable({
    title: '开启搜索区域',
    // api: demoListApi,
    // columns: getBasicColumns(),
    useSearchForm: true,
    // formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true, // 显示多选状态栏
  });
  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
  function handleColumnChange(data: ColumnChangeParam[]) {
    // console.log('data',data)
  }
  const onSearchKeyword = (searchValue: string) => {
    // console.log('searchValue',searchValue)
    getFormManagerList();
  };
  const handlerChange = (params) => {
    BasicTableData.current = params.current;
    BasicTableData.size = params.pageSize;
    // 更新翻页器参数
    pagination.value = { current: params.current };
    getFormManagerList();
  };
  const handleBasicColumns = () => {
    BasicTableData.columns = [
      { title: '序号',dataIndex: 'id' },
      { title: '随访规则名称', dataIndex: 'createBy', sorter: false },
      { title: '研究项目', dataIndex: 'createBy1', sorter: false },
      { title: '科室', dataIndex: 'createBy1', sorter: false },
      { title: '访视周期', dataIndex: 'createBy1', sorter: false },
      { title: '病例报告表', dataIndex: 'createBy1', sorter: false },
      { title: '是否启用', dataIndex: 'createBy1', sorter: false },
      { title: '创建时间', dataIndex: 'createBy1', sorter: false },
      { title: '操作', dataIndex: 'createBy1', sorter: false },
    ];
  };
  const getFormManagerList = async () => {
    try {
      const data = await getAllDynamicValueApi({
        current: BasicTableData.current,
        size: BasicTableData.size,
        fromId: history.state.id,
        sortType: 0,
        param: keyword.value,
      });
      loading.value = false;
      BasicTableData.list = data!.records;
      pagination.value = { total: data.total };
    } catch (e) {
      loading.value = false;
    }
    return BasicTableData.list;
  };
  onBeforeMount(() => {});
  onMounted(() => {
    getFormManagerList();
    handleBasicColumns();
  });
  watchEffect(() => {});
  defineExpose({
    // ...toRefs(data),
  });
</script>
<style scoped lang="scss"></style>
