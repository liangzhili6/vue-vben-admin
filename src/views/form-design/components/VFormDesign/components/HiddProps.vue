<!--
 * @Description: 显隐逻辑
-->
<template>
  <div class="rule-props-content">
    <Modal
      v-model:open="open"
      title="显隐逻辑"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="cancel"
    >
      <template #footer>
        <a-button key="back" @click="cancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
      </template>
      <p>{{ modal.Text }}</p>
      <div style="margin-bottom: 40px">
        <Row :gutter="0">
          <Col :span="10">
            <div style="height: 400px">
              <div>当前选择项：</div>
              <ScrollContainer style="border: 1px solid #cccccc">
                <RadioGroup v-model:value="currentItemOptions" style="width: 100%" @change="changeCurrentItemOptions">
                  <ul style="width: 100%">
                    <template
                      v-for="(val, index) in ItemOptions.optionsList"
                      :key="index"
                    >
                      <li class="p-2" :style="{ border: '1px solid #eee', width: '100%' }">
                        <Radio :value="val.value" style="width: 100%" :id="val.key" :tabindex="val.key">
                          {{ val.label }}
                        </Radio>
                      </li>
                    </template>
                  </ul>
                </RadioGroup>
              </ScrollContainer>
            </div>
          </Col>
          <Col :span="1"></Col>
          <Col :span="13" style="height: 400px" v-for="(item, index) in ItemOptions.optionsList" :key="index" v-show="item.value === currentItemOptions">
            <div>则显示以下字段：</div>
            <ScrollContainer style="border: 1px solid #cccccc">
              <CheckboxGroup v-model:value="item.hiddenList" style="width: 100%" @change="changeSchemasComponent">
                <ul style="width: 100%">
                  <template v-for="(val, index) in item?.schemasList" :key="index">
                    <li class="p-2" :style="{ border: '1px solid #eee', width: '100%' }">
                      <Checkbox
                        :value="val.key"
                        style="width: 100%"
                        :id="val.key"
                        :tabindex="val.key"
                        :disabled="!currentItemOptions"
                      >
                        <!-- :disabled="!currentItemOptions || val.hiddenView" -->
                        {{ val.label }}
                      </Checkbox>
                    </li>
                  </template>
                </ul>
              </CheckboxGroup>
            </ScrollContainer>
          </Col>
        </Row>
      </div>
    </Modal>

    <a @click="addRules">
      <Icon icon="ant-design:file-add-outlined" />
      添加显隐逻辑
    </a>
  </div>
</template>
<script lang="ts" setup name="HiddProps">
  import { ref, reactive, onMounted, watch, onBeforeMount } from 'vue';
  import { CheckboxGroup, Checkbox, Col, Row, Modal, RadioGroup, Radio } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { ScrollContainer } from '@/components/Container';
  import { uniq, cloneDeep } from 'lodash-es';

  const { formConfig } = useFormDesignState();
  const open = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const schemasComponent = ref([]); //控制的题目
  const currentItemOptions = ref(''); //显隐选项
  const ItemOptions = reactive({
    optionsList: [],
    schemasList: []
  })
  const modal = reactive({
    Text: '',
    schemasList: [],
  });
  const handleOk = () => {
    /* modal.Text = 'The modal will be closed after two seconds';
    confirmLoading.value = true; */
   /*  setTimeout(() => {
      open.value = false; */
    // }, 2000);
    formConfig?.value?.schemas.forEach((val, i) => {
      if(val.key === formConfig?.value?.currentItem?.key){
        val.flag = ItemOptions;//-------------------待补充数据
      }
      ItemOptions.optionsList.forEach((el: any)=>{
        if (el&&el.hiddenList&& el.hiddenList.length) {
          el?.hiddenList?.forEach(res=>{
            if(val.key === res){
              console.log('res', res, val, el)
              formConfig.value.schemas[i].hidden = true;
              if(val.hiddenView){
                val.hiddenView = [...val.hiddenView, {[formConfig?.value?.currentItem?.key + '__' + el.value]: {
                  hidden: true,
                  key: formConfig?.value?.currentItem?.key,
                  [formConfig.value.currentItem.key]: el.value,
                  value: el.value,
                }}]
              }else{
                val.hiddenView = [{[formConfig?.value?.currentItem?.key + '__' + el.value]: {
                  hidden: true,
                  key: formConfig?.value?.currentItem?.key,
                  [formConfig.value.currentItem.key]: el.value,
                  value: el.value,
                }}]
              }
            }
          })
        }
      })
    })
    formConfig?.value?.schemas.forEach((val, i) => {
      val.hiddenView = cloneDeep(uniq(val?.hiddenView))
    })
    // formConfig.value.currentItem.flag = ItemOptions;
    confirmLoading.value = false;
    open.value = false;
    console.log('handleOk', ItemOptions, currentItemOptions)
  };
  const addRules = () => {
    var index = 0;
    let arr = [];
    formConfig?.value?.schemas.forEach((val, i) => {
      if (formConfig?.value?.currentItem?.key === val.key) {
        index = i + 1;
      }
      if (formConfig?.value?.currentItem?.key != val.key && i >= index && index) {
        arr.push(val);
      }
      currentItemOptions.value = formConfig?.value?.currentItem?.flag?.value;
      schemasComponent.value = formConfig?.value?.currentItem?.flag?.keyList;
    });
    modal.schemasList = arr;
    open.value = true;
  };
  const cancel = () => {
    schemasComponent.value = [];
    currentItemOptions.value = '';
    // console.log('cancel', ItemOptions, currentItemOptions)
    open.value = false;
  };
  const changeCurrentItemOptions = (val) =>{
    // console.log('changeCurrentItemOptions', val, ItemOptions, currentItemOptions)
  }
  const changeSchemasComponent = (val) =>{
    // console.log('changeSchemasComponent', val, ItemOptions, currentItemOptions)
  }
  const fun = (schemasComponentVal, currentItemOptionsVal) => {
    if (schemasComponentVal && schemasComponentVal.length && currentItemOptionsVal) {
      formConfig?.value?.schemas?.forEach((res, i) => {
        schemasComponentVal.forEach((val) => {
          if (res.key === val) {
            console.log('formConfig.value.schemas[i]', formConfig.value.schemas[i]);
            formConfig.value.schemas[i].hidden = true;
            console.log('formConfig.value.schemas[i].hiddenView', formConfig.value.schemas[i].hiddenView);
// ---------------------需要去重

            if(formConfig.value.schemas[i]&&formConfig.value.schemas[i].hiddenView){
               formConfig.value.schemas[i]?.hiddenView?.push({
                [formConfig?.value?.currentItem?.key + '__' + currentItemOptionsVal]: {
                  hidden: true,
                  key: formConfig?.value?.currentItem?.key,
                  [formConfig?.value?.currentItem?.key]: currentItemOptionsVal,
                  value: currentItemOptionsVal,
                },
              })
            }else{
              formConfig.value.schemas[i].hiddenView = [{
                [formConfig?.value?.currentItem?.key + '__' + currentItemOptionsVal]: {
                  hidden: true,
                  key: formConfig?.value?.currentItem?.key,
                  [formConfig?.value?.currentItem?.key]: currentItemOptionsVal,
                  value: currentItemOptionsVal,
                },
              }]
            }
            formConfig.value.schemas[i].hiddenView = cloneDeep(uniq(formConfig.value.schemas[i]?.hiddenView))
            console.log('formConfig.value.schemas[i].hiddenView', formConfig.value.schemas[i].hiddenView)
// ---------------------

            // arr.push({ key: formConfig?.value?.currentItem?.key });
          }
        });
        if (formConfig?.value?.currentItem?.key === res.key) {
          formConfig.value.schemas[i].flag = {
            value: currentItemOptionsVal,
            keyList: schemasComponentVal,
          };
        }
      });
    }
  };
  watch(
    () => formConfig.value,
    (newVal, oldVal) => {
      
      // console.log('newVal, oldVal',newVal, oldVal)
    },
    { deep: true, immediate: true },
  );
  watch(
    () => currentItemOptions.value,
    (newVal) => {
      currentItemOptions.value = currentItemOptions.value?currentItemOptions.value:(formConfig.value?.currentItem?.componentProps?.options[0].value)

      // console.log('schemasComponent.value, newVal', schemasComponent.value, newVal);

      // fun(schemasComponent.value, newVal);
      /* newVal?.value?.forEach((val) => {
        formConfig?.value?.schemas?.forEach((res, i) => {
          if (res.key === val) {
            // formConfig.value.schemas[i].itemProps.hidden = true;
            formConfig.value.schemas[i].hidden = true;
            formConfig.value.schemas[i].hiddenView = {
              hidden: true,
              key: res.key,
              // [res.key]: 
            };
          }
        });
      }); */
      // formConfig.value;
    },
    { deep: true, immediate: true },
  );
  watch(
    () => schemasComponent.value,
    (newVal) => {
      currentItemOptions.value = currentItemOptions.value?currentItemOptions.value:(formConfig.value?.currentItem?.componentProps?.options[0].value)
      // console.log('newVal, currentItemOptions.value', newVal, currentItemOptions.value);
      // fun(newVal, currentItemOptions.value);
  
      /* newVal?.value?.forEach((val) => {
        formConfig?.value?.schemas?.forEach((res, i) => {
          if (res.key === val) {
            // formConfig.value.schemas[i].itemProps.hidden = true;
            formConfig.value.schemas[i].hidden = true;
            formConfig.value.schemas[i].hiddenView = {
              hidden: true,
              key: formConfig?.value?.currentItem?.key,
              [formConfig?.value?.currentItem?.key]: currentItemOptions.value,
              value: currentItemOptions.value,
            };
            // arr.push({ key: formConfig?.value?.currentItem?.key });
          }
        });
      }); */
      // formConfig?.value?.currentItem?.hiddenList = arr;
      // formConfig.value;
    },
    { deep: true, immediate: true },
  );
  
  onBeforeMount(() => {
    ItemOptions.schemasList = formConfig.value?.schemas.filter(val=>val.key!== formConfig.value?.currentItem?.key)
    ItemOptions.optionsList = formConfig.value?.currentItem?.componentProps?.options.map(val=>{
      return{
        ...val,
        schemasList: ItemOptions.schemasList,
        hiddenList: []
      }
    })
    console.log('ItemOptions', ItemOptions, formConfig.value?.currentItem?.componentProps?.options[0].value)
    currentItemOptions.value = formConfig.value?.currentItem?.componentProps?.options[0].value
  });
  onMounted(() => {});
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
