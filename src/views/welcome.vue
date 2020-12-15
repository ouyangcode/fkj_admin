<template>
  <div>
    <el-card class="box-card">
      <ul class="topbox">
        <li>
          今日预约总数
          <p>{{yyNum}}</p>
        </li>
        <li>
          今日接待人数
          <p>{{jdNum}}</p>
        </li>
        <li>
          剩余预约人数
          <p>{{syNum}}</p>
        </li>
      </ul>
      <div class="title">历史访问记录图</div>
      <div id="container"></div>
    </el-card>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';

export default {
  data() {
    return {
      yyNum: '',
      jdNum: '',
      syNum: ''
    }
  },
  created() {
    this.getNum()
    this.getList()
  },
  methods: {
    getyyNum() {
      return this.$http.get('/userInfo/selectVisitorCountByToday');
    },
    getjdNum() {
      return this.$http.get('/userInfo/selectVisitedByToday');
    },
    getsyNum() {
      return this.$http.get('/userInfo/selectNotVisitedByToday');
    },
    async getNum() {
      var me = this; 
      this.$http.all([me.getyyNum(), me.getjdNum(), me.getsyNum()])
      .then(me.$http.spread(function(res1, res2, res3){
        me.yyNum = res1.data.data
        me.jdNum = res2.data.data
        me.syNum = res3.data.data
      }))
    },
    async getList() {
      const { data: res } = await this.$http.get('/userInfo/selectUserNumberByMonth')
      console.log(res)
      this.getDrawing(res.data)
    },
    getDrawing(data) {
      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 580,
        padding: [50, 40, 53, 50]
      });
      chart.data(data);
      chart.scale({
        number: {
          alias: '访问人数',
        },
      });
 
      chart.line().position('yearAndMonth*number');
      chart.area().position('yearAndMonth*number');
      chart.render();
    }
  }
}
</script>

<style lang="scss" scoped>
.topbox{
  display: flex;
  list-style: none;
  justify-content: space-around;
  li{
    padding:20px 80px 10px 80px;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 6px;
    p{
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      margin: 10px;
      color: rgb(21, 141, 240);
    }
  }
}
.title{
  text-align: center;
  font-size: 26px;
  padding-left: 20px;
  padding-top: 20px;
}
</style>
