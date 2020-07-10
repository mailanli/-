<template>
    <div>
      <template v-for="(item,index) in menus">
        <el-menu-item v-if="!item.subMenus||item.subMenus.length==0" :index="item.url" :key="item.id+''">
          <template slot="title">{{ item.name }}</template>
        </el-menu-item>
        <el-submenu v-else :index="item.id+''" :key="item.id+''">
          <template slot="title">
            <span slot="title">{{ item.name }}</span>
          </template>
          <Menu :menus="item.subMenus"></Menu>
        </el-submenu>
      </template>
    </div>
</template>

<script>
    export default {
      name:'Menu',
        props: {
          menus: {
            type:Array,
            default: function() {
              return [];
            }
          },
        },
        mounted(){

        },
        methods:{

        }
    };
</script>

<style lang="less">

</style>
