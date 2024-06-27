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

    <a @click="showModal">
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
    formConfig?.value?.schemas.forEach((val, i) => {
      if(val.key === formConfig?.value?.currentItem?.key){
        val.flag = ItemOptions;//-------------------待补充数据
      }
      ItemOptions.optionsList.forEach((el: any)=>{
        if (el&&el.hiddenList&& el.hiddenList.length) {
          el?.hiddenList?.forEach(res=>{
            if(val.key === res){
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
    confirmLoading.value = false;
    open.value = false;
    /* ItemOptions.optionsList = [];
    ItemOptions.schemasList = []; */
    
  };
  const showModal = () => {
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
    if(formConfig.value?.currentItem&& formConfig.value?.currentItem.flag&&formConfig.value?.currentItem.flag.schemasList&&formConfig.value?.currentItem.flag.schemasList.length){
      ItemOptions.schemasList = formConfig.value?.currentItem.flag.schemasList
    }else{
      ItemOptions.schemasList = arr
    }
    if(formConfig.value?.currentItem&& formConfig.value?.currentItem.flag&&formConfig.value?.currentItem.flag.optionsList&&formConfig.value?.currentItem.flag.optionsList.length){
      if(formConfig.value?.currentItem?.componentProps?.options.length === formConfig.value?.currentItem.flag.optionsList.length&&formConfig.value?.currentItem.flag.schemasList.length === arr.length){
        ItemOptions.optionsList = formConfig.value?.currentItem.flag.optionsList
        ItemOptions.schemasList = formConfig.value?.currentItem.flag.schemasList
      }else{
        formConfig.value?.currentItem?.flag.optionsList.forEach(v=>{
          ItemOptions.optionsList = formConfig.value?.currentItem?.componentProps?.options.map(val=>{
            if(v.label === val.label && v.val === val.val){
              return{
                ...val,
                schemasList: arr,
                hiddenList: v.hiddenList
              }
            }else{
              return{
                ...val,
                schemasList: arr,
                hiddenList: []
              }
            }
          })
        })
      }

    }else{
      ItemOptions.optionsList = formConfig.value?.currentItem?.componentProps?.options.map(val=>{
        return{
          ...val,
          schemasList: arr,
          hiddenList: []
        }
      })
    }
    currentItemOptions.value = formConfig.value?.currentItem?.componentProps?.options[0].value
    open.value = true;
  };
  const cancel = () => {
    open.value = false;
    schemasComponent.value = [];
    currentItemOptions.value = '';
/*     ItemOptions.optionsList = [];
    ItemOptions.schemasList = []; */
  };
  const changeCurrentItemOptions = (val) =>{
  }
  const changeSchemasComponent = (val) =>{
  }
  watch(
    () => formConfig.value,
    (newVal, oldVal) => {
      // console.log('formConfig.value-----newVal, oldVal',newVal, oldVal)
      /* ItemOptions.schemasList = formConfig.value?.schemas.filter(val=>val.key!== formConfig.value?.currentItem?.key)
      ItemOptions.optionsList = formConfig.value?.currentItem?.componentProps?.options.map(val=>{
        return{
          ...val,
          schemasList: ItemOptions.schemasList,
          hiddenList: []
        }
      })
      currentItemOptions.value = formConfig.value?.currentItem?.componentProps?.options[0].value */
    },
    { deep: true, immediate: true },
  );
  watch(
    () => currentItemOptions.value,
    (newVal) => {
      currentItemOptions.value = currentItemOptions.value?currentItemOptions.value:(formConfig.value?.currentItem?.componentProps?.options[0].value)


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
    if(formConfig.value?.currentItem&& formConfig.value?.currentItem.flag&&formConfig.value?.currentItem.flag.schemasList&&formConfig.value?.currentItem.flag.schemasList.length){
      ItemOptions.schemasList = formConfig.value?.currentItem.flag.schemasList
    }else{
      ItemOptions.schemasList = formConfig.value?.schemas.filter((val, i)=>val.key!== formConfig.value?.currentItem?.key)
    }
    if(formConfig.value?.currentItem&& formConfig.value?.currentItem.flag&&formConfig.value?.currentItem.flag.optionsList&&formConfig.value?.currentItem.flag.optionsList.length){
      ItemOptions.optionsList = formConfig.value?.currentItem.flag.optionsList
    }else{
      ItemOptions.optionsList = formConfig.value?.currentItem?.componentProps?.options.map(val=>{
        return{
          ...val,
          schemasList: ItemOptions.schemasList,
          hiddenList: []
        }
      })
    }
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
