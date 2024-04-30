<template>
  <div style="padding: 20px">
    <TypographyTitle style="display: flex; justify-content: center" :level="4">{{
      formConfig.title
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
      style="display: flex; flex: 1; justify-content: center; padding: 10px 0; text-align: center"
    >
      <Button type="primary" @click="submitFormTemplate">{{
        jsonData.submitFormTemplateTxt
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

  export default defineComponent({
    name: 'Crf',
    components: { VFormCreate, Button, TypographyTitle },
    setup() {
      const jsonData = ref({
        title: '新增表单',
        submitFormTemplateTxt: '保存数据',
        // 表单配置
        schemas: [
          {
            component: 'RadioGroup',
            label: '单选框',
            field: '_radio_group_8',
            colProps: {
              span: 24,
            },
            componentProps: {
              options: [
                {
                  label: '选项1',
                  value: '1',
                },
                {
                  label: '选项2',
                  value: '2',
                },
              ],
            },
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
            flag: {
              value: '1',
              keyList: ['_checkbox_group_9', '_input_27'],
            },
          },
          {
            component: 'CheckboxGroup',
            label: '多选框',
            field: '_checkbox_group_9',
            colProps: {
              span: 24,
            },
            componentProps: {
              options: [
                {
                  label: '选项1',
                  value: '1',
                },
                {
                  label: '选项2',
                  value: '2',
                },
              ],
            },
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
            hidden: true,
            hiddenView: {
              hidden: true,
              key: '_radio_group_8',
              _radio_group_8: '1',
              value: '1',
            },
          },
          {
            component: 'InputTextArea',
            label: '多行文本',
            field: '_input_text_area_1',
            colProps: {
              span: 24,
            },
            componentProps: {},
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
          },
          {
            component: 'Input',
            label: '单行文本',
            field: '_input_2',
            colProps: {
              span: 24,
            },
            componentProps: {
              type: 'text',
            },
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
          },
          {
            component: 'Input',
            label: '电子邮箱',
            field: '_input_26',
            colProps: {
              span: 24,
            },
            componentProps: {
              type: 'text',
            },
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
          },
          {
            component: 'Input',
            label: '网址',
            field: '_input_27',
            colProps: {
              span: 24,
            },
            componentProps: {
              type: 'text',
            },
            itemProps: {
              labelCol: {},
              wrapperCol: {},
            },
            hidden: true,
            hiddenView: {
              hidden: true,
              key: '_radio_group_8',
              _radio_group_8: '1',
              value: '1',
            },
          },
        ],
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

      const handleGetData = async () => {
        const _data = await state.fApi.submit?.();
        // jsonModal.value?.showModal?.(_data);
      };

      const onSubmit = (_data: IAnyObject) => {
        console.log('_data', _data);
        //
      };
      const submitFormTemplate = () => {
        console.log('submitFormTemplate', state.formConfig);
      };
      return {
        handleGetData,
        ...toRefs(state),
        // showModal,
        jsonModal,
        onSubmit,
        submitFormTemplate,
        jsonData,
      };
    },
  });
  /*   onMounted(() => {
    state.formConfig = jsonData as any;
  }); */
</script>
