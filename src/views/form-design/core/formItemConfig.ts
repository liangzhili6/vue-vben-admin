/**
 * @description：表单配置
 */
import { IVFormComponent, MemberFormComponent, CentreFormComponent } from '../typings/v-form-component';
import { isArray } from 'lodash-es';
import { componentMap as VbenCmp, add } from '@/components/Form/src/componentMap';
import { ComponentType } from '@/components/Form/src/types';

import { uploadApi } from '@/api/sys/upload';
import { GetAllTDimDeptApi, getOneFieldApi, GetAllTCenterApi, GetAllUserApi } from '@/api/sys/data';
import { getAlldynamicFromNameApi } from '@/api/sys/form';

import dayjs from 'dayjs';
import { componentMap as Cmp } from '../components';
import { Component, h } from 'vue';
import { Tinymce } from '@/components/Tinymce';
const componentMap = new Map<string, Component>();

//如果有其它控件，可以在这里初始化

//注册Ant控件库
Cmp.forEach((value, key) => {
  componentMap.set(key, value);
  if (VbenCmp[key] == null) {
    add(key as ComponentType, value);
  }
});
//注册vben控件库
VbenCmp.forEach((value, key) => {
  componentMap.set(key, value);
});

export { componentMap };

/**
 * 设置自定义表单控件
 * @param {IVFormComponent | IVFormComponent[]} config
 */
export function setFormDesignComponents(config: IVFormComponent | IVFormComponent[]) {
  if (isArray(config)) {
    config.forEach((item) => {
      const { componentInstance: component, ...rest } = item;
      componentMap[item.component] = component;
      customComponents.push(Object.assign({ props: {} }, rest));
    });
  } else {
    const { componentInstance: component, ...rest } = config;
    componentMap[config.component] = component;
    customComponents.push(Object.assign({ props: {} }, rest));
  }
}
export const MemberList: MemberFormComponent[] = [
  {
    label: '成员1',
    value: '1',
  },
  {
    label: '成员2',
    value: '2',
  },
]

export const CentreList = async (Getfun) => {
  const data =  await Getfun()
  return data.map(item=>{
    return {
      ...item,
      value: item.centerCode,
      label: item.centerName,
    }
  })
}
/**
 * 高级字段
 */
export const advanced: IVFormComponent[]= [
  {
    component: 'Correlation',
    label: '关联记录',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      api: [getAlldynamicFromNameApi, getOneFieldApi],
    },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2 
  },
  {
    component: 'JournalNumber',
    label: '流水号',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    format: "{YYYY}{MM}{DD}{#2/D}",
    componentProps: {
    },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2
  },
]
/**
 * 外部设置的自定义控件
 */
export const customComponents: IVFormComponent[] = [
  {
    component: 'CentreSelect',
    label: '中心',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      api: GetAllTCenterApi,
      // options: CentreList(GetAllTCenterApi)
    },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2
  },{                               
    component: 'MemberSelect',
    label: '成员',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      api: GetAllUserApi,
      // options: CentreList(GetAllTCenterApi)
      /* options: (await GetAllTCenterApi()).map((item: any) => {
        return {
          ...item,
          value: item.centerCode,
          label: item.centerName,
        };
      }) */
    },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2
  },
/*{
  component: 'MemberSelect',
  label: '成员',
  icon: 'gg:select',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    options: MemberList,
    api: GetAllTDimDeptApi,
  },
},
{
  component: 'CentreSelect',
  label: '中心',
  icon: 'gg:select',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    api: GetAllTDimDeptApi,
  },
} ,
{
  component: 'Input',
  label: '姓名',
  icon: 'bi:input-cursor-text',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    type: 'text',
  },
  rules: [
      {
          "pattern": "/^(?:[一-龥·]{2,16})$/",
          "message": "请输入信息"
      }
  ]
},
{
  component: 'Input',
  label: '电话',
  icon: 'bi:input-cursor-text',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    type: 'text',
  },
},
{
  component: 'Input',
  label: '电子邮箱',
  icon: 'bi:input-cursor-text',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    type: 'text',
  },
},
{
  component: 'Input',
  label: '网址',
  icon: 'bi:input-cursor-text',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    type: 'text',
  },
} */
];

// 左侧控件列表与初始化的控件属性
// props.slotName,会在formitem级别生成一个slot,并绑定当前record值
// 属性props，类型为对象，不能为undefined或是null。
export const baseComponents: IVFormComponent[] = [
  {
    component: 'Input',
    label: '单行文本',
    icon: 'bi:input-cursor-text',
    field: '',
    colProps: { span: 24 },
/*     labelCol: { span: 4 },
    wrapperCol: { span: 20 }, */
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      type: 'text',
      defaultType: 'custom'//custom---自定义；formula---公式
    },
    x: 0, y: 0, w: 100, h: 2
  },
  {
    component: 'InputTextArea',
    label: '多行文本',
    icon: 'ant-design:file-text-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
    position: { x: 0,y: 0, w: 100, h: 2.5 },
    x: 0,y: 0, w: 100, h: 2.5
  },
  {
    component: 'InputNumber',
    label: '数字输入框',
    icon: 'ant-design:field-number-outlined',
    field: '',
    colProps: { span: 24 },
    // componentProps: { style: 'w:800px;h: 2px;' },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2
  },
  {
    component: 'DatePicker',
    label: '日期选择',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD",
      // defaultValue: dayjs(new Date()).format('YYYY-MM-DD'),
    },
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0, y: 0, w: 100, h: 2
  },
  {
    component: 'RangePicker',
    label: '日期范围',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      placeholder: ['开始日期', '结束日期'],
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'MonthPicker',
    label: '月份选择',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    // colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      placeholder: '请选择月份',
      format: "YYYY-MM",
      valueFormat: "YYYY-MM"
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'TimePicker',
    label: '时间选择',
    icon: 'healthicons:i-schedule-school-date-time',
    field: '',
    // colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      format: "HH:mm:ss",
      valueFormat: "HH:mm:ss"
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'RadioGroup',
    label: '单选框',
    icon: 'carbon:radio-button-checked',
    field: '',
    colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
      rowShows: 1,
      optionType: 'default'
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'CheckboxGroup',
    label: '多选框',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'Select',
    label: '下拉选择',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'Upload',
    label: '附件',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      api: uploadApi,
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  /* {
    component: 'IconPicker',
    label: '图标选择器',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  }, */
  /* {
    component: 'InputCountDown',
    label: '倒计时输入',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  }, */
  {
    component: 'Divider',
    label: '分割线',
    icon: 'radix-icons:divider-horizontal',
    colProps: { span: 24 },
    field: '',
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      orientation: 'center',
      dashed: true,
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'Slider',
    label: '滑动输入条',
    icon: 'vaadin:slider',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'Rate',
    label: '评分',
    icon: 'ic:outline-star-rate',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  
  /* {
    component: 'Button',
    label: '按钮',
    icon: 'dashicons:button',
    field: '',
    colProps: { span: 24 },
    hiddenLabel: true,
    componentProps: {},
    position: { x: 0, y: 0, w: 100, h: 2 },
  }, */
  {
    component: 'IconPicker',
    label: '图标',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
    position: { x: 0, y: 0, w: 100, h: 2 },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    component: 'ImageUpload',
    label: '图片',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      api: uploadApi,
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2

  },
  {
    // component: 'ImageText',
    label: '图文',
    component: 'ImageText',
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      api: uploadApi,
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  {
    field: 'tinymce',
    component: 'Tinymce',
    label: 'HTML',
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      api: uploadApi,
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2,
    // defaultValue: 'defaultValue',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
  {
    component: 'Signature',
    label: '签名',
    icon: 'ant-design:check-circle-outlined',
    colProps: { span: 24 },
    field: '',
    position: { x: 0, y: 0, w: 100, h: 2 },
    componentProps: {
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
  /* {
    component: 'AutoComplete',
    label: '自动完成',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      placeholder: '请输入正则表达式',
      options: [
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          label: '手机号码',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          label: '网址带端口号',
        },
      ],
    },
  }, */
  /*{
    component: 'Checkbox',
    label: '复选框',
    icon: 'ant-design:check-circle-outlined',
    colProps: { span: 24 },
    field: '',
  },
  {
    component: 'Radio',
    label: '单选框',
    icon: 'ant-design:check-circle-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Switch',
    label: '开关',
    icon: 'entypo:switch',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'StrengthMeter',
    label: '密码强度',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'AutoComplete',
    label: '自动完成',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      placeholder: '请输入正则表达式',
      options: [
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          label: '手机号码',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          label: '网址带端口号',
        },
      ],
    },
  },
  {
    component: 'TreeSelect',
    label: '树形选择',
    icon: 'clarity:tree-view-line',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      treeData: [
        {
          label: '选项1',
          value: '1',
          children: [
            {
              label: '选项三',
              value: '1-1',
            },
          ],
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Cascader',
    label: '级联选择',
    icon: 'ant-design:check-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          children: [
            {
              label: '选项三',
              value: '1-1',
            },
          ],
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Button',
    label: '按钮',
    icon: 'dashicons:button',
    field: '',
    colProps: { span: 24 },
    hiddenLabel: true,
    componentProps: {},
  },
  {
    component: 'ColorPicker',
    label: '颜色选择器',
    icon: 'carbon:color-palette',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      defaultValue: '',
      value: '',
    },
  },
  {
    component: 'slot',
    label: '插槽',
    icon: 'vs:timeslot-question',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      slotName: 'slotName',
    },
  }, */
];

// https://next.antdv.com/components/transfer-cn
/* const transferControl = {
  component: 'Transfer',
  label: '穿梭框',
  icon: 'bx:bx-transfer-alt',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    render: (item) => item.title,
    dataSource: [
      {
        key: 'key-1',
        title: '标题1',
        description: '描述',
        disabled: false,
        chosen: true,
      },
      {
        key: 'key-2',
        title: 'title2',
        description: 'description2',
        disabled: true,
      },
      {
        key: 'key-3',
        title: '标题3',
        description: '描述3',
        disabled: false,
        chosen: true,
      },
    ],
  },
}; */

// baseComponents.push(transferControl);

export const layoutComponents: IVFormComponent[] = [
  {
    field: '',
    component: 'Grid',
    label: '栅格布局',
    icon: 'icon-grid',
    componentProps: {},
    position: { x: 0, y: 0, w: 100, h: 2 },
    columns: [
      {
        span: 12,
        children: [],
      },
      {
        span: 12,
        children: [],
      },
    ],
    colProps: { span: 24 },
    options: {
      gutter: 0,
    },
    x: 0,
    y: 0,
    w: 100,
    h: 2
  },
];
