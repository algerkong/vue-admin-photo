<template>
  <div class="dashboard-container">
    <el-row class="dashboard-text">
      <el-col :span="24" class="title">毒鸡汤</el-col>
      <el-col :span="24" class="text">{{rWord}}</el-col>
    </el-row>
    <el-row :gutter="30" class="card-page">
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

    <el-row :gutter="30" class="card-page">
      <el-col :lg="12" :xs="24">
        <user-dynamiclist />
      </el-col>
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
import UserDynamiclist from "./components/UserDynamiclist";
import UserNew from "./components/UserNew";
import axios from "axios";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    UserDynamic,
    UserNew,
    UserDynamiclist,
  },
  data() {
    return {
      cardCountList: [],
      newUserList: [],
      rWord: "",
    };
  },
  created() {
    getHomeCount().then((res) => {
      this.cardCountList = res.data;
    });
    this.getText();
  },
  methods: {
    getText() {
      let url = "https://api.btstu.cn/yan/api.php?charset=utf-8&encode=json";
      axios.get(url).then((res) => {
        this.rWord = res.data.text;
      });
      setInterval(() => {
        axios.get(url).then((res) => {
          this.rWord = res.data.text;
        });
      }, 10000);
    },
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
    padding: 40px 25px 0;
    box-sizing: border-box;
    background-color: #f8f8fb;
    min-height: calc(100vh - 70px);
  }
  &-text {
    margin-bottom: 40px;
    .title {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 18px;
      color: #979797;
    }
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
