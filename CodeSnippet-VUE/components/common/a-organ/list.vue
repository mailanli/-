<template>
  <div>
    <div 
      v-for="(item, index) in listData"
      :class="[{ 'item_selected': item.check }, 'list_cont']"  
      :key="index"
      @click="toggleSelect(index)"
    >
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    selectData () {
      let data = this.listData.filter(item  => {
        return item.check
      })
      data.map(item => {
        item.check = false
      })
      return data
    }
  },
  data () {
    return {
      listData: this.data
    }
  },
  methods: {
    toggleSelect (index) {
      this.listData[index].check = !this.listData[index].check
    }
  }
}
</script>

<style lang="less">
.list_cont {
  font-size: 12px;
  padding: 6px 16px;
  margin: 3px 0;
  min-height: 25px;
  line-height: 25px;
  cursor: pointer;
}
.item_selected {
  color: #2db7f5;
  background-color: #e7f4fd;
  border-radius: 5px;
}
</style>


