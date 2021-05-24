<template>
  <div class="app-container">
    <div class="top-bar">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="baseUrl+'/api/upload'"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :on-success="fetchData"
        :auto-upload="false"
        limit="9"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <pagination
        class="pagination"
        v-show="total>10"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.count"
        @pagination="fetchData"
      />
    </div>

    <div class="v-waterfall-content" id="v-waterfall">
      <div
        v-for="(img,index) in waterfallList"
        class="v-waterfall-item"
        :key="img.id"
        :style="{top:img.top+'px',left:img.left+'px',width:waterfallImgWidth+'px',height:img.height}"
      >
        <!-- <img :src="img.src" alt /> -->
        <el-image :src="img.src" :preview-src-list="getImgListBig(index)" />
        <div class="btn-delete-img">
          <i class="el-icon-circle-close" color="red" @click="handleDelete(img.row)"></i>
        </div>
        <!-- <el-image :src="img.src" :preview-src-list="waterfallList" lazy></el-image> -->
      </div>
    </div>

    <!-- <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%"
      fit
    >
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column align="center" prop="id" label="ID" width="300"></el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="{row}">
          <img :src="baseUrl+row.src" alt style="width:100px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate($index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
  </div>
</template>

<script>
import { getImgList, deleteImg } from "@/api/img";
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
      query: {
        page: 1,
        count: 20,
      },
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
      ],
      search: "",
      temp: {},
      waterfallList: [],
      waterfallImgWidth: 290,
      waterfallImgCol: 5,
      waterfallImgRight: 10,
      waterfallImgBottom: 10,
      waterfallDeviationHeight: [],
      fileList: [],
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.listLoading = true;
      await getImgList(this.query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        console.log(res.data);

        this.calculationWidth();
      });
      this.listLoading = false;
    },

    handleDelete(row) {
      this.$confirm(`你确定要删除这个图片吗`, "删除图片?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteImg(row.id).then((res) => {
          this.showMsg(res.code, "删除成功");
          this.fetchData();
        });
      });
    },

    async getImgListBig(index) {
      console.log(this.waterfallList);
      let arr = [];
      let i = 0;
      for (i; i < this.waterfallList.length; i++) {
        arr.push(this.waterfallList[i + index].src);
        if (i + index >= this.imgArr.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr;
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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

    calculationWidth() {
      this.waterfallList = [];

      let domWidth = document.getElementById("v-waterfall").offsetWidth;
      if (!this.waterfallImgWidth && this.waterfallImgCol) {
        this.waterfallImgWidth =
          (domWidth - this.waterfallImgRight * this.waterfallImgCol) /
          this.waterfallImgCol;
      } else if (this.waterfallImgWidth && !this.waterfallImgCol) {
        this.waterfallImgCol = Math.floor(
          domWidth / (this.waterfallImgWidth + this.waterfallImgRight)
        );
      }
      //初始化偏移高度数组
      this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
      for (let i = 0; i < this.waterfallDeviationHeight.length; i++) {
        this.waterfallDeviationHeight[i] = 0;
      }
      this.imgPreloading();
    },
    //图片预加载
    imgPreloading() {
      for (let i = 0; i < this.list.length; i++) {
        let aImg = new Image();
        aImg.src = this.baseUrl + this.list[i].src;
        aImg.onload = aImg.onerror = (e) => {
          let imgData = {};
          imgData.height = (this.waterfallImgWidth / aImg.width) * aImg.height;
          imgData.src = this.baseUrl + this.list[i].src;
          imgData.row = this.list[i];
          this.waterfallList.push(imgData);
          this.rankImg(imgData);
        };
      }
      console.log(this.waterfallList);
    },
    //瀑布流布局
    rankImg(imgData) {
      let {
        waterfallImgWidth,
        waterfallImgRight,
        waterfallImgBottom,
        waterfallDeviationHeight,
        waterfallImgCol,
      } = this;
      //for (let i = 0;i < this.waterfallList.length;i++){
      let minIndex = this.filterMin();
      imgData.top = waterfallDeviationHeight[minIndex];
      imgData.left = minIndex * (waterfallImgRight + waterfallImgWidth);
      waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom;
      //}
      console.log(imgData);
    },
    /**
     * 找到最短的列并返回下标
     * @returns {number} 下标
     */
    filterMin() {
      const min = Math.min.apply(null, this.waterfallDeviationHeight);
      return this.waterfallDeviationHeight.indexOf(min);
    },
  },
};
</script>

<style>
.app-container {
  overflow: hidden;
}

.top-bar {
  display: flex;
  padding: 0 100px 20px 0;
  align-items: center;
  justify-content: space-between;
}
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

.v-waterfall-content {
  width: 100%;
  position: relative;
  min-height: 200vh;
}
.v-waterfall-item {
  float: left;
  position: absolute;
}

.v-waterfall-item .el-image {
  display: block;
  overflow: inherit;
}
.v-waterfall-item .el-image > img {
  width: 100%;
  height: 100%;
  box-shadow: 5px 5px 5px #c0c0c085;
  border-radius: 5px;
}

.btn-delete-img {
  display: none;
  position: absolute;
  font-size: 30px;
  top: 10px;
  right: 10px;
  color: white;
  background: #00000071;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 999999;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btn-delete-img:hover {
  color: #ff0101;
}
.v-waterfall-item:hover .btn-delete-img {
  display: flex;
}

.pagination {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
