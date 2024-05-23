<!--
 * @Description: 使用vbenForm的功能进行渲染
-->
<template>
  <Modal
    :title="state.formConfig.title || '查看'"
    :open="state.visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    :okText="state.formConfig.submitFormTemplateTxt || '保存数据'"
    cancelText="关闭"
    style="top: 20px"
    :destroyOnClose="true"
    :width="900"
    :maskClosable="false"
  >
    <BasicForm v-bind="attrs" @register="registerForm" />
    <JsonModal ref="jsonModal" />
  </Modal>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '@/components/Form';
  import { reactive, ref, computed } from 'vue';
  import { IFormConfig } from '../../typings/v-form-component';
  import { IAnyObject } from '../../typings/base-type';
  import JsonModal from '../VFormDesign/components/JsonModal.vue';
  import { IToolbarMethods } from '../../typings/form-type';
  import { Modal } from 'ant-design-vue';
  import { IVFormMethods } from '../../hooks/useVFormMethods';
  import { useFormStore } from '@/store/modules/form';  
  const FormStore = useFormStore();
  const jsonModal = ref<IToolbarMethods | null>(null);
  const state = reactive<{
    formModel: IAnyObject;
    visible: boolean;
    formConfig: IFormConfig;
    fApi: IVFormMethods;
    isEdit?: Boolean;
  }>({
    formModel: {},
    formConfig: {} as IFormConfig,
    visible: false,
    fApi: {} as IVFormMethods,
    isEdit: false,
  });

  const attrs = computed(() => {
    return {
      ...state.formConfig,
    } as Recordable;
  });
/*   const props =  defineProps({
    handleGetDatas: {
        type: Function,
        default: ()=>{},
      },
      updateDynamicValue: {
        type: Function,
        default: ()=>{},
      },
  }) */
  /**
   * 显示Json数据弹框
   * @param jsonData
   */
  const showModal = (jsonData: IFormConfig) => {
    state.formConfig = jsonData as any;
    state.visible = true;
  };

  //表单
  const [registerForm, { validate }] = useForm();

  const handleCancel = () => {
    state.visible = false;
    state.formModel = {};
    FormStore.updateIsPreview(true)
  };
  /**
   * 获取表单数据
   * @return {Promise<void>}
   */
  const handleGetData = async () => {
    let data = await validate();
    jsonModal.value?.showModal?.(data);
  };

  defineExpose({ showModal });
</script>
