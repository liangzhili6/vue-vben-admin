<!-- 
  子表单
 -->
<template>
  <div style="height: 100%"  class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="schema.children.length === 0"
      description="从左侧选择控件添加"
    />
    <Form v-bind="formConfig" style="height: 100%">
      <div class="draggable-box" >
        <!-- v-if="['custom'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        <!-- Subform 子表单 -->
        <grid-layout
          :layout.sync="schema.children"
          :col-num="100"
          :row-height="40"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[1, 1]"
        >
          <grid-item
            v-for="item in schema.children"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
          >
            <LayoutItem
              class="drag-move"
              :key="item.key"
              :schema="item"
              :data="schema.children"
              :current-item="formConfig?.currentItem || {}"
              :static="formConfig&&formConfig.currentItem&&(formConfig.currentItem.component === item.component)?true: false"
            />
          </grid-item>
        </grid-layout>
      </div>
      <div >
        <!-- v-if="['table'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        // 1111111111111
        <!-- <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="formConfig.schemas"
          item-key="key"
          @add="addItem"
          @start="handleDragStart"
        >
          <template #item="{ element }">
            <LayoutItem
              class="drag-move"
              :schema="element"
              :data="formConfig"
              :current-item="formConfig.currentItem || {}"
            />
          </template>
        </draggable> -->
      </div>
    </Form>
  </div>
</template>

<script lang="ts" name="Subform">
  import draggable from 'vuedraggable';
  import { defineComponent, computed, unref, ref, defineAsyncComponent } from 'vue';
  import { asyncComputed } from '@vueuse/core';
  import { Form, Empty, Button, TypographyTitle } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { useFormModelState } from '@/views/form-design/hooks/useFormDesignState';
  import { omit } from 'lodash-es';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { IToolbarMethods } from '@/views/form-design/typings/form-type';
  import VFormPreviews from '@/views/form-design/components/VFormPreview/useForm.vue';
  import { GetOneFormApi } from '@/api/sys/form';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { useFormStore } from '@/store/modules/form';
  import gridLayout from 'vue-grid-layout';

  const FormStore = useFormStore();

  export default defineComponent({
    name: 'Subform',
    components: {
      draggable,
      LayoutItem: defineAsyncComponent(
        () => import('@/views/form-design/components/VFormDesign/components/LayoutItem.vue'),
      ),
      Empty,
      Form,
      Button,
      PlusOutlined,
      VFormPreviews,
      GridLayout: gridLayout.GridLayout,
      GridItem: gridLayout.GridItem,
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
      // const { push, go, replace } = useRouter();
      // const { formModel: formData1, setFormModel } = useFormModelState();
      /* const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      }); */
      /* const layout = ref([
        { x: 0, y: 0, w: 2, h: 1, i: '0' },
        { x: 2, y: 0, w: 2, h: 1, i: '1' },
        { x: 4, y: 0, w: 2, h: 1, i: '2' },
        { x: 6, y: 0, w: 2, h: 1, i: '3' },
        { x: 8, y: 0, w: 2, h: 1, i: '4' },
        { x: 10, y: 0, w: 50, h: 1, i: '5' },
      ]); */
      const { formConfig } = unref(props);

      // const eFormPreview = ref<null | IToolbarMethods>(null);
      // const itemProp = unref(props.schema);
      // console.log('itemProp', props.formConfig, props.formConfig?.currentItem?.component);
      
      const addItem = ({ newIndex }: any) => {
        /* formConfig.value.schemas = formConfig.value.schemas || [];
        const schemas = formConfig.value.schemas;
        schemas[newIndex] = cloneDeep(schemas[newIndex]);
        emit('handleSetSelectItem', schemas[newIndex]); */
      };
      const handleDragStart = (e: any) => {
        // emit('handleSetSelectItem', formConfig.value.schemas[e.oldIndex]);
      };
      /* const formItemProps = computed(() => {
        const { formConfig } = unref(props);
        let { field, required, rules, labelCol, wrapperCol } = unref(props.schema);
        const { colon } = props.formConfig;
        const { itemProps } = unref(props.schema);
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
      }) as Recordable<any>; */

      /* const componentItem = computed(() => componentMap.get(props.schema.component as string)); */

      /* const goBack = () => {
        go(-1);
      };
      const handleClick = (schema: IVFormComponent) => {
        if (schema.component === 'Button' && schema.componentProps?.handle)
          emit(schema.componentProps?.handle);
      }; */
      /**
       * 处理异步属性，异步属性会导致一些属性渲染错误，如defaultValue异步加载会导致渲染不出来，故而此处只处理options，treeData，同步属性在cmpProps中处理
       */
      /* const asyncProps = asyncComputed(async () => {
        let { options, treeData } = props.schema.componentProps ?? {};
        if (options) options = await handleAsyncOptions(options);
        if (treeData) treeData = await handleAsyncOptions(treeData);
        return {
          options,
          treeData,
        };
      }); */

      /**
       * 处理同步属性
       */
      /* const cmpProps = computed(() => {
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
      }); */

      /* const handleChange = function (e) {
        const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        const target = e ? e.target : null;
        const value = target ? (isCheck ? target.checked : target.value) : e;
        setFormModel(props.schema.field!, value);
        emit('change', value);
      }; */
      return {
        // ...toRefs(state),
        // componentItem,
        /* itemProp,
        formItemProps,
        handleClick,
        asyncProps,
        cmpProps,
        handleChange,
        colPropsComputed,
        push,
        go,
        goBack,
        replace,
        eFormPreview,
        childrenDataProp, */
        formConfig,
        addItem,
        handleDragStart,
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
      // padding: 3px 2px;
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
  .ant-descriptions-item {
    margin-bottom: 0px;
  }
  .form-panel {
    position: relative;
    height: 100%;
    height: 100vh;
    height: calc(100vh - 120px);
    min-height: 165px;
    .empty-text {
      position: absolute;
      z-index: 100;
      inset: -10% 0 0;
      height: 150px;
      margin: auto;
      color: #aaa;
    }
  }
  .draggable-box {
    height: 100%;
    // height: calc(100vh - 120px);
    width: 100%;
    // overflow: auto;
    .drag-move {
      min-height: 102px;
      cursor: move;
    }

    .list-main {
      min-height: 100%;
      // position: relative;
      overflow: auto;
      // 列表动画
      .list-enter-active {
        transition: all 0.5s;
      }

      .list-leave-active {
        transition: all 0.3s;
      }

      .list-enter,
      .list-leave-to {
        transform: translateX(-100px);
        opacity: 0;
      }

      .list-enter {
        height: 30px;
      }
    }
  }
</style>
<style>
.ant-form-item-control-input{
  min-height: 165px;
}
</style>
