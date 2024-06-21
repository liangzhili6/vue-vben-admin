<template>
  <div class="p-4 flex flex-col">
    <!-- <div class="mb-4">
      <a-button class="mr-2" @click="reloadTable"> 还原 </a-button>
    </div> -->
  <BasicTable @register="registerTable" >
    <template #form-custom> custom-slot </template>
    <template #toolbar>
      <div style="display: flex;flex-direction: row; flex-wrap: nowrap;flex: 1; justify-content: space-between;">
        
    <!-- <BasicForm
      ref="formRef"
      submitOnReset
      v-bind="getFormProps"
      :tableAction="tableAction"
      @register="getFormConfig()"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormConfig()">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm> -->
        <div>
         <!--  <Input
              ref="keywordRef"
              placeholder="请输入"
              v-model:value="keyword"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
            <Input
              ref="keywordRef"
              placeholder="请输入"
              v-model:value="keyword"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            /> -->
   <!--  <BasicForm
      :labelWidth="100"
      :schemas="formConfig.schemas"
      :showActionButtonGroup="false"
      @register="registerForm"
    /> -->

          <Button type="primary" @click="getFormValues">搜索</Button>
          <Button type="primary" @click="getFormValues">清空</Button>
          <Button type="primary" @click="getFormValues">新增</Button>
        </div>
        <div>
          <Button type="primary" @click="getFormValues">搜索</Button>
          <Button type="primary" @click="getFormValues">清空</Button>
          <Button type="primary" @click="getFormValues">新增</Button>
          <!-- <InputSearch
              ref="keywordRef"
              placeholder="请输入"
              v-model:value="keyword"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
          <Button type="link" :icon="h(FunnelPlotOutlined)" > 筛选 </Button> -->
        </div>
      </div>
    </template>
  </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { getOneFieldApi, getAllDynamicValueApi, AddDynamicValueApi, getOneDynamicValueApi, UpdataDynamicValueApi, DeleTeDynamicValueApi } from '@/api/sys/data';
  import { demoListApi } from '@/api/demo/table';
  import { onMounted, reactive } from 'vue';
  import { Button, Input, InputSearch, Popconfirm, message } from 'ant-design-vue';

  const [registerTable, { getForm }] = useTable({
    // title: '开启搜索区域',
    api: demoListApi,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    /* rowSelection: {
      type: 'checkbox',
    }, */
    showSelectionBar: false, // 显示多选状态栏
  });

  const formConfig = reactive({
    schemas: [
      // ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `搜索方案名称`,
        component: 'Input',
        // slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `field11`,
        label: `研究项目`,
        component: 'Input',
        // slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },/* 
      {
        field: `field11`,
        label: `搜索`,
        component: 'Button',
        // slot: 'custom',
        componentProps: {
          placeholder: '请选择月份',
          value: '搜索',
          defaultValue: '搜索',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `field11`,
        label: `清空`,
        component: 'Button',
        // slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `field11`,
        label: `新增`,
        component: 'Button',
        // slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      }, */
    ],
  });
  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
  onMounted(()=>{
    console.log('registerTable', registerTable)
  })
</script>
