<template>
  <div class="dynamic-page">
    <div class="title">最新动态</div>
    <div class="dynamic-main">
      <el-scrollbar class="user" style="height:100%">
        <div class="dynamic-list" v-infinite-scroll="loadUserDynamic">
          <el-row :gutter="20" class="card-page">
            <el-col :lg="12" :xs="24" v-for="(dynamic,index) in list" :key="'dynamic_'+index">
              <div class="dynamic-item" @click="showAll(index)">
                <div class="dynamic-item-top">
                  <el-image
                    class="dynamic-item-avatar"
                    :src="baseUrl + dynamic.user.avatar"
                    fil="cover"
                  />
                  <div>
                    <div class="dynamic-item-name">{{dynamic.user.nickName}}</div>
                    <div class="dynamic-item-time">{{ rTime(dynamic.createdAt)}}</div>
                  </div>
                </div>
                <div class="dynamic-item-text">
                  <div class="dynamic-item-title">{{dynamic.title}}</div>
                  <div class="dynamic-item-content">{{dynamic.content}}</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-divider v-if="loading">
            <p>加载中...</p>
          </el-divider>
          <el-divider v-if="noMore()">
            <p>没有更多了</p>
          </el-divider>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" :title="dynamicAll.title" width="70%" top="10vh">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="dynamic-all">
            <el-carousel trigger="click" :autoplay="false" arrow="hover" height="70vh">
              <el-carousel-item v-for="item in dynamicAll.imgs" :key="item.id">
                <div class="dynamic-img-item">
                  <el-image class="dynamic-img" :src="baseUrl +item.src" fit="scale-down"></el-image>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dynamic-status">
            <el-select v-model="dynamicAll.status" @change="setDynamicStatus" placeholder="选择状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="dynamic-item">
            <div class="dynamic-item-top">
              <el-image
                class="dynamic-item-avatar"
                :src="baseUrl + dynamicAll.user.avatar"
                fil="cover"
              />
              <div>
                <div class="dynamic-item-name">{{dynamicAll.user.nickName}}</div>
                <div class="dynamic-item-time">{{ rTime(dynamicAll.createdAt)}}</div>
              </div>
            </div>
            <div class="dynamic-item-text">
              <div class="dynamic-item-title">{{dynamicAll.title}}</div>
              <div class="dynamic-item-content">{{dynamicAll.content}}</div>
            </div>

            <div class="dynamic-item-bottom">
              <div class="count">
                <i class="el-icon-chat-dot-square"></i>
                {{dynamicAll.comments.length}}
              </div>

              <div class="count">
                <i class="el-icon-chicken"></i>
                {{dynamicAll.praises.length}}
              </div>
            </div>
          </div>
          <div class="comment-page">
            <el-scrollbar class="user" style="height:100%">
              <div class="comment-list">
                <div class="comment-item" v-for="item in dynamicAll.comments" :key="item.id">
                  <div class="comment-item-top">
                    <el-image :src="baseUrl + item.user.avatar" class="comment-user-avatar"></el-image>
                    <div>
                      <div class="comment-user-name">{{item.user.nickName}}</div>
                      <div class="comment-user-time">{{rTime(item.createdAt)}}</div>
                    </div>
                  </div>
                  <div class="commnet-item-content">{{item.content}}</div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDynamic, updateDynamic } from "@/api/dynamic";
export default {
  data() {
    return {
      baseUrl: this.$store.state.app.baseUrl,
      query: {
        page: 1,
        count: 8,
      },
      list: [],
      total: 0,
      listLoading: true,
      loading: false,
      dialogFormVisible: false,
      dynamicAll: {},
      statusOptions: [
        { value: 0, label: "默认" },
        { value: 1, label: "今日推荐" },
        { value: 2, label: "编辑推荐" },
      ],
    };
  },
  created() {
    this.getUserDynamicList();
  },
  methods: {
    noMore() {
      let is = this.list.length >= this.total;
      if (is) this.loading = false;
      return is;
    },
    async getUserDynamicList() {
      await getDynamic(this.query).then((res) => {
        this.list = this.list.concat(res.data.list);
        this.total = res.data.total;
        this.dynamicAll = this.list[1];
      });
      console.log("加载中...", this.list);
      this.loading = false;
    },
    rTime(date) {
      let json_date = new Date(date).toJSON();
      return new Date(new Date(json_date))
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },

    setDynamicStatus() {
      console.log(this.dynamicAll.status, "this.dynamicAll.status");
      updateDynamic(this.dynamicAll.id, {
        status: this.dynamicAll.status,
      }).then((res) => {
        this.showMsg(res.code, "修改成功");
      });
    },
    loadUserDynamic() {
      this.loading = true;
      setTimeout(() => {
        this.query.page += 1;
        console.log(this.query.page);
        this.getUserDynamicList();
      }, 2000);
    },

    showAll(index) {
      this.dynamicAll = this.list[index];
      console.log(this.dynamicAll);
      this.dialogFormVisible = true;
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
$paddingWidth: 25px;

.dynamic-page {
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 3px 0 0 #ededf6;
  border-radius: 10px;
  margin-bottom: $paddingWidth;
}

.dynamic-main {
  height: 480px;
}

.title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  padding: $paddingWidth;
  border-bottom: 2px #f8f8fb solid;
  letter-spacing: 2px;
}
.el-dialog {
}

.dynamic-status {
  margin-bottom: 20px;
}
.dynamic-all {
  background-color: #f8f8fb !important;
  .dynamic-img-item {
    height: 100%;
    .dynamic-img {
      width: 100%;
      height: inherit;
    }
  }
}

.dynamic-list {
  padding: $paddingWidth;
  box-sizing: border-box;
}

.dynamic-item {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 5px #c0c9d678;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #fdfdfd;
    box-shadow: 0 0px 0 3px #ededf6;
  }
  .dynamic-item-top {
    display: flex;
    align-items: center;
    .dynamic-item-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      image {
        vertical-align: bottom;
      }
    }
    .dynamic-item-name {
      font-size: 16px;
    }
    .dynamic-item-time {
      font-size: 13px;
      margin-top: 4px;
      color: #65676d;
    }
  }
  .dynamic-item-text {
    margin-top: 10px;
    .dynamic-item-title {
      font-size: 18px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .dynamic-item-content {
      margin-top: 10px;
      font-size: 14px;
      overflow: hidden;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }

  .dynamic-item-bottom {
    margin-top: 10px;
    border-top: #f8f8fb solid 2px;
    display: flex;
    padding-top: 10px;
    font-size: 18px;
    .count {
      margin-right: 20px;
      i {
        color: #1496e0;
        font-weight: 600;
      }
    }
  }
}
.comment-page {
  height: 50vh;
  .comment-item {
    padding: 10px;
    .comment-item-top {
      display: flex;
      align-items: center;
      .comment-user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .comment-user-name {
        font-size: 16px;
        color: #333;
      }
      .comment-user-time {
        font-size: 12px;
        margin-top: 4px;
        color: #65676d;
      }
    }
    .commnet-item-content {
      margin-top: px;
    }
  }
}
</style>
