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

    <div class="dynamic-list">
      <div class="item"></div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%"
      fit
    >
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column align="center" prop="id" label="ID" width="300"></el-table-column>
      <el-table-column align="center" prop="title" label="标题"></el-table-column>
      <el-table-column align="center" prop="content" label="内容"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="{row}">
          <div>{{row.status | genderFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型"></el-table-column>
      <el-table-column align="center" prop="tag.name" label="标签"></el-table-column>
      <el-table-column align="center" prop="user.nickName" label="用户"></el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate($index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>20"
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
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="title!=='添加动态'" label="ID">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="temp.content" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="temp.status" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="temp.tag_id" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="temp.user_id" />
        </el-form-item>
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
import Pagination from "@/components/Pagination";
export default {
  name: "user",
  components: { Pagination },
  data() {
    return {
      baseUrl: "http://127.0.0.1:7001",
      title: "修改",
      listLoading: true,
      list: [],
      total: 0,
      dialogFormVisible: false,
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
  },

  methods: {
    async fetchData() {
      this.listLoading = true;
      await getDynamic(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        console.log(res.data);
      });
      this.listLoading = false;
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
      this.temp = {};
      this.title = "添加动态";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm(`你确定要删除标签${row.name}吗`, "删除标签?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTag(row.id).then((res) => {
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
        username: this.temp.username,
        password: this.temp.password,
        nickName: this.temp.nickName,
        gender: this.temp.gender,
        avatar: this.temp.avatar,
      };
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

<style>
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
</style>
