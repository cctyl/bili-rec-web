---
name: api-request
description: |
  当需要进行 HTTP API 请求开发时自动使用此 Skill。

  触发场景：
  - 新增 API 接口定义
  - 在组件中调用 API
  - 处理 API 响应数据
  - API 错误处理

  触发词：API、请求、接口、axios、ajax、api调用、后端接口、数据请求
---

# API 请求开发规范

本项目使用 Vue 2 + Axios 进行 HTTP 请求，所有 API 定义在 `src/api/index.js`。

## 项目 API 架构

### 核心文件结构

```
src/
├── api/
│   ├── index.js      # 所有 API 方法定义
│   └── ajax.js       # Axios 封装（统一错误处理）
└── plugins/
    └── utils.js      # 工具函数（含 $message 消息提示）
```

### 响应数据格式

所有 API 接口返回统一的数据格式：

```javascript
{
  code: 200,           // 状态码，200 表示成功
  message: "success",  // 响应消息
  data: {}            // 实际数据
}
```

## 一、API 方法定义规范

所有 API 方法定义在 `src/api/index.js`，使用 `ajax()` 函数封装。

### ajax 函数签名

```javascript
ajax(url, data, type)
```

- `url`: 接口路径（相对路径，自动拼接 BASE_URL）
- `data`: 请求体数据（POST/PUT/DELETE 使用）
- `type`: 请求方法，默认 "GET"

### GET 请求（无参数）

```javascript
// src/api/index.js
/**
 * 获取配置列表
 * @returns {Promise<unknown>}
 */
getConfigList() {
  return ajax(`/config/standard`);
}
```

### GET 请求（路径参数）

```javascript
// src/api/index.js
/**
 * 获取Cookie列表
 * @param {number} page 页码
 * @param {number} limit 每页数量
 * @returns {Promise<unknown>}
 */
getCookieList(page, limit) {
  return ajax(`/cookie-header-data/list/${page}/${limit}`);
}
```

### GET 请求（查询参数）

```javascript
// src/api/index.js
/**
 * 获取字典列表
 * @param {string} accessType 访问类型
 * @param {string} dictType 字典类型
 * @param {string} status 状态
 * @returns {Promise<unknown>}
 */
getDictList(accessType, dictType, status) {
  return ajax(`/dict/list?dict_type=${dictType}&access_type=${accessType}&status=${status}`);
}
```

### POST 请求（创建数据）

```javascript
// src/api/index.js
/**
 * 添加关键词
 * @param {Object} keywordItem 关键词对象
 * @returns {Promise<unknown>}
 */
addDict(keywordItem) {
  return ajax(`/dict`, keywordItem, 'POST');
}
```

### PUT 请求（更新数据）

```javascript
// src/api/index.js
/**
 * 修改Cookie数据
 * @param {Object} cookieData Cookie数据
 * @returns {Promise<unknown>}
 */
updateCookie(cookieData) {
  return ajax('/cookie-header-data', cookieData, 'PUT');
}
```

### DELETE 请求（删除数据）

```javascript
// src/api/index.js
/**
 * 删除Cookie数据
 * @param {number} id Cookie ID
 * @returns {Promise<unknown>}
 */
deleteCookie(id) {
  return ajax(`/cookie-header-data/${id}`, null, 'DELETE');
}
```

## 二、组件中调用 API 规范

### 标准 API 调用流程

```vue
<script>
import api from "@/api";

export default {
  name: "example-component",
  data() {
    return {
      dataList: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * 获取数据列表
     */
    async fetchData() {
      try {
        const response = await api.getConfigList();
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        // 处理成功响应
        this.dataList = response.data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  }
};
</script>
```

### 带参数的 API 调用

```javascript
// 场景1：路径参数
async fetchData(page, limit) {
  try {
    const response = await api.getCookieList(page, limit);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    this.cookieList = response.data.list;
  } catch (error) {
    console.error('Failed to fetch cookies:', error);
  }
}

// 场景2：查询参数
async fetchData(accessType, dictType, status) {
  try {
    const response = await api.getDictList(accessType, dictType, status);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    this.dictList = response.data.list;
  } catch (error) {
    console.error('Failed to fetch dict list:', error);
  }
}

// 场景3：POST 请求提交数据
async addKeyword(keywordItem) {
  try {
    const response = await api.addDict(keywordItem);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    // 服务器返回的新创建数据的 ID
    keywordItem.id = response.data;
    this.$message('添加成功', 'success');
  } catch (error) {
    console.error('Failed to add keyword:', error);
  }
}

// 场景4：DELETE 请求
async deleteItem(id) {
  try {
    const response = await api.delDictById(id);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    this.$message('删除成功', 'success');
    // 刷新列表
    this.fetchData();
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
}
```

### 复杂业务逻辑示例

```javascript
/**
 * 批量删除并重新添加字典
 * @param {Array} dictArr 字典数组
 */
async batchUpdate(dictArr) {
  try {
    const response = await api.batchRemoveAndUpdate('WHITE', 'TID', dictArr);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    this.$message('批量更新成功', 'success');
    // 刷新相关数据
    this.fetchData('WHITE,TID,NORMAL');
  } catch (error) {
    console.error('Failed to batch update:', error);
  }
}

/**
 * 从 URL 提取 MID 并添加到字典
 */
async urlAddMid() {
  const url = this.$refs.someComponent.getNewKeyWord();
  const mid = this.$getMid(url);

  if (!mid) {
    alert("请输入正确的url,如:https://space.bilibili.com/123456");
    return;
  }

  this.$refs.someComponent.setNewKeyWord(mid);

  try {
    // 先获取用户名
    const response = await api.getUserNameByMid(mid);
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }

    // 设置描述并添加
    this.$refs.someComponent.setNewDesc(response.data);
    this.$refs.someComponent.addKeyword();
  } catch (error) {
    console.error('Failed to fetch user name:', error);
  }
}
```

## 三、错误处理规范

### 统一的错误处理模式

```javascript
// ✅ 正确：标准的错误处理
async someMethod() {
  try {
    const response = await api.someMethod();
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      return;
    }
    // 处理成功逻辑
    this.data = response.data;
  } catch (error) {
    console.error('Failed to someMethod:', error);
  }
}

// ❌ 错误1：不检查 response.code
async badMethod1() {
  const response = await api.someMethod();
  this.data = response.data; // 可能在请求失败时报错
}

// ❌ 错误2：没有 try-catch
async badMethod2() {
  const response = await api.someMethod(); // 可能抛出未捕获的异常
  this.data = response.data;
}

// ❌ 错误3：错误时不 return
async badMethod3() {
  try {
    const response = await api.someMethod();
    if (response.code !== 200) {
      this.$message(response.message, 'error');
      // 缺少 return，会继续执行下面的代码
    }
    this.data = response.data; // 会处理错误数据
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### 错误提示组件使用

```javascript
// 显示错误消息
this.$message('操作失败', 'error');

// 显示成功消息
this.$message('操作成功', 'success');

// 显示警告消息
this.$message('请注意', 'warning');

// 显示自定义消息
this.$message(response.message, 'error');
```

## 四、新增 API 接口步骤

### 步骤 1：在 src/api/index.js 添加方法

```javascript
// src/api/index.js

export default {
  // ... 其他方法

  /**
   * 获取XXX列表
   * @param {number} page 页码
   * @param {number} size 每页数量
   * @returns {Promise<unknown>}
   */
  getXxxList(page, size) {
    return ajax(`/xxx/list/${page}/${size}`);
  },

  /**
   * 添加XXX
   * @param {Object} xxxItem XXX对象
   * @returns {Promise<unknown>}
   */
  addXxx(xxxItem) {
    return ajax(`/xxx`, xxxItem, 'POST');
  },

  /**
   * 更新XXX
   * @param {Object} xxxItem XXX对象
   * @returns {Promise<unknown>}
   */
  updateXxx(xxxItem) {
    return ajax(`/xxx`, xxxItem, 'PUT');
  },

  /**
   * 删除XXX
   * @param {number} id XXX ID
   * @returns {Promise<unknown>}
   */
  deleteXxx(id) {
    return ajax(`/xxx/${id}`, null, 'DELETE');
  }
};
```

### 步骤 2：在组件中导入并使用

```vue
<script>
import api from "@/api";

export default {
  data() {
    return {
      xxxList: [],
      form: {
        name: '',
        value: ''
      }
    };
  },
  methods: {
    async fetchXxxList() {
      try {
        const response = await api.getXxxList(1, 10);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.xxxList = response.data.list;
      } catch (error) {
        console.error('Failed to fetch xxx list:', error);
      }
    },

    async addXxx() {
      try {
        const response = await api.addXxx(this.form);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.$message('添加成功', 'success');
        this.fetchXxxList();
      } catch (error) {
        console.error('Failed to add xxx:', error);
      }
    }
  }
};
</script>
```

## 五、API 方法命名规范

### 获取数据（GET）
- `get{Entity}List()` - 获取列表
- `get{Entity}()` - 获取单个对象
- `get{Entity}By{Param}()` - 根据参数获取

示例：
- `getConfigList()`
- `getUserNameByMid(mid)`
- `getRegionList()`

### 创建数据（POST）
- `add{Entity}()` - 添加实体
- `create{Entity}()` - 创建实体

示例：
- `addDict(keywordItem)`
- `addCookie(cookieData)`

### 更新数据（PUT）
- `update{Entity}()` - 更新实体
- `addOrUpdate{Entity}()` - 添加或更新

示例：
- `updateCookie(cookieData)`
- `addOrUpdateConfig(configData)`

### 删除数据（DELETE）
- `delete{Entity}()` / `del{Entity}()` - 删除实体
- `delete{Entity}ById()` - 根据ID删除

示例：
- `deleteCookie(id)`
- `delDictById(id)`
- `delWhiteRuleById(id)`

## 六、常见问题和注意事项

### 1. URL 路径规范

```javascript
// ✅ 正确：使用相对路径
ajax(`/config/standard`)

// ❌ 错误：不要硬编码完整 URL
ajax(`http://localhost:8080/config/standard`)

// ❌ 错误：不要在 api 方法中拼接 BASE_URL
ajax(`${BASE_URL}/config/standard`)
```

### 2. 参数传递

```javascript
// ✅ 正确：POST/PUT 使用 data 参数
ajax('/api/user', userData, 'POST')

// ✅ 正确：GET 使用路径参数
ajax(`/api/user/${userId}`)

// ✅ 正确：GET 使用查询参数
ajax(`/api/list?page=${page}&size=${size}`)

// ❌ 错误：GET 请求不应该有 data 参数
ajax('/api/user', userData, 'GET')
```

### 3. 异步处理

```javascript
// ✅ 正确：使用 async/await
async fetchData() {
  const response = await api.getData();
  // 处理数据
}

// ✅ 正确：使用 Promise
fetchData() {
  api.getData().then(response => {
    // 处理数据
  });
}

// ❌ 错误：不处理异步
fetchData() {
  const response = api.getData(); // response 是 Promise，不是数据
  this.data = response.data; // 错误！
}
```

### 4. 响应数据解构

```javascript
// ✅ 正确：先检查 code
if (response.code !== 200) {
  this.$message(response.message, 'error');
  return;
}
const data = response.data;

// ❌ 错误：直接解构可能为空的数据
const { list } = response.data; // response.data 可能为 undefined
```

## 七、完整示例：用户管理模块

### API 定义（src/api/index.js）

```javascript
export default {
  /**
   * 获取用户列表
   * @param {number} page 页码
   * @param {number} size 每页数量
   * @returns {Promise<unknown>}
   */
  getUserList(page, size) {
    return ajax(`/user/list/${page}/${size}`);
  },

  /**
   * 获取用户详情
   * @param {number} id 用户ID
   * @returns {Promise<unknown>}
   */
  getUserById(id) {
    return ajax(`/user/${id}`);
  },

  /**
   * 添加用户
   * @param {Object} userItem 用户对象
   * @returns {Promise<unknown>}
   */
  addUser(userItem) {
    return ajax(`/user`, userItem, 'POST');
  },

  /**
   * 更新用户
   * @param {Object} userItem 用户对象
   * @returns {Promise<unknown>}
   */
  updateUser(userItem) {
    return ajax(`/user`, userItem, 'PUT');
  },

  /**
   * 删除用户
   * @param {number} id 用户ID
   * @returns {Promise<unknown>}
   */
  deleteUser(id) {
    return ajax(`/user/${id}`, null, 'DELETE');
  }
};
```

### 组件使用

```vue
<template>
  <div>
    <!-- 用户列表 -->
    <div v-for="user in userList" :key="user.id">
      {{ user.name }}
      <button @click="editUser(user)">编辑</button>
      <button @click="deleteUser(user.id)">删除</button>
    </div>

    <!-- 添加按钮 -->
    <button @click="showAddModal = true">添加用户</button>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "user-management",
  data() {
    return {
      userList: [],
      showAddModal: false,
      currentPage: 1,
      pageSize: 10,
      currentUser: {
        id: null,
        name: '',
        email: ''
      }
    };
  },
  mounted() {
    this.fetchUserList();
  },
  methods: {
    /**
     * 获取用户列表
     */
    async fetchUserList() {
      try {
        const response = await api.getUserList(this.currentPage, this.pageSize);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.userList = response.data.list;
      } catch (error) {
        console.error('Failed to fetch user list:', error);
      }
    },

    /**
     * 添加用户
     */
    async addUser() {
      try {
        const response = await api.addUser(this.currentUser);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.$message('添加成功', 'success');
        this.showAddModal = false;
        this.fetchUserList();
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    },

    /**
     * 编辑用户
     */
    editUser(user) {
      this.currentUser = { ...user };
      this.showAddModal = true;
    },

    /**
     * 更新用户
     */
    async updateUser() {
      try {
        const response = await api.updateUser(this.currentUser);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.$message('更新成功', 'success');
        this.showAddModal = false;
        this.fetchUserList();
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },

    /**
     * 删除用户
     */
    async deleteUser(id) {
      if (!confirm('确定要删除这个用户吗？')) {
        return;
      }

      try {
        const response = await api.deleteUser(id);
        if (response.code !== 200) {
          this.$message(response.message, 'error');
          return;
        }
        this.$message('删除成功', 'success');
        this.fetchUserList();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  }
};
</script>
```

## 八、最佳实践总结

### ✅ 推荐做法

1. **所有 API 定义统一在 `src/api/index.js`**
2. **使用 async/await 处理异步**
3. **始终检查 response.code**
4. **使用 try-catch 捕获异常**
5. **错误时使用 this.$message() 提示用户**
6. **API 方法命名遵循 RESTful 风格**
7. **添加 JSDoc 注释说明参数和返回值**

### ❌ 避免做法

1. **在组件中直接使用 axios**
2. **硬编码 URL 路径**
3. **不处理 API 错误**
4. **不检查 response.code**
5. **GET 请求使用 data 参数**
6. **在组件中重复定义相同 API**

---

**记住**：所有 API 相关开发，都应遵循本 Skill 规范！
