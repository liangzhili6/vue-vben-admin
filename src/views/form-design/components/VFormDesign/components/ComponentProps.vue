<!--
 * @Description: 组件属性控件
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem">
      <Empty class="hint-box" v-if="!formConfig.currentItem.key" description="未选择组件" />

      <Form label-align="left" layout="vertical">
        <FormItem label="" v-if="['JournalNumber'].includes(formConfig.currentItem.component)">
          格式<BasicHelp
            :class="`${prefixCls}-help`"
            text="{YYYY}表示4位数年份
              {YY}表示2位数年份
              {MM}表示2位数月份，如果月份小于10，则加零补齐，如1月份显示为01
              {M} 表示月份，如果月份小于10，则不会补齐，如1月份显示为1
              {DD}表示2位数日，如果小于10，则加零补齐，如1号显示为01
              {D}表示日，如果小于10，则不会补齐，如1号显示为1
              {#2/D}表示计数，其中数字表示流水号长度(用0补齐)，字母表示计数周期，可以为D(每天重置)，W(每周重置)，M(每月重置)，Y(每年重置)，不写斜杠以及字母则不会重置，一直递增"
          />
          <Input
            v-model:value="formConfig.currentItem['format']"
            @change="changeJournalNumber"
          />
        </FormItem>
        <FormItem
          label="数据来源"
          v-if="['Correlation'].includes(formConfig.currentItem.component)"
        >
          <Select
            v-model:value="formConfig.currentItem['Correlation']"
            :options="CorrelationOptionsList"
            @change="changeCorrelationShowKey"
          />
        </FormItem>
        <FormItem label="字段" v-if="['Correlation'].includes(formConfig.currentItem.component)">
          <Select
            mode="multiple"
            v-model:value="formConfig.currentItem['CorrelationShowKey']"
            :options="CorrelationShowKeyList"
            @change="handleShowKey"
          />
        </FormItem>
        <FormItem label="宽" v-if="['Correlation'].includes(formConfig.currentItem.component)">
          <InputNumber
            id="inputNumber"
            v-model:value="formConfig.currentItem['width']"
            :min="120"
          />
        </FormItem>
        <FormItem label="中心" v-if="['CentreSelect'].includes(formConfig.currentItem.component)">
        </FormItem>
        <FormItem label="成员" v-if="['MemberSelect'].includes(formConfig.currentItem.component)">
        </FormItem>
        <FormItem label="图文内容" v-if="['ImageText'].includes(formConfig.currentItem.component)">
          <Tinymce
            :schema="{ ...formConfig, defaultValue: '图文内容' }"
            v-model:value="formConfig.currentItem['defaultValue']"
            @change="handleChange"
          />
        </FormItem>
        <!--    循环遍历渲染组件属性      -->
        <div v-if="formConfig.currentItem && formConfig.currentItem.componentProps">
          <FormItem v-for="item in inputOptions" :key="item.name" :label="item.label">
            <!--     处理数组属性，placeholder       -->
            <div v-if="item.children">
              <template v-for="(child, index) of item.children" :key="index">
                <component
                  v-if="child.component"
                  v-bind="child.componentProps"
                  v-model:value="formConfig.currentItem.componentProps[item.name][index]"
                  :is="child.component"
                />
              </template>
            </div>
            <!--     如果不是数组，则正常处理属性值       -->
            <component
              v-else-if="item.component"
              class="component-prop"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.componentProps[item.name]"
            />
          </FormItem>
          <FormItem label="控制属性">
            <Col v-for="item in controlOptions" :key="item.name">
              <Checkbox
                v-if="showControlAttrs(item.includes)"
                v-bind="item.componentProps"
                v-model:checked="formConfig.currentItem.componentProps[item.name]"
              >
                {{ item.label }}
              </Checkbox>
            </Col>
          </FormItem>
        </div>
        <FormItem label="关联字段">
          <Select
            mode="multiple"
            v-model:value="formConfig.currentItem['link']"
            :options="linkOptions"
          />
        </FormItem>

        <FormItem
          label="选项"
          v-if="
            [
              'Select',
              'CheckboxGroup',
              'RadioGroup',
              'TreeSelect',
              'Cascader',
              'AutoComplete',
            ].includes(formConfig.currentItem.component)
          "
        >
          <FormOptions />
        </FormItem>

        <FormItem label="栅格" v-if="['Grid'].includes(formConfig.currentItem.component)">
          <FormOptions />
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Empty,
    Input,
    Form,
    FormItem,
    Switch,
    Checkbox,
    Select,
    InputNumber,
    RadioGroup,
    Col,
    Row,
    Select as MemberSelect,
    Select as CentreSelect,
  } from 'ant-design-vue';
  // import { Select  as MemberSelect } from 'ant-design-vue';
  import RadioButtonGroup from '@/components/Form/src/components/RadioButtonGroup.vue';

  import BasicHelp from '@/components/Basic/src/BasicHelp.vue';
  import { computed, defineComponent, ref, watch  } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import {
    baseComponentControlAttrs,
    baseComponentAttrs,
    baseComponentCommonAttrs,
    componentPropsFuncs,
  } from '../../VFormDesign/config/componentPropsConfig';
  import FormOptions from './FormOptions.vue';
  import { formItemsForEach, remove } from '../../../utils';
  import { IBaseFormAttrs } from '../config/formItemPropsConfig';
  import { Tinymce } from '@/components/Tinymce';
  import { Correlation } from '@/components/Correlation';
  import { notification } from 'ant-design-vue';
  // import { useVFormMethods } from '../../../hooks/useVFormMethods';
  // import { IFormConfig } from '../../../typings/v-form-component';
  export default defineComponent({
    name: 'ComponentProps',
    components: {
      FormOptions,
      Empty,
      Input,
      Form,
      FormItem,
      Switch,
      Checkbox,
      Select,
      InputNumber,
      RadioGroup,
      RadioButtonGroup,
      Col,
      Row,
      Tinymce,
      MemberSelect,
      CentreSelect,
      Correlation,
      BasicHelp,
    },
    emits: ['change', 'update:value', 'delete'],
    setup(props, {emit}) {
      console.log('props', props, emit)

      // 让compuated属性自动更新
      const CorrelationOptionsList = ref([]);
      const CorrelationShowKeyList = ref([]);
      const { prefixCls } = useDesign('basic-title');
      const allOptions = ref([] as Omit<IBaseFormAttrs, 'tag'>[]);
      const showControlAttrs = (includes: string[] | undefined) => {
        if (!includes) return true;
        return includes.includes(formConfig.value.currentItem!.component);
      };

      const { formConfig } = useFormDesignState();
      if (formConfig.value.currentItem) {
        formConfig.value.currentItem.componentProps =
          formConfig.value.currentItem.componentProps || {};
      }
      watch(
        () => formConfig.value.currentItem?.field,
        (_newValue, oldValue) => {
          formConfig.value.schemas &&
            formItemsForEach(formConfig.value.schemas, (item) => {
              if (item.link) {
                const index = item.link.findIndex((linkItem) => linkItem === oldValue);
                index !== -1 && remove(item.link, index);
              }
            });
        },
      );
   /**
       * 关联记录
       * @param fromId 自己的表单id--编辑表单使用
       */
       const CorrelationOptions = async (fromId?: any) => {
        CorrelationOptionsList.value = (
          await formConfig.value.currentItem!.componentProps!.api[0]({ fromId })
        ).map((item: any) => {
          return {
            ...item,
            value: item.id,
            label: item.formName,
          };
        });
      };
      ['CentreSelect'].includes(formConfig.value.currentItem!.component)? CorrelationOptions(history.state.id ? history.state.id : 0):null
      watch(
        () => formConfig.value.currentItem && formConfig.value.currentItem.component,
        (_newValue) => {
          allOptions.value = [];
          baseComponentControlAttrs.forEach((item) => {
            item.category = 'control';
            if (!item.includes) {
              // 如果属性没有include，所有的控件都适用

              allOptions.value.push(item);
            } else if (item.includes.includes(formConfig.value.currentItem!.component)) {
              // 如果有include，检查是否包含了当前控件类型
              allOptions.value.push(item);
            }
          });

          baseComponentCommonAttrs.forEach((item) => {
            item.category = 'input';
            if (item.includes) {
              if (item.includes.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else if (item.exclude) {
              if (!item.exclude.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else {
              allOptions.value.push(item);
            }
          });

          baseComponentAttrs[formConfig.value.currentItem!.component] &&
            baseComponentAttrs[formConfig.value.currentItem!.component].forEach(async (item) => {
              if (item.component) {
                if (['Switch', 'Checkbox', 'Radio'].includes(item.component as string)) {
                  item.category = 'control';
                  allOptions.value.push(item);
                } else {
                  item.category = 'input';
                  allOptions.value.push(item);
                }
              }
            });
            if(_newValue === 'Correlation'){
              CorrelationOptions(history.state.id ? history.state.id : 0);
            }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      // 控制性的选项
      const controlOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category === 'control';
        });
      });

      // 非控制性选择
      const inputOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category === 'input';
        });
      });

      watch(
        () => formConfig.value.currentItem!.componentProps,
        () => {
          const func = componentPropsFuncs[formConfig.value.currentItem!.component];
          if (func) {
            func(formConfig.value.currentItem!.componentProps, allOptions.value);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const linkOptions = computed(() => {
        return (
          formConfig.value.schemas &&
          formConfig.value.schemas
            .filter((item) => item.key !== formConfig.value.currentItem!.key)
            .map(({ label, field }) => ({ label: label + '/' + field, value: field }))
        );
      });

      const handleShowKey = (e) => {
        if (!e) {
          formConfig.value.currentItem.CorrelationShowKeyItem = [];
        }
        if (e.length > 3) {
          notification.open({
            message: '',
            description: '最多展示3个字段',
            duration: 1,
          });
          e.pop();
        }
        formConfig.value.currentItem.CorrelationShowKeyItem =
          CorrelationShowKeyList.value &&
          CorrelationShowKeyList.value.filter((item: any) => e.some((el: any) => item.key === el));
      };
      /**
       * 显示字段下拉字典
       */
      const changeCorrelationShowKey = async (id) => {
        formConfig.value!.currentItem!.CorrelationShowKey = [];
        formConfig.value.currentItem.CorrelationShowKeyItem = [];
        CorrelationShowKeyList.value = (
          await formConfig.value.currentItem!.componentProps!.api[1]({ id, formVersion: '' })
        ).schemas.map((item: any) => {
          return {
            ...item,
            value: item.field,
          };
        });
      };
      const changeJournalNumber = async (id) => {
        console.log('id',id)
      };
   
      const handleChange = (val: any) => {
        formConfig.value.schemas.filter((item) => {
          item.defaultValue = val;
          return item.key === formConfig.value.currentItem!.key;
        });
      };
      return {
        formConfig,
        showControlAttrs,
        linkOptions,
        controlOptions,
        inputOptions,
        handleChange,
        CorrelationOptions,
        CorrelationOptionsList,
        changeCorrelationShowKey,
        CorrelationShowKeyList,
        handleShowKey,
        changeJournalNumber,
        prefixCls,
      };
    },
  });
</script>
<style lang="less" scoped>
  .properties-content {
    height: calc(100vh - @header-height - (@multiple-height*2 + 30px));
    overflow: hidden scroll;
  }
</style>
