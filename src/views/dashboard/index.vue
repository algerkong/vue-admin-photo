<template>
  <div class="dashboard-container">
    <el-row :gutter="10" class="card-page">
      <el-col :lg="6" :xs="24" v-for="item in cardCountList" :key="item.name">
        <div class="card">
          <div
            class="card-icon"
            :style="'color:'+getCardIcon(item.name).color+'; background-color:'+getCardIcon(item.name).color+'1f;'"
          >
            <i :class="getCardIcon(item.name).icon"></i>
          </div>
          <div class="card-text">
            <div class="card-content">{{item.count}}</div>
            <div class="card-describe">{{item.name}}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="card-page">
      <el-col :lg="6" :xs="24">
        <user-dynamic />
      </el-col>
      <el-col :lg="6" :xs="24">
        <user-new />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserListCount, getHomeCount, getNewUser } from "@/api/home";
import UserDynamic from "./components/UserDynamic";
import UserNew from "./components/UserNew";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    UserDynamic,
    UserNew,
  },
  data() {
    return {
      cardCountList: [],
      newUserList: [],
    };
  },
  created() {
    getHomeCount().then((res) => {
      this.cardCountList = res.data;
    });
  },
  methods: {
    getCardIcon(name) {
      switch (name) {
        case "用户":
          return {
            color: "#6f52ed",
            icon: "el-icon-user",
          };
        case "动态":
          return {
            color: "#21B8C7",
            icon: "el-icon-postcard",
          };
        case "评论":
          return {
            color: "#4CB8FF",
            icon: "el-icon-chat-line-square",
          };
        case "点赞":
          return {
            color: "#FF4C61",
            icon: "el-icon-chicken",
          };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$paddingWidth: 25px;

.dashboard {
  &-container {
    padding: 30px;
    box-sizing: border-box;
    background-color: #f8f8fb;
    min-height: calc(100vh - 70px);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.card-page {
  // display: flex;
  // flex-wrap: wrap;
}

.card {
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 3px 0 0 #ededf6;
  border-radius: 10px;
  // min-width: 400px;
  height: 160px;
  display: flex;
  align-items: center;
  padding: 30px;
  margin-bottom: 30px;

  .card-icon {
    width: 70px;
    height: 70px;
    font-size: 28px;
    background: #7054ed0d;
    color: #7054ed;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-text {
    margin-left: 30px;
    letter-spacing: 2px;
    .card-content {
      font-size: 28px;
      font-weight: 600;
    }

    .card-describe {
      font-size: 16px;
      color: #bcc1ce;
      margin-top: 10px;
    }
  }
}
</style>
