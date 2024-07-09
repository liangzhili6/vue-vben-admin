/**
 * follow-up  随访
 */

import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const data: AppRouteModule = {
  path: '/follow-up',
  name: 'FollowUp',
  component: LAYOUT,
  redirect: '/follow-up/follow-up-list-two',
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '随访管理',
  },
  children: [
    {
      path: 'follow-up-list-two',
      name: 'FollowUpListTwo',
      meta: {
        title: '随访二',
      },
      component: () => import('@/views/follow-up/follow-up-list-two/follow-up-list-two.vue'),
    },
    {
      path: 'follow-up-list-three',
      name: 'FollowUpListThree',
      meta: {
        title: '随访三',
      },
      component: () => import('@/views/follow-up/follow-up-list-three/follow-up-list-three.vue'),
    },
    {
      path: 'follow-up-list-four',
      name: 'FollowUpListFour',
      meta: {
        title: '随访四',
      },
      component: () => import('@/views/follow-up/follow-up-list-four/follow-up-list-four.vue'),
    },
    {
      path: 'sms-template',
      name: 'SmsTemplate',
      meta: {
        title: '短信模版',
      },
      component: () => import('@/views/follow-up/follow-up-rules/sms-template.vue'),
    },
    {
      path: 'follow-up-rules',
      name: 'FollowUpRules',
      meta: {
        title: '随访规则',
      },
      component: () => import('@/views/follow-up/follow-up-rules/follow-up-rules.vue'),
    },
    {
      path: 'follow-up-feedback',
      name: 'FollowUpFeedback',
      meta: {
        title: '填写反馈',
      },
      component: () => import('@/views/follow-up/follow-up-feedback/follow-up-feedback.vue'),
    },
  ],
};

export default data;
