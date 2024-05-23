import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const data: AppRouteModule = {
  path: '/data-administration',
  name: 'Data-administration',
  component: LAYOUT,
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '数据管理',
    hideMenu: true,
  },
  children: [
    {
      path: 'data-list',
      name: 'DataList',
      meta: {
        title: '数据管理',
        hideMenu: true,
      },
      component: () => import('@/views/data-administration/data-list/data-list.vue'),
    },
  ],
};

export default data;
