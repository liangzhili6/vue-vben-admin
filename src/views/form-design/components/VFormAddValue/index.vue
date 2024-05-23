<!--
 * @Description: 渲染组件，无法使用Vben的组件  添加表单数据
-->
<template>
  <Modal
    :title="formConfig.title"
    :open="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="提交"
    cancelText="关闭"
    style="top: 20px"
    :destroyOnClose="true"
    :width="900"
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
  import { defineComponent, reactive, ref, toRefs, nextTick } from 'vue';
  import { IFormConfig } from '../../typings/v-form-component';
  import { IAnyObject } from '../../typings/base-type';
  import VFormCreate from '../VFormCreate/index.vue';
  
  // import { useFormModelState } from '../../hooks/useFormDesignState';
  // const { setFormModel } = useFormModelState();
  import { formatRules } from '../../utils';
  import { IVFormMethods } from '../../hooks/useVFormMethods';
  import JsonModal from '../VFormDesign/components/JsonModal.vue';
  import { IToolbarMethods } from '../../typings/form-type';
  import { Modal } from 'ant-design-vue';
  // import { AddDynamicValueApi } from '@/api/sys/data';
  // import { useMessage } from '@/hooks/web/useMessage';
  import { useFormStore } from '@/store/modules/form';  
  const FormStore = useFormStore();
  // const { notification } = useMessage();
  export default defineComponent({
    name: 'VFormPreview',
    components: {
      JsonModal,
      VFormCreate,
      Modal,
    },
    
    props: {
      /**
       * Specified role is visible
       * When the permission mode is the role mode, the value value can pass the role value.
       * When the permission mode is background, the value value can pass the code permission value
       * @default ''
       */
       handleGetDatas: {
        type: Function,
        default: ()=>{},
      },
      updateDynamicValue: {
        type: Function,
        default: ()=>{},
      },
      changeIsEdit: {
        type: Function,
        default: ()=>{},
      },
    },
    setup(props, { slots }) {
      console.log('slots',slots)
      const jsonModal = ref<IToolbarMethods | null>(null);
      const state = reactive<{
        formModel: IAnyObject;
        visible: boolean;
        formConfig: any;
        fApi: IVFormMethods;
        isEdit?: Boolean;
      }>({
        formModel: {},
        formConfig: {} as IFormConfig,
        visible: false,
        fApi: {} as IVFormMethods,
        isEdit: false,
      });
      const setFormModelfun = async (data, isEdit) =>{
        console.log('data, isEdit', data, isEdit)
        state.formModel = data
        state.isEdit = isEdit;
      }
      /**
       * 显示Json数据弹框
       * @param jsonData
       */
      const showModal = (jsonData: IFormConfig, id?: string | number | any) => {
        console.log('jsonData', jsonData, 'id', id)
        formatRules(jsonData.schemas);
        console.log('formatRules(jsonData.schemas)', formatRules(jsonData.schemas))
        state.formConfig = jsonData as any;
        console.log('state.formConfig', state.formConfig)
        state.visible = true;
        console.log('state.visible', state.visible)
      };

      /**
       * 获取表单数据
       * @return {Promise<void>}
       */
      const handleCancel = async () => {
        state.visible = false;
        props.changeIsEdit(false)
        state.formModel = {};
        if(FormStore.childrenSubmit.text === '打开子表单1'){
          await FormStore.updateChildrenSubmit('')
        }
      };
      const handleGetData = async () => {
        if(FormStore.childrenSubmit.text === '打开子表单1'){
          await FormStore.updateChildrenSubmit('子表单提交')
        }
        let _data = await state.fApi.submit?.();
        state.formConfig.schemas.forEach((val)=>{
          if(val.component === 'JournalNumber'){
            _data = {..._data, [val.field]: val.format}
          }
        })
        let fromId = FormStore.childrenSubmit.text === '子表单提交' ? FormStore.getAddChildrenData: history.state.id
        if(state.isEdit){
          await props.updateDynamicValue(_data, fromId)
        }else{
          await props.handleGetDatas(_data, fromId)
        }
        nextTick(()=>{
          handleCancel();
          FormStore.updateIsPreview(true)
        })
      };

      const onSubmit = (_data: IAnyObject) => {
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
        setFormModelfun,
      };
    },
  });
</script>
