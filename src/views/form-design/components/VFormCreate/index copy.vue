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
      <Row>
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
                  width: schema.position.w + 'px',
                  height: schema.position.h + 'px',
                  left: schema.position.x + 'px',
                  top: schema.position.y + 20 + 'px',
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
  import { computed, defineComponent, PropType, provide, ref, unref } from 'vue';
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
        // console.log('Object.values(linkOn)', Object.values(linkOn))
        Object.values(linkOn).forEach((item) => {
          item.forEach((itemValue) => {
            console.log('itemValue', itemValue, 'item', item, 'value', value);
            // const isHidden = itemValue?.hidden;
            let handler = {
              get: function (target, prop) {
                // console.log(`Getting value for ${prop}`);
                return prop;
              },
            };
            if (itemValue.hidden === true) {
              itemValue?.hiddenView.forEach((re, i) => {
                let proxy = new Proxy(re, handler);
                // console.log('itemValue.key', itemValue.key)
                // console.log('value', value)
                // console.log("itemValue.key+'__'+value", itemValue.key + "__" + value)
                let str = itemValue.key + '__' + value;
                let obj = proxy[str];
                console.log(
                  're-----',
                  re,
                  obj,
                  re[obj],
                  "(field+'__'+value) == obj",
                  field + '__' + value === obj,
                );
                const hiddenKey = re[obj]?.key;
                const hiddenValue = re[obj]?.value;
                // console.log('hiddenKey-----', hiddenKey)
                console.log('hiddenValue-----', hiddenValue);
                console.log('field-----', field);
                console.log('hiddenKey-----', hiddenKey);
                console.log('value.includes(hiddenValue)-----', value.includes(hiddenValue));

                console.log(
                  '11111111111111-----',
                  field === hiddenKey && value.includes(hiddenValue),
                );
                if (field + '__' + value == obj) {
                  console.log('关联组件显隐命中-操作显隐逻辑', itemValue.hidden);
                  itemValue.hidden = false;
                  itemValue.hiddenView[i][obj].hidden = false;
                }
              });
              /* const hiddenKey = itemValue?.hiddenView?.key;
              const hiddenValue = itemValue?.hiddenView?.value;
              if (field === hiddenKey && value.includes(hiddenValue)) {
                console.log('关联组件显隐命中-操作显隐逻辑', itemValue.hidden);
                itemValue.hidden = false
                itemValue.hiddenView.hidden = false
              } */
            } else if (itemValue.hidden === false) {
              itemValue?.hiddenView.forEach((re, i) => {
                let proxy = new Proxy(re, handler);
                // console.log('itemValue.key', itemValue.key)
                // console.log('value', value)
                // console.log("itemValue.key+'__'+value", itemValue.key + "__" + value)
                let str = itemValue.key + '__' + value;
                let obj = proxy[str];
                console.log(
                  're++++++++',
                  re,
                  obj,
                  re[obj],
                  "(field+'__'+value) == obj",
                  field + '__' + value === obj,
                );

                const hiddenKey = re[obj]?.key;
                const hiddenValue = re[obj]?.value;
                // console.log('hiddenKey++++++++', hiddenKey)
                console.log('hiddenValue++++++++', hiddenValue);
                console.log('field-----', field);
                console.log('hiddenKey-----', hiddenKey);
                console.log('value.includes(hiddenValue)-----', value.includes(hiddenValue));
                if (field + '__' + value != obj) {
                  console.log('关联组件显隐命中-操作显隐逻辑', itemValue.hidden);
                  itemValue.hidden = true;
                  itemValue.hiddenView[i][obj].hidden = false;
                }
              });
              /* const hiddenKey = itemValue?.hiddenView?.key;
              const hiddenValue = itemValue?.hiddenView?.value;
              if (field === hiddenKey && !value.includes(hiddenValue)) {
                console.log('关联组件显隐命中-操作显隐逻辑 yingcang', item);
                itemValue.hidden = true
                itemValue.hiddenView.hidden = true
              } */
            }
          });
        });
        console.log('itemValue', linkOn);
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
