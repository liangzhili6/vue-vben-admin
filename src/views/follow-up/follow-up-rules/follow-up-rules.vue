<template>
  <div class="p-4 flex flex-col">
    <!-- <div class="mb-4">
      <a-button class="mr-2" @click="reloadTable"> 还原 </a-button>
    </div> -->
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <div
          style="
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            flex: 1;
            justify-content: space-between;
          "
        >
          <div style="display: flex;">
            <Input
              ref="keywordRef"
              placeholder="请输入方案名称"
              v-model:value="keyword"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
            <Select
              ref="keywordRef"
              placeholder="请输入方案名称"
              style="margin-left: 10px"
              v-model:value="formConfig.projectName"
              :allowClear="true"
              class="keywordView"
              :options="formConfig.projectNameOptions.map(pro => ({ value: pro.dataIndex, label: pro.title }))" 
            />
          </div>
          <div>
            <Button type="primary" @click="getFormValues">搜索</Button>
            <Button type="primary" @click="getFormValues">清空</Button>
            <Button type="primary" @click="addModal=true">新增</Button>
          </div>
        </div>
      </template>
    </BasicTable>
    <Modal v-model:open="addModal" :title="title" @ok="handleOk" :width="'60%'" >
      <!-- height="80%" style="overflow: hidden;overflow-y: scroll;" -->
      <template #footer>
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <!-- <div> -->
      <!-- <template #body> -->
        <BasicForm @register="register" >
        <template #add="{ field }">
          <Table :dataSource="formConfig.dataSource" :columns="formConfig.TableColumns" :pagination="false">
            <template #bodyCell="{ column, text, record }">
              <!--   {{ text }} {{ record }} {{field}} -->
              <template v-if="column.dataIndex === 'AssociatedDate'">
                <div class="editable-cell">
                  <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                    <Select
                      ref="keywordRef"
                      placeholder="请输入方案名称"
                      v-model:value="editableData[record.key].AssociatedDate"
                      :allowClear="true"
                      class="keywordView"
                      :options="formConfig.projectNameOptions.map(pro => ({ value: pro.dataIndex, label: pro.title }))" 
                    />
                    <!-- <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" /> -->
                    <!-- <check-outlined class="editable-cell-icon-check" @click="save(record.key)" /> -->
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }}
                    <!-- <edit-outlined class="editable-cell-icon" @click="edit(record.key)" /> -->
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'startTime'">
                <div class="editable-cell">
                  <div v-if="editableData[record.key]" class="editable-cell-input-wrapper" style="display: flex;">
                    <a-input v-model:value="editableData[record.key].startTime" @pressEnter="save(record.key)" /> 
                    <span style="width: 40px;"> 天后</span>
                    <!-- <check-outlined class="editable-cell-icon-check" @click="save(record.key)" /> -->
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }} 天后
                    <!-- <edit-outlined class="editable-cell-icon" @click="edit(record.key)" /> -->
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'endTime'">
                <div class="editable-cell">
                  <div v-if="editableData[record.key]" class="editable-cell-input-wrapper" style="display: flex;">
                    <a-input v-model:value="editableData[record.key].endTime" @pressEnter="save(record.key)" /> 
                    <span style="width: 40px;"> 天后</span>
                    <!-- <check-outlined class="editable-cell-icon-check" @click="save(record.key)" /> -->
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }} 天后
                    <!-- <edit-outlined class="editable-cell-icon" @click="edit(record.key)" /> -->
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'note'">
                <div class="editable-cell">
                  <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                    <a-input v-model:value="editableData[record.key].note" @pressEnter="save(record.key)" />
                    <!-- <check-outlined class="editable-cell-icon-check" @click="save(record.key)" /> -->
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }}
                    <!-- <edit-outlined class="editable-cell-icon" @click="edit(record.key)" /> -->
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'edit'">
                <div class="editable-cell">
                  <div  class="editable-cell-input-wrapper">
                    <!-- <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" /> -->
                    <check-outlined v-if="editableData[record.key]" class="editable-cell-icon-check" @click="save(record.key)" />
                    <edit-outlined v-else class="editable-cell-icon" @click="edit(record.key)" />
                    <delete-outlined class="editable-cell-icon" style="margin-left: 10px" @click="edit(record.key)" />
                  </div>
                  <!-- <div  class="editable-cell-text-wrapper">
                    <delete-outlined class="editable-cell-icon" style="margin-left: 10px" @click="edit(record.key)" />
                  </div> -->
                </div>
              </template>
            </template>
            <template #summary>
            <a-table-summary :fixed="'bottom'" :border="true" >
              <!-- <a-table-summary-row> -->
                <!-- <a-table-summary-cell :index="2" :col-span="24"> -->
                  <plus-outlined class="editable-cell-icon" style="margin-left: 10px" @click="handleAdd()" />
                  <span>添加</span>
                <!-- </a-table-summary-cell> -->
              <!-- </a-table-summary-row> -->
            </a-table-summary>
          </template>
          </Table>
          <!-- <a-button v-if="Number(field) === 0" @click="add">+</a-button>
          <a-button class="ml-2" v-if="Number(field) === 0" @click="batchAdd">
            批量添加表单配置
          </a-button>
          <a-button v-if="Number(field) > 0" @click="() => del(field)">-</a-button> -->
        </template>
      </BasicForm>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import {
    getOneFieldApi,
    getAllDynamicValueApi,
    AddDynamicValueApi,
    getOneDynamicValueApi,
    UpdataDynamicValueApi,
    DeleTeDynamicValueApi,
  } from '@/api/sys/data';
  import { getAllRulesApi } from '@/api/sys/follow-up';
  import { cloneDeep } from 'lodash-es';
  import { onMounted, reactive, ref, UnwrapRef  } from 'vue';
  import { Button, Input, InputSearch, Popconfirm, message, Select, Modal, Table } from 'ant-design-vue';
const keyword = ref<any>('');
const addModal = ref<boolean>(true)
const loading = ref<boolean>(false);
  const title = ref<string>('新增随访规则');
  // const pagination = ref<any>(true);
  // const [registerForm, { validate }] = useForm();
  const editableData: UnwrapRef<Record<string, any>> = reactive({});
    const edit = (key: string) => {
      console.log('edit', key)
      editableData[key] = cloneDeep(formConfig.dataSource.filter(item => key === item.key)[0]);
    };
    const save = (key: string) => {
      console.log('save', key)
      Object.assign(formConfig.dataSource.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
      formConfig.dataSource = [].concat(formConfig.dataSource);
    };
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
      } 
      /* 
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
      }, */,
    ],
    ruleName: '',
    projectName: '',
    projectNameOptions: [{
      dataIndex: 1,
      title: 1
    }],
    list: [],
    dataSource: [{
      visitCycle:'访视一',
      AssociatedDate: '1',
      startTime: '1',
      endTime:  '7',
      note: '1',
      key: 0,
    },{
      visitCycle:'访视二',
      AssociatedDate: '1',
      startTime: '1',
      endTime:  '7',
      note: '1',
      key: 1,
    },{
      visitCycle:'访视三',
      AssociatedDate: '1',
      startTime: '1',
      endTime:  '7',
      note: '1',
      key: 2,
    },{
      visitCycle:'访视四',
      AssociatedDate: '1',
      startTime: '1',
      endTime:  '7',
      note: '1',
      key: 3,
    }],
    TableColumns: [{
      title:'访视一',
      width: 150,
      dataIndex:'visitCycle',
    },{
      title:'关联日期',
      dataIndex:'AssociatedDate',
      width: 150,
    },{
      title:'随访开始时间',
      dataIndex:'startTime',
      width: 180,
    },{
      title:'随访结束时间',
      dataIndex:'endTime',
      width: 180,
    },{
      title:'短信',
      dataIndex:'note',
      width: 150,
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'edit',
    },]
  });
  let count = formConfig.dataSource.length;
  const handleAdd = () => {
      const newData = {
        key: `${count}`,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
        visitCycle:'访视四',
        AssociatedDate: '',
        startTime: '',
        endTime:  '',
        note: '',
      };
      count++;
      formConfig.dataSource.push(newData);
      formConfig.dataSource = [].concat(formConfig.dataSource);
      edit(newData.key)
    };
  const getSchamas = (): FormSchema[] => {
    return [
      {
        field: 'field1',
        component: 'Input',
        label: '规则名称',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '自定义placeholder',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'field2',
        component: 'Input',
        label: '研究项目',
        colProps: {
          span:  24,
        }
      },
      {
        field: 'field3',
        component: 'RadioGroup',
        label: '是否启用',
        colProps: {
          span:  24,
        },
        defaultValue: '1',
        componentProps: {
          options: [
            {
              label: '是',
              value: '1',
              key: '1',
            },
            {
              label: '否',
              value: '2',
              key: '2',
            },
          ],
        },
      },
      {
        field: 'field4',
        // component: 'Input',
        label: ' ',
        slot: 'add',
        itemProps: {
          "labelCol": {
            "span": 0
          },
          "wrapperCol": {
            "span": 24
          }
        }
      },
      {
        field: 'field5',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span:  12,
        },
        defaultValue: '1',
        componentProps: {
          options: [
            {
              label: '是',
              value: '1',
              key: '1',
            },
            {
              label: '否',
              value: '2',
              key: '2',
            },
          ],
        },
      },
      {
        field: 'field6',
        component: 'TimePicker',
        label: '短信随访任务开始执行时间',
        colProps: {
          span:  12,
        },
        defaultValue: '1',
        componentProps: {
          format: "HH:mm:ss",
          valueFormat: "HH:mm:ss"
        },
      },
      {
        field: 'field5',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span:  12,
        },
        defaultValue: '1',
        componentProps: {
          options: [
            {
              label: '是',
              value: '1',
              key: '1',
            },
            {
              label: '否',
              value: '2',
              key: '2',
            },
          ],
        },
      },
    ];
  };
  const [registerTable, { getForm }] = useTable({
    // title: '开启搜索区域',
    // api: getAllRulesApi,
    columns: getBasicColumns(),
    dataSource: formConfig.list,
    useSearchForm: false,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: false },
    showIndexColumn: true,
    rowKey: 'id',
    /* rowSelection: {
      type: 'checkbox',
    }, */
    showSelectionBar: false, // 显示多选状态栏
  });
  const [register] = useForm({
    labelWidth: 80,
    schemas: getSchamas(),
    actionColOptions: {
      span: 24,
    },
  /*   compact: true,
    showAdvancedButton: true, */
  });
  const showModal = () => {
    addModal.value = true;
  };
  const handleOk = () => {
  // loading.value = true;
  setTimeout(() => {
    // loading.value = false;
    addModal.value = false;
  }, 2000);
};
  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
  const handleCancel = () => {
    addModal.value = false;
  };
  const handleAllRulesApi = () => {
    getAllRulesApi({
      "current": 1,
      "size": 999,
      projectName: formConfig.projectName,
      ruleName: formConfig.ruleName,
    }).then((res: any)=>{
      if(res){
        formConfig.list = res.data.records;

      }
    }).catch((e: any)=>{})
  }
  const onSearchKeyword = (searchValue: string) => {
    console.log('searchValue', searchValue, searchValue.target.value)
    handleAllRulesApi()
    // console.log('searchValue',searchValue)
    // getFormManagerList()
  }
  onMounted(() => {
    // console.log('registerTable', registerTable);
    console.log('register.schemas', getSchamas())
    
    handleAllRulesApi();
  });
</script>
<style>
.ant-table-summary{
  border: 1px solid #cccccc;
}
</style>
