<template>
  <div>
    <Select class="v-form-item-wrapper" :schema="schema" @change="handleChange" :style="schema.width ? { width: schema.width } : {}" @click="handleClick(schema)"></Select>
    
  </div>
</template>

<script lang="ts" name="Member">
  import { defineComponent, computed, unref } from 'vue';
  import { asyncComputed } from '@vueuse/core';
  import {  Select } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { useFormModelState } from '@/views/form-design/hooks/useFormDesignState';
  import { omit } from 'lodash-es';
  export default defineComponent({
    name: 'Member',
    components: {
      Select,
    },

    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        required: true,
      },
    },
    emits: ['update:form-data', 'change'],
    setup(props, { emit }) {
      /* const state = reactive({
        componentMap,
      }); */

      const { formModel: formData1, setFormModel } = useFormModelState();
      const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      });
      const formItemProps = computed(() => {
        const { formConfig } = unref(props);
        let { field, required, rules, labelCol, wrapperCol } = unref(props.schema);
        const { colon } = props.formConfig;

        const { itemProps } = unref(props.schema);

        //<editor-fold desc="布局属性">
        labelCol = labelCol
          ? labelCol
          : formConfig.layout === 'horizontal'
            ? formConfig.labelLayout === 'flex'
              ? { style: `width:${formConfig.labelWidth}px` }
              : formConfig.labelCol
            : {};

        wrapperCol = wrapperCol
          ? wrapperCol
          : formConfig.layout === 'horizontal'
            ? formConfig.labelLayout === 'flex'
              ? { style: 'width:auto;flex:1' }
              : formConfig.wrapperCol
            : {};

        const style =
          formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex'
            ? { display: 'flex' }
            : {};

        /**
         * 将字符串正则格式化成正则表达式
         */

        const newConfig = Object.assign(
          {},
          {
            name: field,
            style: { ...style },
            colon,
            required,
            rules,
            labelCol,
            wrapperCol,
          },
          itemProps,
        );
        if (!itemProps?.labelCol?.span) {
          newConfig.labelCol = labelCol;
        }
        if (!itemProps?.wrapperCol?.span) {
          newConfig.wrapperCol = wrapperCol;
        }
        if (!itemProps?.rules) {
          newConfig.rules = rules;
        }
        return newConfig;
      }) as Recordable<any>;

      /* const componentItem = computed(() => componentMap.get(props.schema.component as string)); */

      const handleClick = (schema: IVFormComponent) => {
      // console.log('component handleClick---schema:', schema);
        if (schema.component === 'Button' && schema.componentProps?.handle)
          emit(schema.componentProps?.handle);
      };
      /**
       * 处理异步属性，异步属性会导致一些属性渲染错误，如defaultValue异步加载会导致渲染不出来，故而此处只处理options，treeData，同步属性在cmpProps中处理
       */
      const asyncProps = asyncComputed(async () => {
        let { options, treeData } = props.schema.componentProps ?? {};
        if (options) options = await handleAsyncOptions(options);
        if (treeData) treeData = await handleAsyncOptions(treeData);
        return {
          options,
          treeData,
        };
      });

      /**
       * 处理同步属性
       */
      const cmpProps = computed(() => {
        const isCheck =
          props.schema && ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        let { field } = props.schema;

        let { disabled, ...attrs } =
          omit(props.schema.componentProps, ['options', 'treeData']) ?? {};

        disabled = props.formConfig.disabled || disabled;

        return {
          ...attrs,
          disabled,
          [isCheck ? 'checked' : 'value']: formData1.value[field!],
        };
      });

      const handleChange = function (e) {
        const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        const target = e ? e.target : null;
        const value = target ? (isCheck ? target.checked : target.value) : e;
        setFormModel(props.schema.field!, value);
        emit('change', value);
      };
      return {
        // ...toRefs(state),
        // componentItem,
        formItemProps,
        handleClick,
        asyncProps,
        cmpProps,
        handleChange,
        colPropsComputed,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.icon) {
    width: 1em;
    height: 1em;
    overflow: hidden;
    fill: currentcolor;
    vertical-align: -0.15em;
  }

  .rule-props-content {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    .rule-props-item {
      position: relative;
      margin-bottom: 5px;
      padding: 3px 2px;
      border-radius: 5px;
      background-color: #f0eded;

      :deep(.ant-form-item) {
        border: 0 !important;
      }

      &-close {
        position: absolute;
        z-index: 999;
        top: -5px;
        right: -5px;
        border-radius: 7px;
        background-color: #a3a0a0;
        color: #ccc;
        cursor: pointer;

        &:hover {
          color: #00c;
        }
      }
    }
  }
</style>
