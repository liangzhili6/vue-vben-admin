import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const data: AppRouteModule = {
  path: '/patient',
  name: 'Patient',
  component: LAYOUT,
  redirect: '/patient/patient-list',
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '患者管理',
  },
  children: [
    {
      path: 'patient-list',
      name: 'PatientList',
      meta: {
        title: '中心患者',
      },
      component: () => import('@/views/patient/patient-list/patient-list.vue'),
    },
  ],
};

export default data;
