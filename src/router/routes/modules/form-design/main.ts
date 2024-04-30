import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const permission: AppRouteModule = {
  path: '/form-designer',
  name: 'Form-designer',
  component: LAYOUT,
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '研究设置',
  },
  children: [
    {
      path: 'design',
      name: 'Design',
      meta: {
        title: '表单设计',
      },
      component: () => import('@/views/form-design/index.vue'),
    },
    {
      path: 'example1',
      name: 'Example1',
      meta: {
        title: '示例',
      },
      component: () => import('@/views/form-design/examples/baseForm.vue'),
    },
    {
      path: 'crf',
      name: 'CRF',
      meta: {
        title: '病例报告表',
      },
      component: () => import('@/views/form-design/crf/crf.vue'),
    },
    {
      path: 'example2',
      name: 'Example2',
      meta: {
        title: '查看',
      },
      component: () => import('@/views/form-design/examples/baseForm.vue'),
    },
    {
      path: 'form-manager',
      name: 'FormManager',
      meta: {
        title: '表单管理',
      },
      component: () => import('@/views/form-design/form-manager/form-manager.vue'),
    },
  ],
};

export default permission;
