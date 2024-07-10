import { FormProps, FormSchema, BasicColumn } from '@/components/Table';

export function getfeedbackColumns(): BasicColumn[] {
  return [
    /* {
      title: 'ID',
      dataIndex: '序号',
      fixed: 'left',
      width: 200,
    }, */
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      /* filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ], */
    },
    {
      title: '性别',
      dataIndex: 'sex',
      defaultHidden: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 150,
      // sorter: true,
      // defaultHidden: true,
    },
    {
      title: '当前进度',
      dataIndex: 'scheduleNum',
      width: 150,
      // sorter: true,
      // defaultHidden: true,
    },
    {
      title: '开始时间',
      width: 150,
      // sorter: true,
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      width: 150,
      // sorter: true,
      dataIndex: 'endTime',
    },
    {
      title: '倒计时（天）',
      dataIndex: 'countDown',
      width: 150,
      // sorter: true,
      // defaultHidden: true,
    },
    {
      title: '填写状态',
      width: 150,
      // sorter: true,
      dataIndex: 'status',
    },
    {
      title: '是否过期（未处理）',
      width: 150,
      // sorter: true,
      dataIndex: 'isExpire',
      defaultHidden: true,
    },
    {
      title: '操作',
      // width: 150,
      // sorter: true,
      dataIndex: 'edit',
    },
  ];
}
export function getSmsTemplateBasicColumns(): BasicColumn[] {
  return [
    /* {
      title: 'ID',
      dataIndex: '序号',
      fixed: 'left',
      width: 200,
    }, */
    {
      title: '模板名称',
      dataIndex: 'tempName',
      width: 150,
      /* filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ], */
    },
    {
      title: '研究项目',
      dataIndex: 'projectName',
    },
    {
      title: '短信消息类型',
      dataIndex: 'messageType',
      width: 150,
      // sorter: true,
      // defaultHidden: true,
    },
    {
      title: '模板内容',
      width: 150,
      // sorter: true,
      dataIndex: 'tempContent',
    },
    {
      title: '创建人',
      width: 150,
      // sorter: true,
      dataIndex: 'createBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      // sorter: true,
      defaultHidden: true,
    },
    {
      title: '是否启用',
      width: 150,
      // sorter: true,
      dataIndex: 'status',
    },
    {
      title: '操作',
      // width: 150,
      // sorter: true,
      dataIndex: 'edit',
    },
  ];
}
export function getBasicColumns(): BasicColumn[] {
  return [
    /* {
      title: 'ID',
      dataIndex: '序号',
      fixed: 'left',
      width: 200,
    }, */
    {
      title: '随访规则名称',
      dataIndex: 'ruleName',
      width: 150,
      /* filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ], */
    },
    {
      title: '研究项目',
      dataIndex: 'projectName',
    },
    {
      title: '科室',
      dataIndex: 'dept',
      width: 150,
      // sorter: true,
      // defaultHidden: true,
    },
    {
      title: '访视周期',
      width: 150,
      // sorter: true,
      dataIndex: 'visitCycle',
    },
    {
      title: '表单名',
      width: 150,
      // sorter: true,
      dataIndex: 'fromName',
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      width: 150,
      // sorter: true,
      defaultHidden: true,
    },
    {
      title: '创建时间',
      width: 150,
      // sorter: true,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      // width: 150,
      // sorter: true,
      dataIndex: 'edit',
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: FormSchema[] = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};

export function getSmsTemplateFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      // ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `模板名称`,
        component: 'Input',
        // slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `field11`,
        label: `选择短信消息类型`,
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
  };
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
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
  };
}