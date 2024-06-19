<!-- 
  关联记录
 -->
<template>
  <div>
    <div  style="background-color: #F3F5F7;  width: 100%; height: 120px; border: 1px solid #F3F5F7;padding: 5px;overflow: hidden; border-radius: 5px;" :style="itemProp?.width?{width: itemProp?.width + 'px !important'}:{width: '100%'}">
    <Button @click="CorrelationForm(eFormPreview!);">
      <PlusOutlined />
      {{ itemProp&&itemProp.label }}
    </Button>
    <!-- <div>
      <div style="display: flex;flex-wrap: nowrap;" v-for="(items, index) in itemProp.CorrelationShowKeyItem" :key="index">
        <label>{{ items.label }}: </label>
        <EllipsisText :tooltip="false"  ></EllipsisText>
      </div>
    </div> -->
  </div>
  <VFormPreviews ref="eFormPreview" :formConfig="childrenDataProp" />

  </div>
</template>

<script lang="ts" name="Correlation">
  import {
    defineComponent,
    computed,
    unref,
    ref,
  } from 'vue';
  import { asyncComputed } from '@vueuse/core';
  import {
    Button,
  } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { useFormModelState } from '@/views/form-design/hooks/useFormDesignState';
  import { omit } from 'lodash-es';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import {  IToolbarMethods } from '@/views/form-design/typings/form-type';
  import VFormPreviews from '@/views/form-design/components/VFormPreview/useForm.vue';
  import { GetOneFormApi } from '@/api/sys/form';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { useFormStore } from '@/store/modules/form';  
  const FormStore = useFormStore();

  export default defineComponent({
    name: 'Correlation',
    components: {
      Button,
      PlusOutlined,
      VFormPreviews,
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
        // required: true,
      },
    },
    emits: ['update:form-data', 'change'],
    setup(props, { emit }) {
      const { push, go, replace } = useRouter();
      const { formModel: formData1, setFormModel } = useFormModelState();
      const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      });
      const eFormPreview = ref<null | IToolbarMethods>(null);
      const itemProp = unref(props.schema);
      const childrenDataProp = ref();
      const CorrelationForm = async (Modal: IToolbarMethods) => {
        FormStore.updateIsPreview(false)
        await FormStore.updateChildrenSubmit( '打开子表单', itemProp.Correlation)
        /* console.log('CorrelationForm', itemProp)
        console.log('FormStore.childrenSubmit', FormStore.childrenSubmit)
        console.log('FormStore.isPreview', FormStore.isPreview) */
        if(FormStore.isPreview){
          if (itemProp.Correlation) {
            const data = await GetOneFormApi({id: itemProp.Correlation});
            childrenDataProp.value = JSON.parse(data.fieldJson)
            const config = cloneDeep(childrenDataProp.value);
            Modal?.showModal(config);
            // replace({ name: 'Example2', state: { id: itemProp.Correlation } });
            }
        }else{
          // console.log('itemProp.Correlation', itemProp.Correlation)
          // const RandomOneData = await getRandomOneApi();
          // await FormStore.updateRandomOneData(RandomOneData)
          await FormStore.updateAddChildrenData(itemProp.Correlation)
          if(FormStore.childrenSubmit.text === '打开子表单'){
            await FormStore.updateChildrenSubmit('打开子表单1', itemProp.Correlation)
            // console.log('FormStore.childrenSubmit.text--99', FormStore.childrenSubmit.text)
            const data = await GetOneFormApi({id: itemProp.Correlation});
            childrenDataProp.value = JSON.parse(data.fieldJson)
            const config = cloneDeep(childrenDataProp.value);
            Modal?.showModal(config);
          }
          // console.log('addchildrenData', FormStore.addchildrenData, FormStore.RandomOneData)
        }
      };
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
          formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex' ? { display: 'flex' } : {};
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

      const goBack = () =>{
        go(-1)
      }
      const handleClick = (schema: IVFormComponent) => {
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
        itemProp,
        formItemProps,
        handleClick,
        asyncProps,
        cmpProps,
        handleChange,
        colPropsComputed,
        CorrelationForm,
        push,
        go,
        goBack,
        replace,
        eFormPreview,
        childrenDataProp,
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
  .ant-descriptions-item{
    margin-bottom: 0px;
  }
/*   .value-view{

  } */
</style>
