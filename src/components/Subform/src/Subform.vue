<!-- 
  子表单
 -->
<template>
  <div style="height: 100%; border: 1px solid #cccccc" class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="schema.children.length === 0"
      description="从左侧选择控件添加"
    />
    <Form v-bind="formConfig" style="height: 100%">
      <div class="draggable-box" v-if="!FormStore.previewView">
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
              :static="
                formConfig &&
                formConfig.currentItem &&
                formConfig.currentItem.component === item.component
                  ? true
                  : false
              "
            />
          </grid-item>
        </grid-layout>
      </div>
      <div
        v-if="
          FormStore.previewView &&
          ['custom'].includes(formConfig.currentItem.componentProps['SubformType'])
        "
      >
        <!-- v-if="['table'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="schema.children"
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
        </draggable>
      </div>
      <div
        v-if="
          FormStore.previewView &&
          ['table'].includes(formConfig.currentItem.componentProps['SubformType'])
        "
      >
        <BasicTable
          ref="tableElRef"
          :dataSource="dataSource"
          :columns="getColumns"
          :pagination="false"
        >
          <template #toolbar>
            <a-button type="primary" @click="handleImportData">导入</a-button>
            <a-button type="primary" @click="handleExport">导出</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <!-- <template> -->
            <template v-if="column.dataIndex === 'edit'">
              <Dropdown :trigger="['click']">
                <SettingOutlined @click.prevent />
                <template #overlay>
                  <Menu @click="editForm">
                    <MenuItem key="复制" :item="record">
                      <a href="javascript:;">复制</a>
                    </MenuItem>
                    <MenuItem key="删除" :item="record">
                      <a href="javascript:;">删除</a>
                    </MenuItem>
                    <MenuItem key="上移" :item="record">
                      <a href="javascript:;">上移</a>
                    </MenuItem>
                    <MenuItem key="下移" :item="record">
                      <a href="javascript:;">下移</a>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </template>
          </template>
        </BasicTable>
        <!-- v-if="['table'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        <!-- <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="schema.children"
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
  import {
    Form,
    Empty,
    TypographyTitle,
    Dropdown,
    Menu,
    Button,
    Switch,
    MenuItem,
  } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { useFormModelState } from '@/views/form-design/hooks/useFormDesignState';
  import { omit } from 'lodash-es';
  import { SettingOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { IToolbarMethods } from '@/views/form-design/typings/form-type';
  import VFormPreviews from '@/views/form-design/components/VFormPreview/useForm.vue';
  import { GetOneFormApi } from '@/api/sys/form';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { useFormStore } from '@/store/modules/form';
  import gridLayout from 'vue-grid-layout';
  import { Table } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { ColumnType } from 'ant-design-vue/es/table/interface';

  export default defineComponent({
    name: 'Subform',
    components: {
      SettingOutlined,
      MenuItem,
      Dropdown,
      Menu,
      Button,
      Switch,
      BasicTable,
      draggable,
      LayoutItem: defineAsyncComponent(
        () => import('@/views/form-design/components/VFormDesign/components/LayoutItem.vue'),
      ),
      Empty,
      Form,
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
      const FormStore = useFormStore();
      const { formConfig } = unref(props);
      const handleImportData = () => {
        console.log('handleImportData');
      };
      const handleExport = () => {
        console.log('handleExport');
      };
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
      const dataSource = [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ];

      /* const columns = [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
        ]; */
      const getColumns = computed(() => {
        let columns = [];
        console.log('schema', props.schema);
        columns = props.schema.children?.map((el) => {
          return {
            ...el,
            title: el.label,
            dataIndex: el.field,
            key: el.field,
          };
        });
        return [{title: "",dataIndex: 'edit', width: 80}, ...columns] as unknown as ColumnType[];
      });
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
        getColumns,
        dataSource,
        formConfig,
        addItem,
        FormStore,
        handleDragStart,
        handleImportData,
        handleExport,
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
  .ant-form-item-control-input {
    min-height: 165px;
  }
</style>
