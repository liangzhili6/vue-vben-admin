<template>
  <div class="p-4 flex flex-col">
    <!-- <div class="mb-4">
      <a-button class="mr-2" @click="reloadTable"> 还原 </a-button>
    </div> -->
    <!-- @register="registerTable"  -->
    <BasicTable
      :columns="getBasicColumns()"
      :dataSource="formConfig.list"
      :pagination="pagination"
      :showIndexColumn="false"
      @change="handlerChange"
    >
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
          <div style="display: flex">
            <Input
              ref="keywordRef"
              placeholder="请输入方案名称"
              style="width: 180px"
              v-model:value="formConfig.ruleName"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
            <Select
              ref="keywordRef"
              placeholder="请选择研究项目"
              style="margin-left: 10px; width: 180px"
              v-model:value="formConfig.projectName"
              :allowClear="true"
              class="keywordView"
              :options="
                formConfig.projectNameOptions.map((pro) => ({
                  value: pro.projectCode,
                  label: pro.projectName,
                }))
              "
            />
          </div>
          <div>
            <Button type="primary" @click="getFormValues">搜索</Button>
            <Button type="primary" @click="empty" style="margin-left: 10px">清空</Button>
            <Button
              type="primary"
              @click="
                getSchamas();
                addModal = true;
              "
              style="margin-left: 10px"
              >新增</Button
            >
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'edit'">
          <Button
            type="link"
            block
            style="width: 80px"
            @click="
            title = '编辑随访规则'
              handleItem(record.id);
              addModal = true;
            "
            >编辑</Button
          >
          <Button type="link" danger style="width: 80px" @click="deleteRulesfun(record.id)">删除</Button>
        </template>
      </template>
    </BasicTable>
    <Modal v-model:open="addModal" :title="title" @ok="handleOk" :width="'60%'">
      <!-- height="80%" style="overflow: hidden;overflow-y: scroll;" -->
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
      </template>
      <!-- <div> -->
      <!-- <template #body> -->
      <BasicForm @register="register">
        <template #add="{ field }">
          <div>
            <Table
              :dataSource="formConfig.dataSource"
              :columns="formConfig.TableColumns"
              :pagination="false"
              :border="true"
            >
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
                        :options="
                          formConfig.projectNameOptions.map((pro) => ({
                            value: pro.projectCode,
                            label: pro.projectName,
                          }))
                        "
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
                    <div
                      v-if="editableData[record.key]"
                      class="editable-cell-input-wrapper"
                      style="display: flex"
                    >
                      <a-input
                        v-model:value="editableData[record.key].startTime"
                        @pressEnter="save(record.key)"
                      />
                      <span style="width: 40px"> 天后</span>
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
                    <div
                      v-if="editableData[record.key]"
                      class="editable-cell-input-wrapper"
                      style="display: flex"
                    >
                      <a-input
                        v-model:value="editableData[record.key].endTime"
                        @pressEnter="save(record.key)"
                      />
                      <span style="width: 40px"> 天后</span>
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
                      <a-input
                        v-model:value="editableData[record.key].note"
                        @pressEnter="save(record.key)"
                      />
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
                    <div class="editable-cell-input-wrapper">
                      <!-- <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" /> -->
                      <check-outlined
                        v-if="editableData[record.key]"
                        class="editable-cell-icon-check"
                        @click="save(record.key)"
                      />
                      <edit-outlined v-else class="editable-cell-icon" @click="edit(record.key)" />
                      <delete-outlined
                        class="editable-cell-icon"
                        style="margin-left: 10px"
                        @click="edit(record.key)"
                      />
                    </div>
                    <!-- <div  class="editable-cell-text-wrapper">
                    <delete-outlined class="editable-cell-icon" style="margin-left: 10px" @click="edit(record.key)" />
                  </div> -->
                  </div>
                </template>
              </template>
              <template #summary>
                <TableSummaryCell
                  :col-span="24"
                  :fixed="'bottom'"
                  :border="true"
                  v-if="formConfig.dataSource.length < 5"
                >
                  <Button
                    type="dashed"
                    block
                    style="width: calc(100% - 4px); margin: 2px"
                    @click="handleAdd()"
                  >
                    <template #icon>
                      <PlusOutlined />
                    </template>
                  </Button>
                  <!-- <a-table-summary-row> -->
                  <!-- <a-table-summary-cell :index="2" :col-span="24"> -->
                  <!-- <plus-outlined class="editable-cell-icon" style="margin-left: 10px" @click="handleAdd()" />
                  <span>添加</span> -->
                  <!-- </a-table-summary-cell> -->
                  <!-- </a-table-summary-row> -->

                  <!-- <Button type="dashed" block style="width: calc(100% - 4px); margin: 2px;" >
                <template #icon>
                  <PlusOutlined @click="handleAdd()" />
                </template>
              </Button> -->
                </TableSummaryCell>
              </template>
            </Table>
            <!--         <Button type="dashed" block style="width: calc(100% - 4px); margin: 2px;" @click="handleAdd()" >
                <template #icon>
                  <PlusOutlined/>
                </template>
              </Button> -->
          </div>
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
  import {
    CheckOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EllipsisOutlined,
  } from '@ant-design/icons-vue';
  import {
    getOneFieldApi,
    getAllDynamicValueApi,
    AddDynamicValueApi,
    getOneDynamicValueApi,
    UpdataDynamicValueApi,
    DeleTeDynamicValueApi,
  } from '@/api/sys/data';
  import {
    getAllRulesApi,
    getAllProjectNotParamApi,
    getOneRulesApi,
    addRulesApi,
    updataRulesApi,
    deleteRulesApi,
  } from '@/api/sys/follow-up';
  import { cloneDeep } from 'lodash-es';
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Input,
    InputSearch,
    Popconfirm,
    message,
    Select,
    Modal,
    Table,
    TableSummaryCell,
    TableSummary,
  } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  const { notification } = useMessage();
  const keyword = ref<any>('');
  const addModal = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const followUpItem = ref<any>();
  const title = ref<string>('新增随访规则');
  const pagination = ref<any>(true);
  // const [registerForm, { validate }] = useForm();
  const editableData: UnwrapRef<Record<string, any>> = reactive({});
  const edit = (key: string) => {
    console.log('edit', key);
    editableData[key] = cloneDeep(formConfig.dataSource.filter((item) => key === item.key)[0]);
  };
  const save = (key: string) => {
    console.log('save', key);
    Object.assign(formConfig.dataSource.filter((item) => key === item.key)[0], editableData[key]);
    delete editableData[key];
    formConfig.dataSource = [].concat(formConfig.dataSource);
  };
  const ruleInfoJson = reactive({
    SMSRules: {
      field5: '',
      field6: '',
      field7: '',
      field8: '',
      field9: '',
      field10: '',
      field11: '',
      field12: '',
    },
    VisitCycle: [],
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
      },
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
      }, */
    ],
    current: 1,
    size: 10,
    ruleName: '',
    projectName: '',
    projectNameOptions: [],
    projectNameArr: [],
    list: [],
    dataSource: [
      {
        visitCycle: '访视一',
        AssociatedDate: '1',
        startTime: '1',
        endTime: '7',
        note: '1',
        key: 0,
      },
      {
        visitCycle: '访视二',
        AssociatedDate: '1',
        startTime: '1',
        endTime: '7',
        note: '1',
        key: 1,
      },
      {
        visitCycle: '访视三',
        AssociatedDate: '1',
        startTime: '1',
        endTime: '7',
        note: '1',
        key: 2,
      },
      {
        visitCycle: '访视四',
        AssociatedDate: '1',
        startTime: '1',
        endTime: '7',
        note: '1',
        key: 3,
      },
    ],
    TableColumns: [
      {
        title: '访视一',
        width: 150,
        dataIndex: 'visitCycle',
      },
      {
        title: '关联日期',
        dataIndex: 'AssociatedDate',
        width: 150,
      },
      {
        title: '随访开始时间',
        dataIndex: 'startTime',
        width: 180,
      },
      {
        title: '随访结束时间',
        dataIndex: 'endTime',
        width: 180,
      },
      {
        title: '短信',
        dataIndex: 'note',
        width: 150,
      },
      {
        title: '操作',
        width: 150,
        dataIndex: 'edit',
      },
    ],
  });
  let count = formConfig.dataSource.length;
  const handleAdd = () => {
    const newData = {
      key: `${count}`,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
      visitCycle: '访视四',
      AssociatedDate: '',
      startTime: '',
      endTime: '',
      note: '',
    };
    count++;
    formConfig.dataSource.push(newData);
    formConfig.dataSource = [].concat(formConfig.dataSource);
    edit(newData.key);
  };
  const handlerChange = (params) => {
    formConfig.current = params.current;
    formConfig.size = params.pageSize;
    // 更新翻页器参数
    pagination.value = { current: params.current };
    handleAllRulesApi();
  };
  const projectNameList = async () => {
    await getAllProjectNotParamApi()
      .then((res: any) => {
        if (res) {
          formConfig.projectNameOptions = res;
          formConfig.projectNameArr = res.map((val) => {
            return {
              ...val,
              value: val.projectCode,
              label: val.projectName,
              key: val.projectCode,
            };
          });
          updateSchema([
      {
        field: 'ruleName',
        component: 'Input',
        label: '规则名称',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入规则名称',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'projectCode',
        component: 'Select',
        label: '研究项目',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请选择研究项目',
          options: formConfig.projectNameArr /*  [
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
          ], */,
        },
      },
      {
        field: 'status',
        component: 'RadioGroup',
        label: '是否启用',
        colProps: {
          span: 24,
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
          hiddenLabel: true,
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 24,
          },
        },
      },
      {
        field: 'field5',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
          span: 16,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
        },
      },
      {
        field: 'field7',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
        field: 'field8',
        component: 'Select',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
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
        field: 'field9',
        component: 'TimePicker',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
        },
      },
      {
        field: 'field10',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
        field: 'field11',
        component: 'Select',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
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
        field: 'field12',
        component: 'TimePicker',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
        },
      },
    ])
        }
      })
      .catch((e: any) => {});
  };
  const getSchamas = () => {
    projectNameList();
    console.log('formConfig.projectNameArr', formConfig.projectNameArr);
    return [
      {
        field: 'ruleName',
        component: 'Input',
        label: '规则名称',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入规则名称',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'projectCode',
        component: 'Select',
        label: '研究项目',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请选择研究项目',
          options: formConfig.projectNameArr /*  [
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
          ], */,
        },
      },
      {
        field: 'status',
        component: 'RadioGroup',
        label: '是否启用',
        colProps: {
          span: 24,
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
          hiddenLabel: true,
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 24,
          },
        },
      },
      {
        field: 'field5',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
          span: 16,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
        },
      },
      {
        field: 'field7',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
        field: 'field8',
        component: 'Select',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
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
        field: 'field9',
        component: 'TimePicker',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
        },
      },
      {
        field: 'field10',
        component: 'RadioGroup',
        label: '是否启用短信随访(患者)',
        colProps: {
          span: 8,
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
        field: 'field11',
        component: 'Select',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
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
        field: 'field12',
        component: 'TimePicker',
        label: '短信随访任务开始执行时间',
        colProps: {
          span: 8,
        },
        defaultValue: '1',
        componentProps: {
          format: 'HH:mm',
          valueFormat: 'HH:mm',
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
  const handleSubmit = () => {
    console.log('handleSubmit');
  };
  const [register, { updateSchema, submit, getFieldsValue }] = useForm({
    // labelWidth: 80,
    schemas: getSchamas(),
    actionColOptions: {
      span: 24,
    },
    /*   compact: true,
    showAdvancedButton: true, */
  });

  /* console.log(
    'updateSchema',
    updateSchema,
    formConfig.projectNameArr,
    updateSchema({
      field: 'field2',
      component: 'Select',
      label: '研究项目',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请选择研究项目',
        options: formConfig.projectNameArr,
      },
    }),
  ); */
  /* updateSchema({
    field: 'field2',
    component: 'Select',
    label: '研究项目',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请选择研究项目',
      options: formConfig.projectNameArr
    },
  }); */
  const showModal = () => {
    addModal.value = true;
  };

  const handleItem = (id) => {
    getOneRulesApi({ id }).then((res) => {
      console.log('handleItem', res);
      followUpItem.value = res
    });
    getSchamas();
  };
  const empty = () => {
    console.log('empty');
    formConfig.ruleName = '';
    formConfig.projectName = '';
    handleAllRulesApi();
  };
  function getFormValues() {
    handleAllRulesApi();
    /* console.log('registerTable', registerTable);
    console.log(getForm());
    console.log(getForm().getFieldsValue()); */
  }
  const handleCancel = () => {
    addModal.value = false;
  };
  const handleAllRulesApi = () => {
    getAllRulesApi({
      current: formConfig.current,
      size: formConfig.size,
      projectName: formConfig.projectName,
      ruleName: formConfig.ruleName,
    })
      .then((res: any) => {
        if (res) {
          formConfig.list = res.records;
        }
      })
      .catch((e: any) => {});
  };
  const onSearchKeyword = (searchValue: string) => {
    console.log('searchValue', searchValue, searchValue.target.value);
    handleAllRulesApi();
    // console.log('searchValue',searchValue)
    // getFormManagerList()
  };
  const handleOk = () => {
    console.log('followUpItem.value', followUpItem.value)
    ruleInfoJson.SMSRules.field5 = getFieldsValue().field5;
    ruleInfoJson.SMSRules.field6 = getFieldsValue().field6;
    ruleInfoJson.SMSRules.field7 = getFieldsValue().field7;
    ruleInfoJson.SMSRules.field8 = getFieldsValue().field8;
    ruleInfoJson.SMSRules.field9 = getFieldsValue().field9;
    ruleInfoJson.SMSRules.field10 = getFieldsValue().field10;
    ruleInfoJson.SMSRules.field11 = getFieldsValue().field11;
    ruleInfoJson.SMSRules.field12 = getFieldsValue().field12;
    ruleInfoJson.VisitCycle = formConfig.dataSource;
    console.log(
      'handleOk- getFieldsValue',
      getFieldsValue,
      getFieldsValue(),
      formConfig.dataSource,
    );
    // console.log('handleOk', submit, ruleInfoJson.SMSRules)
    console.log('ruleInfoJson', ruleInfoJson);
    if (title.value === '新增随访规则') {
      addRulesApi({
        // "fromId": 0,
        fromName: getFieldsValue().fromName,
        // "id": 0,
        // projectCode: getFieldsValue().projectCode,
        projectCode: '01',
        // "projectName": "",
        ruleInfoJson: JSON.stringify(ruleInfoJson),
        ruleName: getFieldsValue().ruleName,
        status: getFieldsValue().status,
        // "visitCycle": ""
      }).then((res: any) => {
        console.log('addRulesApi', res);
        handleAllRulesApi();
        notification.success({
          message: res,
          duration: 3,
        });
      });
    } else {
      updataRulesApi({
        id: followUpItem.value.id,
        // projectCode: followUpItem.value.projectCode,
        // projectCode: followUpItem.value.projectCode,
        projectCode: '01',
        // projectName: '',
        ruleInfoJson: JSON.stringify(ruleInfoJson),
        ruleName: getFieldsValue().ruleName,
        status: getFieldsValue().status,
      }).then((res) => {
        console.log('updataRulesApi----res', res);
        notification.success({
          message: res,
          duration: 3,
        });
        handleAllRulesApi();
      });
    }
    // getFieldsValue
    // console.log(getForm().getFieldsValue());
    // loading.value = true;
    setTimeout(() => {
      // loading.value = false;
      addModal.value = false;
    }, 100);
  };
  const deleteRulesfun = (id) => {
    console.log('deleteRulesApi', id)
    deleteRulesApi({
      id,
    }).then((res)=>{
      console.log('deleteRulesApi----res', res)
      notification.success({
        message: res,
        duration: 3,
      });
    })
  } 
  onMounted(() => {
    // console.log('registerTable', registerTable);
    console.log('register.schemas', getSchamas());

    handleAllRulesApi();
    projectNameList();
  });
</script>
<style>
  .ant-table-summary {
    border: 1px solid #cccccc;
  }
</style>
