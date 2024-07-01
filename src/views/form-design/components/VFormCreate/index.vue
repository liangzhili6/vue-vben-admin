<!--
 * @Description: 表单渲染器，根据json生成表单
-->
<template>
  <div class="v-form-container">
    <Form
      class="v-form-model"
      ref="eFormModel"
      :model="formModel"
      v-bind="formModelProps"
      style="position: relative; height: 500px; overflow: hidden; overflow-y: scroll"
    >
      <Row style="height: 100%;">
        <FormRender
          v-for="(schema, index) of noHiddenList"
          :key="index"
          :schema="schema"
          :formConfig="formConfig"
          :formData="formModelNew"
          @change="handleChange"
          :setFormModel="setFormModel"
          @submit="handleSubmit"
          @reset="resetFields"
          :style="[
            { position: 'absolute' },
            schema.position
              ? {
                  width: schema.w + '%',
                  height: (schema.h)*30 + 'px',
                  left: (schema.x) + '%',
                  top: (schema.y)*30 + 'px',
                }
              : null,
          ]"
        >
          <template v-if="schema && schema.componentProps" #[`schema.componentProps!.slotName`]>
            <slot
              :name="schema.componentProps!.slotName"
              v-bind="{ formModel: formModel, field: schema.field, schema }"
              ?
            ></slot
            >?
          </template>
        </FormRender>
      </Row>
    </Form>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, provide, ref, unref, onMounted, nextTick } from 'vue';
  import FormRender from './components/FormRender.vue';
  import { IFormConfig, AForm } from '../../typings/v-form-component';
  import { Form, Row, Col } from 'ant-design-vue';
  import { useFormInstanceMethods } from '../../hooks/useFormInstanceMethods';
  import { IProps, IVFormMethods, useVFormMethods } from '../../hooks/useVFormMethods';
  import { useVModel } from '@vueuse/core';
  import { omit } from 'lodash-es';

  export default defineComponent({
    name: 'VFormCreate',
    components: {
      FormRender,
      Form,
      Row,
    },
    props: {
      fApi: {
        type: Object,
      },
      formModel: {
        type: Object,
        default: () => ({}),
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        required: true,
      },
    },
    emits: ['submit', 'change', 'update:fApi', 'update:formModel'],
    setup(props, context) {
      const wrapperComp = props.formConfig.layout == 'vertical' ? Col : Row;
      const { emit } = context;
      const eFormModel = ref<AForm | null>(null);
      const formModelNew = computed({
        get: () => props.formModel,
        set: (value) => emit('update:formModel', value),
      });

      const noHiddenList = computed(() => {
        return (
          props.formConfig.schemas &&
          props.formConfig.schemas.filter((item) => {
            /* if( item.hiddenView&&item.hiddenView[item.hiddenView.key] && item.key === item.hiddenView.key) */
            return item.hidden !== true;
          })
        );
      });

      const fApi = useVModel(props, 'fApi', emit);

      const { submit, validate, clearValidate, resetFields, validateField } =
        useFormInstanceMethods<['submit', 'change', 'update:fApi', 'update:formModel']>(
          props,
          formModelNew,
          context,
          eFormModel,
        );

      const { linkOn, ...methods } = useVFormMethods<
        ['submit', 'change', 'update:fApi', 'update:formModel']
      >(
        { formConfig: props.formConfig, formData: props.formModel } as unknown as IProps,
        context,
        eFormModel,
        {
          submit,
          validate,
          validateField,
          resetFields,
          clearValidate,
        },
      );
      fApi.value = methods;
      const handleChange = (_event) => {
        console.log('handleChange_event', _event, linkOn);
        const { schema, value } = _event;
        const { field } = unref(schema);
        // ---------------------
        Object.values(linkOn).forEach((item) => {
          item.forEach((itemValue) => {
            if (itemValue.hiddenView && itemValue?.hiddenView.length) {
              var result = itemValue?.hiddenView.find((re, i) => {
                let obj = Object.keys(re)[0];
                return field + '__' + value === obj;
              });
              if (result) {
                itemValue.hidden = false;
                // itemValue.hiddenView[i][obj].hidden = false;
              } else {
                itemValue.hidden = true;
                // itemValue.hiddenView[i][obj].hidden = true;
              }
            }
          });
        });
        // +++++++++++++++++++++
        linkOn[field!]?.forEach((formItem) => {
          formItem.update?.(value, formItem, fApi.value as IVFormMethods);
        });
      };
      /**
       * 获取表单属性
       */
      const formModelProps = computed(
        () => omit(props.formConfig, ['disabled', 'labelWidth', 'schemas']) as Recordable,
      );

      const handleSubmit = () => {
        submit();
      };

      provide('formModel', formModelNew);
      const setFormModel = (key, value) => {
        formModelNew.value[key] = value;
      };

      provide<(key: String, value: any) => void>('setFormModelMethod', setFormModel);

      onMounted(()=>{
        // nextTick(() => (showRef.value = true));
        let vFormModel = document.getElementsByClassName('v-form-model');
        console.log('v-form-model', vFormModel, vFormModel[0]?.offsetWidth)
        console.log('v-form-model', vFormModel, vFormModel[0]?.offsetHeight)
        // 
      })
      // 把祖先组件的方法项注入到子组件中，子组件可通过inject获取
      return {
        eFormModel,
        submit,
        validate,
        validateField,
        resetFields,
        clearValidate,
        handleChange,
        formModelProps,
        handleSubmit,
        setFormModel,
        formModelNew,
        wrapperComp,
        noHiddenList,
      };
    },
   
  });
</script>

<style lang="less" scoped>
  .v-form-model {
    overflow: hidden;
  }
</style>
