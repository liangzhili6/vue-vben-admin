<!--
 * @Description: 渲染组件，无法使用Vben的组件
-->
<template>
  <Modal
    title="预览"
    :open="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="获取数据"
    cancelText="关闭"
    style="top: 20px"
    :destroyOnClose="true"
    width="90%"
    :maskClosable="false"
  >
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
    <JsonModal ref="jsonModal" />
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { IFormConfig } from '../../typings/v-form-component';
  import { IAnyObject } from '../../typings/base-type';
  import VFormCreate from '../VFormCreate/index.vue';
  import { formatRules } from '../../utils';
  import { IVFormMethods } from '../../hooks/useVFormMethods';
  import JsonModal from '../VFormDesign/components/JsonModal.vue';
  import { IToolbarMethods } from '../../typings/form-type';
  import { Modal } from 'ant-design-vue';
  import { useFormStore } from '@/store/modules/form';  
  const FormStore = useFormStore();
  export default defineComponent({
    name: 'VFormPreview',
    components: {
      JsonModal,
      VFormCreate,
      Modal,
    },
    setup() {
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

      /**
       * 显示Json数据弹框
       * @param jsonData
       */
      const showModal = (jsonData: IFormConfig) => {
         console.log('showModal-', jsonData);
        formatRules(jsonData.schemas);
        state.formConfig = jsonData as any;
        state.visible = true;
      };

      /**
       * 获取表单数据
       * @return {Promise<void>}
       */
      const handleCancel = () => {
        console.log('FormStore.updateIsPreview(true)')
        state.visible = false;
        FormStore.updateIsPreview(true)
        state.formModel = {};
        FormStore.updatePreviewView(false)
      };
      const handleGetData = async () => {
        const _data = await state.fApi.submit?.();
        jsonModal.value?.showModal?.(_data);
      };

      const onSubmit = (_data: IAnyObject) => {
        console.log('_data', _data)
        //
      };
      const onCancel = () => {
        state.formModel = {};
      };
      return {
        handleGetData,
        handleCancel,
        ...toRefs(state),
        showModal,
        jsonModal,
        onSubmit,
        onCancel,
      };
    },
  });
</script>
