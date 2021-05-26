<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.str"
        placeholder="标签标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <!--     <div class="dynamic-list" v-loading="listLoading">
      <div
        class="dynamic-item"
        v-for="(dynamic,index) in list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        :key="'dynamic_'+index"
      >
        <div class="dynamic-item-top">
          <el-image class="dynamic-item-avatar" :src="baseUrl + dynamic.user.avatar" fil="cover" />
          <div>
            <div class="dynamic-item-name">{{dynamic.user.nickName}}</div>
            <div class="dynamic-item-time">{{rTime(dynamic.createdAt)}}</div>
          </div>
        </div>
        <div class="dynamic-item-text">
          <div class="dynamic-item-title">{{dynamic.title}}</div>
          <div class="dynamic-item-content">{{dynamic.content}}</div>
        </div>
      </div>
    </div>
    -->
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%"
      fit
    >
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column align="center" prop="title" label="标题"></el-table-column>
      <el-table-column align="center" prop="content" label="内容" width="600"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="{row}">
          <div>{{row.status | genderFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="tag.name" label="标签"></el-table-column>
      <el-table-column align="center" prop="user.nickName" label="用户"></el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate($index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>10"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.count"
      @pagination="fetchData"
    />

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="70px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="title!=='添加动态'" label="ID">
              <el-input v-model="temp.id" :disabled="true" />
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" :rows="5" v-model="temp.content" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left:20px;">
            <el-form-item label="状态">
              <el-select v-model="temp.status" placeholder="选择状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="temp.tagId" placeholder="选择标签">
                <el-option
                  v-for="item in tagOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户">
              <el-select v-model="temp.userId" placeholder="选择用户">
                <el-option
                  class="user-option"
                  v-for="item in userOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="user-option-item">
                    <el-image class="user-img" :src="baseUrl + item.avatar" />
                    <div>{{item.label}}</div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="title==='添加动态'?createData():updateData()">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDynamic,
  updateDynamic,
  addDynamic,
  deleteDynamic,
} from "@/api/dynamic";
import { getTagList } from "@/api/tag";
import { getUserList } from "@/api/userset";
import Pagination from "@/components/Pagination";
export default {
  name: "user",
  components: { Pagination },
  data() {
    return {
      baseUrl: this.$store.state.app.baseUrl,
      title: "修改",
      listLoading: true,
      list: [],
      total: 0,
      dialogFormVisible: false,
      //标签选项
      tagOptions: [],
      //用户选项
      userOptions: [],
      statusOptions: [
        { value: 0, label: "默认" },
        { value: 1, label: "今日推荐" },
        { value: 2, label: "编辑推荐" },
      ],
      query: {
        page: 1,
        count: 20,
        str: undefined,
      },
      search: "",
      temp: {},
      //提示
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  filters: {
    genderFilter(type) {
      switch (type) {
        case 0:
          return "默认";
        case 1:
          return "今日推荐";
        case 2:
          return "编辑推荐";
      }
    },
  },
  created() {
    this.fetchData();
    this.getTag();
    this.getUser();
  },

  methods: {
    async fetchData() {
      this.listLoading = true;
      await getDynamic(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
      });
      this.listLoading = false;
      this.temp = {};
    },

    rTime(date) {
      let json_date = new Date(date).toJSON();
      return new Date(new Date(json_date))
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },

    //获取标签
    async getTag() {
      await getTagList().then((res) => {
        let list = res.data.list;

        for (let item in list) {
          this.tagOptions.push({
            value: list[item].id,
            label: list[item].name,
          });
        }
      });
    },

    //获取用户
    async getUser() {
      await getUserList().then((res) => {
        res.data.list.forEach((element) => {
          this.userOptions.push({
            value: element.id,
            label: element.nickName,
            avatar: element.avatar,
          });
        });
        console.log(this.userOptions);
      });
    },

    handleUpdate(index) {
      // this.resetTemp();
      this.dialogFormVisible = true;
      this.title = "修改用户动态";
      this.temp = this.list[index];
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleFilter() {
      this.query.page = 1;
      this.fetchData();
      console.log(
        this.list.filter(
          (data) =>
            !this.search ||
            data.name.toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },

    handleCreate() {
      this.title = "添加动态";
      // this.temp.status = 0;
      // this.temp.type = 0;
      // this.temp.user_id = "1";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm(`你确定要删除标签${row.title}吗`, "删除标签?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDynamic(row.id).then((res) => {
          this.showMsg(res.code, "删除成功");
          this.fetchData();
        });
      });
    },
    //添加
    createData() {
      addDynamic(this.temp).then((res) => {
        this.showMsg(res.code, "添加成功");
        this.dialogFormVisible = false;
        this.fetchData();
      });
    },
    //修改
    updateData() {
      let body = {
        title: this.temp.title,
        status: this.temp.status,
        content: this.temp.content,
        tagId: this.temp.tagId,
        userId: this.temp.userId,
      };

      console.log(body, "Aaa啊啊啊啊啊啊啊啊", this.temp);
      updateDynamic(this.temp.id, body).then((res) => {
        this.showMsg(res.code, "修改成功");
        this.dialogFormVisible = false;
        this.fetchData();
      });
    },

    showMsg(code, msg) {
      if (code == 200) {
        this.$message({
          message: msg,
          type: "success",
        });
      } else {
        this.$message({
          message: "出错了！！！！！！！！！！",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* .dynamic-list {
  display: flex;
  flex-wrap: wrap;
  background-color: #f0f0f0;
  justify-content: space-between;
  padding: 20px;
  .dynamic-item {
    padding: 15px;
    min-width: 250px;
    max-width: 400px;
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    box-shadow: 5px 5px 5px #c0c9d64d;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: #fdfdfd;
      box-shadow: 5px 5px 10px #c0c9d678;
    }
    .dynamic-item-top {
      display: flex;
      align-items: center;
      .dynamic-item-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        image {
          vertical-align: bottom;
        }
      }
      .dynamic-item-time {
        font-size: 14px;
        margin-top: 5px;
      }
    }
    .dynamic-item-text {
      margin-top: 10px;
      .dynamic-item-title {
        font-size: 18px;
      }
      .dynamic-item-content {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
 */
.user-option {
  height: 60px;
  padding: 10px;
  .user-option-item {
    display: flex;
    align-items: center;
  }
  .user-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
