/**
 * follow-up  随访
 */

import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const data: AppRouteModule = {
  path: '/follow-up',
  name: 'FollowUp',
  component: LAYOUT,
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '随访管理',
  },
  children: [
    {
      path: 'follow-up-list',
      name: 'FollowUpList',
      meta: {
        title: '随访',
      },
      component: () => import('@/views/follow-up/follow-up-list/follow-up-list.vue'),
    },
  ],
};

export default data;
