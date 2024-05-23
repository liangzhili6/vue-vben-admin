<template>
  <div style="padding: 20px">
    <TypographyTitle style="display: flex; justify-content: center" :level="4">{{
      formConfig?.title || '表单'
    }}</TypographyTitle>
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
    <div
      style="display: flex; flex: 1; text-align: center; justify-content: center; padding: 10px 0"
    >
      <Button type="primary" @click="submitFormTemplate">{{
        formConfig?.submitFormTemplateTxt || '保存数据'
      }}</Button>
    </div>
  </div>
</template>
<script lang="ts">
  import { reactive, ref, defineComponent, toRefs } from 'vue';
  import { TypographyTitle, Button } from 'ant-design-vue';
  import { IAnyObject } from '../typings/base-type';
  import VFormCreate from '../components/VFormCreate/index.vue';
  import { IVFormMethods } from '../hooks/useVFormMethods';
  import { IFormConfig } from '../typings/v-form-component';
  import { IToolbarMethods } from '../typings/form-type';
  import { GetOneFormApi} from '@/api/sys/form';

  export default defineComponent({
    name: 'Crf',
    components: { VFormCreate, Button, TypographyTitle },
    setup() {
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
      }>({
        formModel: {},
        formConfig: {} as IFormConfig,
        visible: false,
        fApi: {} as IVFormMethods,
      });

      state.formConfig = jsonData as any;

  

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
      async function  handleOneForm (id, formVersion) {
        const data = await GetOneFormApi({id, formVersion});
        await setFormConfig(JSON.parse(data.fieldJson))
      }
      handleOneForm(history.state.id, history.state.formVersion)
      const onSubmit = (_data: IAnyObject) => {
        console.log('_data', _data);
      };
      const submitFormTemplate = () => {
        console.log('submitFormTemplate', state.formConfig);
      };
      return {
        handleOneForm,
        ...toRefs(state),
        // showModal,
        jsonModal,
        onSubmit,
        submitFormTemplate,
      };
    },
  });
</script>
