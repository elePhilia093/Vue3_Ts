<template>
  <div class="dashboard">
    <!-- 顶部数据卡片 -->
    <div class="card-row">
      <div class="data-card" v-for="item in statCards" :key="item.title">
        <div class="card-title">{{ item.title }}</div>
        <div class="card-value">{{ item.value }}</div>
        <div class="card-trend" :class="item.trend > 0 ? 'up' : 'down'">
          {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-row">
      <div class="chart-box">
        <h3>用户增长趋势</h3>
        <v-chart :option="lineOption" autoresize />
      </div>
      <div class="chart-box">
        <h3>各渠道访问量</h3>
        <v-chart :option="barOption" autoresize />
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-box half">
        <h3>订单状态分布</h3>
        <v-chart :option="pieOption" autoresize />
      </div>
      <div class="chart-box half">
        <h3>近7天销售额</h3>
        <v-chart :option="areaOption" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

// 按需注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// ========== 数据卡片 ==========
interface StatCard {
  title: string
  value: string
  trend: number
}

const statCards = ref<StatCard[]>([
  { title: '总用户数', value: '12,846', trend: 12.5 },
  { title: '今日订单', value: '1,024', trend: 8.3 },
  { title: '今日销售额', value: '¥86,420', trend: -2.1 },
  { title: '转化率', value: '3.6%', trend: 5.7 }
])

// ========== 折线图：用户增长趋势 ==========
const lineOption = reactive({
  tooltip: { trigger: 'axis' },
  legend: { data: ['新增用户', '活跃用户'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '新增用户',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 1234, 1290, 1330, 1520],
      itemStyle: { color: '#409EFF' }
    },
    {
      name: '活跃用户',
      type: 'line',
      smooth: true,
      data: [620, 732, 801, 934, 1090, 1130, 1220],
      itemStyle: { color: '#67C23A' }
    }
  ]
})

// ========== 柱状图：各渠道访问量 ==========
const barOption = reactive({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['搜索引擎', '直接访问', '社交媒体', '邮件推广', '广告投放']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [4200, 3100, 2800, 1500, 2200],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#79bbff' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
})

// ========== 饼图：订单状态分布 ==========
const pieOption = reactive({
  tooltip: { trigger: 'item' },
  legend: { bottom: '0%' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      data: [
        { value: 1048, name: '已完成', itemStyle: { color: '#67C23A' } },
        { value: 735, name: '处理中', itemStyle: { color: '#E6A23C' } },
        { value: 580, name: '待支付', itemStyle: { color: '#409EFF' } },
        { value: 300, name: '已取消', itemStyle: { color: '#F56C6C' } }
      ]
    }
  ]
})

// ========== 面积图：近7天销售额 ==========
const areaOption = reactive({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103, 194, 58, 0.4)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ]
        }
      },
      data: [12000, 15000, 13500, 18000, 16500, 22000, 19800],
      itemStyle: { color: '#67C23A' }
    }
  ]
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* 数据卡片行 */
.card-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.data-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.card-trend {
  font-size: 13px;
}

.card-trend.up {
  color: #67C23A;
}

.card-trend.down {
  color: #F56C6C;
}

/* 图表行 */
.chart-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-box {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-box h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.chart-box.half {
  flex: 1;
}

/* vue-echarts 组件需要设置高度 */
.chart-box :deep(.echarts) {
  height: 300px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .card-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    flex-direction: column;
  }
}
</style>