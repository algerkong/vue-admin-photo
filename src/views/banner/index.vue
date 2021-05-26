<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border style="width: 100%" fit>
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column align="center" prop="id" label="ID" width="300"></el-table-column>
      <el-table-column align="center" width="800px" prop="src" label="图片">
        <template slot-scope="{row}">
          <el-image :src="baseUrl+row.src" fit="cover" :preview-src-list="[baseUrl+row.src]"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createdAt" label="时间">
        <template slot-scope="{row}">
          <div>{{rTime(row.createdAt)}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>1"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.count"
      @pagination="fetchData"
    />

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px">
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/api/upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="temp.src" :src="baseUrl+temp.src" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>点击选择图片</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBannerList, addBanner, deleteBanner } from "@/api/banner";
import Pagination from "@/components/Pagination";
export default {
  name: "user",
  //分页组件
  components: { Pagination },
  data() {
    return {
      baseUrl: this.$store.state.app.baseUrl,
      title: "修改",
      //是否显示弹出界面
      dialogFormVisible: false,
      //是否显示加载
      listLoading: true,
      //加载到的数据
      list: [],
      //数据总数
      total: 0,
      //查询参数
      query: {
        page: 1,
        count: 10,
        str: undefined,
      },
      //一条数据  修改 添加时用
      temp: {},
    };
  },
  //首次加载数据
  created() {
    this.fetchData();
  },

  methods: {
    rTime(date) {
      let json_date = new Date(date).toJSON();
      return new Date(new Date(json_date))
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    //加载数据
    async fetchData() {
      this.listLoading = true;
      await getBannerList(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        console.log(res.data);
      });
      this.listLoading = false;
    },
    //添加
    handleCreate() {
      this.title = "添加轮播图";
      this.temp = { src: "" };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //删除
    handleDelete(row) {
      this.$confirm(`你确定要删除图片吗`, "删除图片?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBanner(row.id).then((res) => {
          this.showMsg(res.code, "删除成功");
          this.fetchData();
        });
      });
    },
    //添加
    createData() {
      addBanner(this.temp).then((res) => {
        this.showMsg(res.code, "添加成功");
        this.dialogFormVisible = false;
        this.fetchData();
      });
    },

    //图片设置
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.temp.src = res.data.file;

      console.log(this.temp, "aaaaa");
    },
    //上传图片
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
    //显示弹窗
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

<style scoped>
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

.el-upload--text {
  margin: 0 auto;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #858585;
  width: 800px;
  min-height: 178px;
  line-height: 178px;
  text-align: center;
  background-color: #f1f1f1;
}
.avatar {
  width: 600px;
  display: block;
}
</style>
