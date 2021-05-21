<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.str"
        placeholder="用户名或昵称"
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
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出表格</el-button>-->
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
      <el-table-column align="center" prop="username" label="账号"></el-table-column>
      <el-table-column align="center" prop="password" label="密码"></el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称"></el-table-column>
      <el-table-column align="center" prop="gender" label="性别">
        <template slot-scope="{row}">
          <div>{{row.gender | genderFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="avatar" label="头像" lazy>
        <template slot-scope="{row}">
          <el-image
            style="width: 70px; height: 70px"
            :src="baseUrl+row.avatar"
            fit="cover"
            :preview-src-list="[baseUrl+row.avatar]"
          ></el-image>
        </template>
      </el-table-column>
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
        <el-form-item v-if="title!=='添加用户'" label="ID">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="temp.nickName" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" placeholder="选择性别">
            <el-option
              v-for="item in genderOptions"
              :kkey="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="type">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:7001/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="temp.avatar" :src="baseUrl+temp.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div v-if="temp.avatar">点击图片修改头像</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="title==='添加用户'?createData():updateData()">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, updateUser, addUser, deleteUser } from "@/api/userset";
import Pagination from "@/components/Pagination";
export default {
  name: "user",
  components: { Pagination },
  data() {
    return {
      baseUrl: "http://127.0.0.1:7001",
      title: "修改",
      dialogFormVisible: false,
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
      genderOptions: [
        { value: 1, label: "男" },
        { value: 0, label: "女" },
      ],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, message: "长度在 3 个字符以上", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度在 6 个字符以上", trigger: "blur" },
        ],
        nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
    };
  },

  filters: {
    genderFilter(type) {
      if (type == 0) {
        return "女";
      }
      return "男";
    },
  },
  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.listLoading = true;
      await getUserList(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        console.log(res.data);
      });
      this.listLoading = false;
    },
    handleUpdate(index) {
      // this.resetTemp();
      this.title = "修改用户信息";
      this.temp = this.list[index];
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleFilter() {
      this.query.page = 1;
      this.fetchData();
    },

    handleCreate() {
      this.title = "添加用户";
      this.temp = { avatar: "" };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm(`你确定要删除用户${row.nickName}吗`, "删除用户?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteUser(row.id).then((res) => {
          this.showMsg(res.code, "删除成功");
          this.fetchData();
        });
      });
    },
    createData() {
      addUser(this.temp).then((res) => {
        this.showMsg(res.code, "添加成功");
        this.dialogFormVisible = false;
        this.fetchData();
      });
    },
    updateData() {
      let body = {
        username: this.temp.username,
        password: this.temp.password,
        nickName: this.temp.nickName,
        gender: this.temp.gender,
        avatar: this.temp.avatar,
      };
      updateUser(this.temp.id, body).then((res) => {
        this.showMsg(res.code, "修改成功");
        this.dialogFormVisible = false;
        this.fetchData();
      });
    },

    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.temp.avatar = res.data.file;

      console.log(this.temp, "aaaaa");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
