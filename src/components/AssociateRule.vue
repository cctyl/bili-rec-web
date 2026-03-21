<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
    <table class="w-full whitelist-management__table">
      <thead>
      <tr class="bg-gray-700">
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">规则名称</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标签关键词</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标题关键词</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">封面关键词</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">描述关键词</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
      <tr v-for="item in filteredWhitelist" :key="item.id" class="hover:bg-gray-750">
        <td class="px-6 py-4 whitespace-nowrap">{{ item.info }}</td>
        <td class="px-6 py-4">{{ item.tagNameList.join(', ') }}</td>
        <td class="px-6 py-4">{{ item.titleKeyWordList.join(', ') }}</td>
        <td class="px-6 py-4">{{ item.coverKeyword.join(', ') }}</td>
        <td class="px-6 py-4">{{ item.descKeyWordList.join(', ') }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button @click="editWhitelistItem(item)"
                  class="text-blue-400 hover:text-blue-300 mr-3 !rounded-button whitespace-nowrap">
            <i class="fas fa-edit mr-1"></i>编辑
          </button>
          <button @click="deleteWhitelistItem(item)"
                  class="text-red-400 hover:text-red-300 !rounded-button whitespace-nowrap">
            <i class="fas fa-trash-alt mr-1"></i>删除
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</template>
<script>

import api from "@/api";

export default {
  name: 'AssociateRule',
  props:{

    accessType: {
      type: String,
      required: true
    },
  },
  computed: {
    filteredWhitelist() {
      const query = this.searchQuery.toLowerCase();
      console.log(this.rulelist);
      return this.rulelist.filter(item => {
            try {
              return (item.info && item.info.toLowerCase().includes(query)) ||
                  (item.tagNameList && item.tagNameList.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.titleKeyWordList && item.titleKeyWordList.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.coverKeyword && item.coverKeyword.some(keyword => keyword.toLowerCase().includes(query))) ||
                  (item.descKeyWordList && item.descKeyWordList.some(keyword => keyword.toLowerCase().includes(query)));
            } catch (err) {
              console.log(err);
            }
          }
      );
    }
  },
  data() {
    return {
      searchQuery: '',
      pageNo: 1,
      pageSize: 999,
      currentItem: {
        info: '',
        tagNameList: [],
        titleKeyWordList: [],
        coverKeyword: [],
        descKeyWordList: []
      },

      rulelist: [],

    };
  },

  mounted() {
      this.getAssociateRule()
  },
  methods:{
    async getAssociateRule() {

      try {
        const response = await api.getAssociateRule(this.pageNo, this.pageSize,this.accessType);
        this.rulelist = response.data.list;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },
  }
}
</script>

<style scoped></style>