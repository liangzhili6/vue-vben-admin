import { FormProps, FormSchema, BasicColumn } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: '序号',
      fixed: 'left',
      width: 200,
    },
    {
      title: '随访规则名称',
      dataIndex: 'name',
      width: 150,
      /* filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ], */
    },
    {
      title: '研究项目',
      dataIndex: 'address',
    },
    {
      title: '科室',
      dataIndex: 'no',
      width: 150,
      sorter: true,
      defaultHidden: true,
    },
    {
      title: '访视周期',
      width: 150,
      sorter: true,
      dataIndex: 'beginTime',
    },
    {
      title: '病例报告表',
      width: 150,
      sorter: true,
      dataIndex: 'endTime',
    },
    {
      title: '是否启用',
      dataIndex: 'no',
      width: 150,
      sorter: true,
      defaultHidden: true,
    },
    {
      title: '创建时间',
      width: 150,
      sorter: true,
      dataIndex: 'beginTime',
    },
    {
      title: '操作',
      width: 150,
      sorter: true,
      dataIndex: 'endTime',
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