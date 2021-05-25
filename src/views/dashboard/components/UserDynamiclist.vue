<template>
  <div class="dynamic-page">
    <div class="title">最新动态</div>
    <div class="dynamic-main">
      <el-scrollbar class="user" style="height:100%">
        <div class="dynamic-list" v-infinite-scroll="loadUserDynamic">
          <el-row :gutter="20" class="card-page">
            <el-col :lg="12" :xs="24" v-for="(dynamic,index) in list" :key="'dynamic_'+index">
              <div class="dynamic-item">
                <div class="dynamic-item-top">
                  <el-image
                    class="dynamic-item-avatar"
                    :src="$store.state.app.baseUrl + dynamic.user.avatar"
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
  </div>
</template>

<script>
import { getUserList } from "@/api/userset";
import {
  getDynamic,
  updateDynamic,
  addDynamic,
  deleteDynamic,
} from "@/api/dynamic";
export default {
  data() {
    return {
      query: {
        page: 1,
        count: 8,
      },
      list: [],
      total: 0,
      listLoading: true,
      loading: false,
    };
  },
  created() {
    this.getUserDynamicList();
  },
  methods: {
    noMore() {
      return this.list.length >= this.total;
    },
    async getUserDynamicList() {
      await getDynamic(this.query).then((res) => {
        this.list = this.list.concat(res.data.list);
        this.total = res.data.total;
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
    loadUserDynamic() {
      this.loading = true;
      setTimeout(() => {
        this.query.page += 1;
        console.log(this.query.page);
        this.getUserDynamicList();
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
$paddingWidth: 25px;

.dynamic-page {
  min-width: 400px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 3px 0 0 #ededf6;
  border-radius: 10px;
  margin-bottom: 30px;
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

.dynamic-list {
  justify-content: space-between;
  padding: 20px;
  .dynamic-item {
    padding: 15px;
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
  }
}
</style>
