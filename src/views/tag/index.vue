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

    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%"
      fit
    >
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column align="center" prop="id" label="ID" width="300"></el-table-column>
      <el-table-column align="center" prop="name" label="标题"></el-table-column>
      <el-table-column align="center" prop="dynamics[0].title" label="动态"></el-table-column>

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
  </div>
</template>

<script>
import { getTagList, addTag, deleteTag, updateTag } from "@/api/tag";
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
      query: {
        page: 1,
        count: 20,
        str: undefined,
      },
      search: "",
      temp: {},
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.listLoading = true;
      await getTagList(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        console.log(res.data);
      });
      this.listLoading = false;
    },

    handleUpdate(index) {
      // this.resetTemp();
      this.title = "修改标签标题";
      this.temp = this.list[index];

      this.$prompt("请输入标题", this.title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: this.temp.name,
      }).then(({ value }) => {
        this.updateData(value);
      });
    },

    handleFilter() {
      this.query.page = 1;
      this.fetchData();
    },

    handleCreate() {
      this.title = "添加标签";
      this.$prompt("请输入标题", this.title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        this.createData(value);
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
    createData(value) {
      addTag({ name: value }).then((res) => {
        this.showMsg(res.code, "添加成功");
        this.fetchData();
      });
    },
    updateData(name) {
      let body = {
        name: name,
      };
      updateTag(this.temp.id, body).then((res) => {
        this.showMsg(res.code, "修改成功");
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
