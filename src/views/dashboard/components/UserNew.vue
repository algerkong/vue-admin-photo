<template>
  <div class="user-page">
    <div class="title">最新注册用户</div>
    <div class="user-main">
      <el-scrollbar class="user" style="height:100%">
        <div class="user-list">
          <div class="user-item" v-for="item in newUserList" :key="item.id">
            <div class="user-item-nam-avatar">
              <el-image class="user-item-avatar" :src="$store.state.app.baseUrl + item.avatar"></el-image>
              <div class="user-item-name">{{item.nickName}}</div>
            </div>
            <div class="user-item-count">{{rTime(item.createdAt)}}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getUserListCount, getHomeCount, getNewUser } from "@/api/home";

export default {
  data() {
    return {
      newUserList: [],
    };
  },
  created() {
    getNewUser().then((res) => {
      this.newUserList = res.data.list;
    });
  },
  methods: {
    rTime(date) {
      let json_date = new Date(date).toJSON();
      return new Date(new Date(json_date))
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
  },
};
</script>

<style lang="scss" scoped>
$paddingWidth: 25px;
.user-page {
  // width: 400px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 3px 0 0 #ededf6;
  border-radius: 10px;
  margin-bottom: 30px;
  .title {
    font-size: 18px;
    color: #333;
    font-weight: 600;
    padding: $paddingWidth;
    border-bottom: 2px #f8f8fb solid;
    letter-spacing: 2px;
  }

  .el-scrollbar__wrap {
    margin-bottom: -30px !important;
    margin-right: -30px !important;
  }
  .user-main {
    height: 480px;
  }
  .user-list {
    font-size: 18px;
    .user-item {
      padding: $paddingWidth $paddingWidth 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      &:last-child {
        padding-bottom: $paddingWidth;
      }
      .user-item-nam-avatar {
        display: flex;
        align-items: center;

        .user-item-name {
          margin-left: $paddingWidth;
          color: #65676d;
          letter-spacing: 2px;
        }
        .user-item-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .user-item-count {
        color: #333;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
