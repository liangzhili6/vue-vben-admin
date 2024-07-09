<template>
  <div class="p-4 flex flex-col sms-template">
    <!-- <div class="mb-4">
      <a-button class="mr-2" @click="reloadTable"> 还原 </a-button>
    </div> -->
    <!-- @register="registerTable"  -->
    <BasicTable
      :columns="getSmsTemplateBasicColumns()"
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
              placeholder="请输入模板名称"
              style="width: 180px"
              v-model:value="formConfig.ruleName"
              :allowClear="true"
              @search="onSearchKeyword"
              class="keywordView"
              @pressEnter="onSearchKeyword"
            />
            <Select
              ref="keywordRef"
              placeholder="请选择短信消息类型"
              style="margin-left: 10px; width: 180px"
              v-model:value="formConfig.messageType"
              class="keywordView"
              :options="[
            {
              label: '随访提醒',
              value: 0,
            },
            {
              label: '医生短信',
              value: 1,
            },
            {
              label: '节日祝福',
              value: 2,
            },
            {
              label: '全部',
              value: 3,
            },
          ]"
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
            title = '编辑模板'
              handleItem(record.id);
              addModal = true;
            "
            >编辑</Button
          >
          <!-- <Button type="link" danger style="width: 80px" @click="deleteRulesfun(record.id)">删除</Button> -->
        </template>
        <template v-if="column.dataIndex === 'status'">
          <Switch v-model:checked="record.status" @change="changeStatus(record)" :checkedValue="1" :unCheckedValue="0"/>
        </template>
        <template v-if="column.dataIndex === 'messageType'">
          <span style="width: 80px" v-if="record.messageType == 0" >随访提醒</span>
          <span style="width: 80px" v-if="record.messageType == 1" >医生短信</span>
          <span style="width: 80px" v-if="record.messageType == 2" >节日祝福</span>
          <span style="width: 80px" v-if="record.messageType == 3" >全部</span>
          <!-- <Button type="link" danger style="width: 80px" @click="deleteRulesfun(record.id)">删除</Button> -->
        </template>
      </template>
    </BasicTable>
    <Modal v-model:open="addModal" :title="title" @ok="handleOk" :width="'60%'">
      <!-- height="80%" style="overflow: hidden;overflow-y: scroll;" -->
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
      </template>
      <BasicForm @register="register">
        <!-- <template #add="{ field }">
          <div>11111
          </div>
        </template> -->
      </BasicForm>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { getSmsTemplateBasicColumns, getSmsTemplateFormConfig } from './tableData';
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
    getAllMassageApi,
    getAllProjectNotParamApi,
    getOneMassageApi,
    addMassageApi,
    updataMassageApi,
    deleteMassageApi,
    updataStatusApi,
    getMessageTemplateValueApi,
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
    Switch,
    CheckboxGroup
  } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  const { notification } = useMessage();
  const keyword = ref<any>('');
  const addModal = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const followUpItem = ref<any>();
  const title = ref<string>('新增模板');
  const pagination = ref<any>(true);
  const status = ref<any>();
  // const [registerForm, { validate }] = useForm();
  const editableData: UnwrapRef<Record<string, any>> = reactive({});
  const changeStatus = (record) => {
    updataStatusApi({
      id: record.id,
      status: record.status ?  1 : 0,
    }).then(res=>{
      handleAllMassageApi();
      notification.success({
        message: res?res: '修改成功',
        duration: 3,
      });
    })
  }
  const edit = (key: string) => {
    editableData[key] = cloneDeep(formConfig.dataSource.filter((item) => key === item.key)[0]);
  };
  const save = (key: string) => {
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
    messageType: 3,
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
    handleAllMassageApi();
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
        field: 'messageType',
        component: 'Select',
        label: '模板分类',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请选择模板分类',
          options:  [
            {
              label: '随访提醒',
              value: 0,
              key: 0,
            },
            {
              label: '医生短信',
              value: 1,
              key: 1,
            },
            {
              label: '节日祝福',
              value: 2,
              key: 2,
            },
            {
              label: '全部',
              value: 3,
              key: 3,
            },
          ],
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'tempName',
        component: 'Input',
        label: '模板名称',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入模板名称',
        },
      },
      {
        field: 'templateValue',
        component: 'CheckboxGroup',
        label: '模板参数',
        colProps: {
          span: 24,
        },
        componentProps: {
          onChange: (e: any) => {
            if(e.length){
              getMessageTemplateValueApi({
                value: e[e.length-1]+''
              }).then(res=>{
                setFieldsValue({tempContent: getFieldsValue().tempContent?getFieldsValue().tempContent+ res:'' + res})
              })
            }
          },
          options: [
            {
              label: '姓名',
              value: "姓名",
            },
            {
              label: '手机号码',
              value: "手机号码",
            },
            {
              label: '访视病例报告表问卷链接',
              value: "访视病例报告表问卷链接",
            },
          ],
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
          options: formConfig.projectNameArr/*   [
            {
              label: '是',
              value: 1,
              key: 1,
            },
            {
              label: '否',
              value: 2,
              key: 2,
            },
          ] */,
        },
      },
      {
        field: 'tempContent',
        component: 'InputTextArea',
        label: '模板内容',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入模板内容',
          mousemove: (e: any) => {
            // console.log('mousemove', e);
          },
          onChange: (e: any) => {
            // console.log(e);
          },
        },
      },
      {
        field: 'isBaseline',
        component: 'Switch',
        label: '是否基线期短信',
        colProps: {
          span: 24,
        },
        componentProps: {
          checkedValue: 1,
          unCheckedValue: 0,
          placeholder: '请输入是否基线期短信',
          onChange: (e: any) => {
            // console.log(e);
          },
        },
      },
      {
        field: 'status',
        component: 'Switch',
        label: '是否启用',
        colProps: {
          span: 24,
        },
        componentProps: {
          checkedValue: 1,
          unCheckedValue: 0,
          options: /* formConfig.projectNameArr */  [
            {
              label: '是',
              value: 1,
              key: 1,
            },
            {
              label: '否',
              value: 2,
              key: 2,
            },
          ],
          placeholder: '请输入是否启用',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      
    ])
        }
      })
      .catch((e: any) => {});
  };
  const getSchamas = () => {
    projectNameList();
    return [
      {
        field: 'messageType',
        component: 'Select',
        label: '模板分类',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请选择模板分类',
          options:  [
            {
              label: '随访提醒',
              value: 0,
              key: 0,
            },
            {
              label: '医生短信',
              value: 1,
              key: 1,
            },
            {
              label: '节日祝福',
              value: 2,
              key: 2,
            },
            {
              label: '全部',
              value: 3,
              key: 3,
            },
          ],
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'tempName',
        component: 'Input',
        label: '模板名称',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入模板名称',
        },
      },
      {
        field: 'templateValue',
        component: 'CheckboxGroup',
        label: '模板参数',
        colProps: {
          span: 24,
        },
        componentProps: {
          onChange: (e: any) => {
            console.log(e);
            if(e.length){
              getMessageTemplateValueApi({
                value: e[e.length-1]+''
              }).then(res=>{
                setFieldsValue({tempContent: getFieldsValue().tempContent?getFieldsValue().tempContent+ res:'' + res})
              })
            }
          },
          options: [
            {
              label: '姓名',
              value: "姓名",
            },
            {
              label: '手机号码',
              value: "手机号码",
            },
            {
              label: '访视病例报告表问卷链接',
              value: "访视病例报告表问卷链接",
            },
          ],
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
          options: formConfig.projectNameArr/*   [
            {
              label: '是',
              value: 1,
              key: 1,
            },
            {
              label: '否',
              value: 2,
              key: 2,
            },
          ] */,
        },
      },
      {
        field: 'tempContent',
        component: 'InputTextArea',
        label: '模板内容',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入模板内容',
          mousemove: (e: any) => {
            console.log('mousemove', e);
          },
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'isBaseline',
        component: 'Switch',
        label: '是否基线期短信',
        colProps: {
          span: 24,
        },
        componentProps: {
          checkedValue: 1,
          unCheckedValue: 0,
          placeholder: '请输入是否基线期短信',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      {
        field: 'status',
        component: 'Switch',
        label: '是否启用',
        colProps: {
          span: 24,
        },
        componentProps: {
          checkedValue: 1,
          unCheckedValue: 0,
          options: /* formConfig.projectNameArr */  [
            {
              label: '是',
              value: 1,
              key: 1,
            },
            {
              label: '否',
              value: 2,
              key: 2,
            },
          ],
          placeholder: '请输入是否启用',
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
      
    ];
  };
  const [registerTable, { getForm }] = useTable({
    // title: '开启搜索区域',
    // api: getAllMassageApi,
    columns: getSmsTemplateBasicColumns(),
    dataSource: formConfig.list,
    useSearchForm: false,
    formConfig: getSmsTemplateFormConfig(),
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
  const [register, { updateSchema, submit, getFieldsValue, setFieldsValue, resetSchema }] = useForm({
    // labelWidth: 80,
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

  const handleItem = (id) => {
    getOneMassageApi({ id }).then((res) => {
      followUpItem.value = res
      followUpItem.value.id = id
    });
    getSchamas();
  };
  const empty = () => {
    formConfig.tempName = '';
    formConfig.messageType = 3;
    handleAllMassageApi();
  };
  function getFormValues() {
    handleAllMassageApi();
  }
  const handleCancel = () => {
    addModal.value = false;
    followUpItem.value={}
    setFieldsValue({tempName:'',isBaseline:'',createBy:'',projectCode:'',messageType:'',tempContent:'',ruleName:'',status:''})
  };
  const handleAllMassageApi = () => {
    getAllMassageApi({
      current: formConfig.current,
      size: formConfig.size,
      messageType: formConfig.messageType,
      tempName: formConfig.ruleName,
    })
      .then((res: any) => {
        if (res) {
          formConfig.list = res.records;
        }
      })
      .catch((e: any) => {});
  };
  const onSearchKeyword = (searchValue: string) => {
    handleAllMassageApi();
    // getFormManagerList()
  };
  const handleOk = () => {
    if (title.value === '新增模板') {
      addMassageApi({
        tempName: getFieldsValue().tempName,
        isBaseline: getFieldsValue().isBaseline,
        createBy: getFieldsValue().createBy,
        projectCode: getFieldsValue().projectCode,
        messageType: getFieldsValue().messageType,
        tempContent: getFieldsValue().tempContent,
        ruleName: getFieldsValue().ruleName,
        status: getFieldsValue().status,
        // "visitCycle": ""
      }).then((res: any) => {
        handleAllMassageApi();
        notification.success({
          message:  res?res: '新增成功',
          duration: 3,
        });
        // resetSchema()
        setFieldsValue({tempName:'',isBaseline:'',createBy:'',projectCode:'',messageType:'',tempContent:'',ruleName:'',status:''})
        // resetSchema({tempName:'',isBaseline:'',createBy:'',projectCode:'',messageType:'',tempContent:'',ruleName:'',status:''})
        followUpItem.value = {}
      });
    } else {
      updataMassageApi({
        id: followUpItem.value.id,
        tempName: getFieldsValue().tempName,
        isBaseline: getFieldsValue().isBaseline,
        createBy: getFieldsValue().createBy,
        projectCode: getFieldsValue().projectCode,
        messageType: getFieldsValue().messageType,
        tempContent: getFieldsValue().tempContent,
        // ruleInfoJson: JSON.stringify(ruleInfoJson),
        ruleName: getFieldsValue().ruleName,
        status: getFieldsValue().status,
      }).then((res) => {
        handleAllMassageApi();
        notification.success({
          message:  res?res: '编辑成功',
          duration: 3,
        });
        // resetSchema()
        setFieldsValue({tempName:'',isBaseline:'',createBy:'',projectCode:'',messageType:'',tempContent:'',ruleName:'',status:''})
        // resetSchema({tempName:'',isBaseline:'',createBy:'',projectCode:'',messageType:'',tempContent:'',ruleName:'',status:''})
        followUpItem.value = {}
      });
    }
    // getFieldsValue
    // loading.value = true;
    setTimeout(() => {
      // loading.value = false;
      addModal.value = false;
    }, 100);
  };
  const deleteRulesfun = (id) => {
    deleteMassageApi({
      id,
    }).then((res)=>{
      notification.success({
        message: res?res: '删除成功',
        duration: 3,
      });
    })
  } 
  onMounted(() => {
    handleAllMassageApi();
    projectNameList();
  });
</script>
<style>
  .ant-table-summary {
    border: 1px solid #cccccc;
  }
</style>
