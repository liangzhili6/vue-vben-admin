<template>
  <div style="padding: 20px">
  <!--
    <Button type="primary" @click="goBack" style="">
      <ArrowLeftOutlined></ArrowLeftOutlined>
      {{ '返回' }}
    </Button>
  -->
  <div style="position: fixed;top: 0px;z-index: 99;background-color: #FFFFFF;width: 100%;height: 60px;left: 0px;padding: 15px"><UnorderedListOutlined @click="showDrawer"  :style="{fontSize: '24px', color: '#08c'}"/></div>
    <TypographyTitle style="display: flex; justify-content: center" :level="4">
      {{ formConfig?.title || '表单' }}
    </TypographyTitle>
    <VFormCreate
      :form-config="formConfig"
      v-model:fApi="fApi"
      v-model:formModel="formModel"
      @submit="onSubmit"
    >
      <template #slotName="{ formModel, field }">
        <a-input v-model:value="formModel[field]" placeholder="我是插槽传递的输入框" />
      </template>
    </VFormCreate>
    <div style="display: flex; flex: 1; text-align: center; justify-content: center; padding: 10px 0" >
      <Button type="primary" @click="submitFormTemplate">
        {{ formConfig?.submitFormTemplateTxt || '保存数据' }}
      </Button>
    </div>
    <Drawer :width="230" title="Basic Drawer" :placement="placement" :open="open" @close="onClose" style="padding: 0px !important">
    <template #extra>
    <!--   <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button> -->
    </template>
              <Menu v-model:selectedKeys="state.selectedKeys"
      style="width: 230px"
      mode="inline"
      :open-keys="state.openKeys"
      :items="items"
      @openChange="onOpenChange">
                <!-- <MenuItem key="复制" :item="'record'">
                  <a href="javascript:;">复制</a>
                </MenuItem>
                <MenuItem key="删除" :item="'record'">
                  <a href="javascript:;">删除</a>
                </MenuItem> -->
              </Menu>
<!--     <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p> -->
  </Drawer>
  </div>
</template>
<script lang="ts">
  import { reactive, ref, defineComponent, toRefs, VueElement, h } from 'vue';
  import { TypographyTitle, Button, PageHeader, Menu, Drawer, MenuItem, ItemType } from 'ant-design-vue';
  import { IAnyObject } from '../typings/base-type';
  import VFormCreate from '../components/VFormCreate/index.vue';
  import { IVFormMethods } from '../hooks/useVFormMethods';
  import { IFormConfig } from '../typings/v-form-component';
  import { IToolbarMethods } from '../typings/form-type';
  import { GetOneFormApi, GetBaselineApi} from '@/api/sys/form';
  import type { DrawerProps } from 'ant-design-vue';
  import { SettingOutlined, ArrowLeftOutlined, UnorderedListOutlined, AppstoreOutlined, MailOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'Crf',
    components: { VFormCreate, Button, TypographyTitle, ArrowLeftOutlined, PageHeader, SettingOutlined, UnorderedListOutlined, Drawer, Menu, MenuItem },
    setup() {
      const { go } = useRouter();
      // 接收 History API 参数
      const jsonData = ref({
        title: '新增表单',
        submitFormTemplateTxt: '保存数据',
        // 表单配置
        schemas: [],
        layout: 'horizontal',
        labelLayout: 'flex',
        labelWidth: 100,
        labelCol: {},
        wrapperCol: {},
        currentItem: {
          component: '',
          componentProps: {},
        },
        activeKey: 1,
      });
      const jsonModal = ref<IToolbarMethods | null>(null);
      const state = reactive<{
        formModel: IAnyObject;
        visible: boolean;
        formConfig: any;
        fApi: IVFormMethods;
        rootSubmenuKeys: any,
        openKeys: any,
        selectedKeys:any,
      }>({
        formModel: {},
        formConfig: {} as IFormConfig,
        visible: false,
        fApi: {} as IVFormMethods,
        rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
        openKeys: ['sub1'],
        selectedKeys: [],
      });
      function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const items: ItemType[] = reactive([
    getItem('Navigation One', 'sub1', () => {}, [
    getItem('Option 1', '1'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
    getItem('Navigation Two', 'sub2', () => {}, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null/* , [getItem('Option 7', '7'), getItem('Option 8', '8')] */),
  ]),
  getItem('Navigation Three', 'sub4'),
]);
const placement = ref<DrawerProps['placement']>('left');
const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
      state.formConfig = jsonData as any;
  const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  }
];

  
      const goBack = () =>{
        go(-1)
      }

      const setFormConfig = (config: IFormConfig) => {
        //外部导入时，可能会缺少必要的信息。
        config.schemas = config.schemas || [];
        config.schemas.forEach((item) => {
          item.colProps = item.colProps || { span: 24 };
          item.componentProps = item.componentProps || {};
          item.itemProps = item.itemProps || {};
        });
        state.formConfig = config as any;
      };
      async function  handleOneForm () {
        const data = await GetBaselineApi({status: 0, formName: '病例报告表'});
        await setFormConfig(data)
      }
      handleOneForm()
      const onSubmit = (_data: IAnyObject) => {
      };
      const submitFormTemplate = () => {
        // console.log('data', data)
        console.log('提交', state.formModel)
      };
      const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys;
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
};
      return {
        handleOneForm,
        state,
        ...toRefs(state),
        // showModal,
        jsonModal,
        onSubmit,
        submitFormTemplate,
        go,
        goBack,
        routes,
        placement,
        showDrawer,
        onClose,
        open,
        items,
        onOpenChange,
      };
    },
  });
</script>
<style lang="less" >
.ant-drawer-body{
  padding: 0px !important;
}
</style>
