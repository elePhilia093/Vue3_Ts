<template>
  <div class="visualization-container">

    <!-- =========================================
         顶部区域
         ========================================= -->
    <div class="top-section">

      <div class="top-left">

        <div class="page-badge">
          <span class="badge-dot"></span>
          DATA ANALYSIS
        </div>

        <div class="page-title">
          员工数据可视化
        </div>

        <div class="page-desc">
          员工、考勤、请假及薪资数据统计分析
        </div>

      </div>

      <div class="top-right">

        <div class="current-month">

          <span class="month-label">
            统计月份
          </span>

          <el-date-picker
            v-model="selectedMonth"
            type="month"
            value-format="YYYY-MM"
            placeholder="请选择月份"
            :clearable="false"
            class="month-picker"
            @change="handleMonthChange"
          />

        </div>

        <el-button
          class="refresh-button"
          :loading="loading"
          circle
          @click="loadData"
        >
          <el-icon>
            <Refresh />
          </el-icon>
        </el-button>

      </div>

    </div>


    <!-- =========================================
         顶部概览
         ========================================= -->
    <div
      v-loading="loading"
      class="overview-grid"
    >

      <!-- 员工总数 -->
      <el-card
        shadow="never"
        class="overview-card card-blue"
      >

        <div class="overview-decoration"></div>

        <div class="overview-inner">

          <div class="overview-top">

            <div class="overview-label">
              员工总数
            </div>

            <div class="overview-icon">
              <el-icon>
                <User />
              </el-icon>
            </div>

          </div>

          <div class="overview-main">

            <span class="overview-value">
              {{ overview.employeeTotal }}
            </span>

            <span class="overview-unit">
              人
            </span>

          </div>

          <div class="overview-desc">
            当前员工数据
          </div>

        </div>

      </el-card>


      <!-- 部门数量 -->
      <el-card
        shadow="never"
        class="overview-card card-purple"
      >

        <div class="overview-decoration"></div>

        <div class="overview-inner">

          <div class="overview-top">

            <div class="overview-label">
              部门数量
            </div>

            <div class="overview-icon">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
            </div>

          </div>

          <div class="overview-main">

            <span class="overview-value">
              {{ overview.deptTotal }}
            </span>

            <span class="overview-unit">
              个
            </span>

          </div>

          <div class="overview-desc">
            当前启用部门
          </div>

        </div>

      </el-card>


      <!-- 正常考勤率 -->
      <el-card
        shadow="never"
        class="overview-card card-cyan"
      >

        <div class="overview-decoration"></div>

        <div class="overview-inner">

          <div class="overview-top">

            <div class="overview-label">
              本月正常考勤率
            </div>

            <div class="overview-icon">
              <el-icon>
                <DataAnalysis />
              </el-icon>
            </div>

          </div>

          <div class="overview-main">

            <span class="overview-value">
              {{ formatPercent(overview.attendanceRate) }}
            </span>

          </div>

          <div class="overview-desc">
            正常考勤记录占比
          </div>

        </div>

      </el-card>


      <!-- 实发工资 -->
      <el-card
        shadow="never"
        class="overview-card card-indigo"
      >

        <div class="overview-decoration"></div>

        <div class="overview-inner">

          <div class="overview-top">

            <div class="overview-label">
              本月实发工资
            </div>

            <div class="overview-icon">
              <el-icon>
                <Money />
              </el-icon>
            </div>

          </div>

          <div class="overview-main">

            <span class="overview-value salary-value">
              {{ formatMoney(overview.monthNetSalary) }}
            </span>

            <span class="overview-unit">
              元
            </span>

          </div>

          <div class="overview-desc">
            当前统计月份工资总额
          </div>

        </div>

      </el-card>

    </div>


    <!-- =========================================
         第一行
         ========================================= -->
    <div class="chart-grid">

      <!-- 部门员工人数 -->
      <el-card
        shadow="never"
        class="chart-card"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              各部门员工人数
            </div>

            <div class="chart-subtitle">
              员工部门结构分布
            </div>
          </div>

          <div class="chart-header-mark">
            部门
          </div>

        </div>

        <div
          ref="deptChartRef"
          class="chart chart-medium"
        />

      </el-card>


      <!-- 性别分布 -->
      <el-card
        shadow="never"
        class="chart-card"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              员工性别分布
            </div>

            <div class="chart-subtitle">
              员工基本信息统计
            </div>
          </div>

          <div class="chart-header-mark">
            性别
          </div>

        </div>

        <div
          ref="genderChartRef"
          class="chart chart-medium"
        />

      </el-card>

    </div>


    <!-- =========================================
         第二行
         ========================================= -->
    <div class="chart-grid">

      <!-- 考勤 -->
      <el-card
        shadow="never"
        class="chart-card"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              本月考勤状态
            </div>

            <div class="chart-subtitle">
              {{ selectedMonth }} 考勤记录统计
            </div>
          </div>

          <div class="chart-header-mark">
            考勤
          </div>

        </div>

        <div
          ref="attendanceChartRef"
          class="chart chart-medium"
        />

      </el-card>


      <!-- 请假 -->
      <el-card
        shadow="never"
        class="chart-card"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              本月请假审批情况
            </div>

            <div class="chart-subtitle">
              {{ selectedMonth }} 请假申请统计
            </div>
          </div>

          <div class="chart-header-mark">
            请假
          </div>

        </div>

        <div
          ref="leaveChartRef"
          class="chart chart-medium"
        />

      </el-card>

    </div>


    <!-- =========================================
         第三行
         ========================================= -->
    <div class="chart-grid">

      <!-- 薪资趋势 -->
      <el-card
        shadow="never"
        class="chart-card chart-card-large"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              近6个月薪资趋势
            </div>

            <div class="chart-subtitle">
              应发工资与实发工资变化
            </div>
          </div>

          <div class="chart-header-mark">
            薪资
          </div>

        </div>

        <div
          ref="salaryChartRef"
          class="chart chart-large"
        />

      </el-card>


      <!-- 考勤异常趋势 -->
      <el-card
        shadow="never"
        class="chart-card chart-card-large"
      >

        <div class="chart-header">

          <div>
            <div class="chart-title">
              近6个月考勤异常趋势
            </div>

            <div class="chart-subtitle">
              迟到、早退等异常记录变化
            </div>
          </div>

          <div class="chart-header-mark">
            异常
          </div>

        </div>

        <div
          ref="attendanceTrendChartRef"
          class="chart chart-large"
        />

      </el-card>

    </div>

  </div>
</template>


<script setup lang="ts">

import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from "vue";

import {
  ElMessage
} from "element-plus";

import {
  Refresh,
  User,
  OfficeBuilding,
  DataAnalysis,
  Money
} from "@element-plus/icons-vue";

import * as echarts from "echarts";

import type {
  ECharts,
  EChartsOption
} from "echarts";

import {
  getVisualizationOverview,
  type VisualizationOverviewVO
} from "@/api/visualization";


/* =========================================
 * 页面状态
 * ========================================= */

const loading =
  ref(false);


/* =========================================
 * 当前统计月份
 * ========================================= */

const getCurrentMonth = (): string => {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}`;
};


const selectedMonth =
  ref<string>(
    getCurrentMonth()
  );


/* =========================================
 * 后端数据
 * ========================================= */

const overview =
  reactive<VisualizationOverviewVO>({

    employeeTotal: 0,

    deptTotal: 0,

    attendanceRate: 0,

    monthNetSalary: 0,

    deptStatistics: [],

    genderStatistics: [],

    attendanceStatistics: [],

    leaveStatistics: [],

    salaryTrend: [],

    attendanceTrend: []

  });


/* =========================================
 * ECharts DOM
 * ========================================= */

const deptChartRef =
  ref<HTMLElement | null>(null);

const genderChartRef =
  ref<HTMLElement | null>(null);

const attendanceChartRef =
  ref<HTMLElement | null>(null);

const leaveChartRef =
  ref<HTMLElement | null>(null);

const salaryChartRef =
  ref<HTMLElement | null>(null);

const attendanceTrendChartRef =
  ref<HTMLElement | null>(null);


/* =========================================
 * ECharts 实例
 * ========================================= */

let deptChart:
  ECharts | null = null;

let genderChart:
  ECharts | null = null;

let attendanceChart:
  ECharts | null = null;

let leaveChart:
  ECharts | null = null;

let salaryChart:
  ECharts | null = null;

let attendanceTrendChart:
  ECharts | null = null;


/* =========================================
 * Tooltip 公共样式
 * ========================================= */

const tooltipBase = {

  backgroundColor:
    "rgba(255,255,255,0.90)",

  borderWidth:
    1,

  borderColor:
    "rgba(102,126,234,0.12)",

  padding: [
    11,
    14
  ],

  textStyle: {

    color:
      "#4b5366",

    fontSize:
      12

  },

  extraCssText:
    [
      "border-radius:12px;",
      "box-shadow:0 10px 30px rgba(67,78,121,0.12);",
      "backdrop-filter:blur(14px);",
      "-webkit-backdrop-filter:blur(14px);",
      "overflow:hidden;"
    ].join("")

};


/* =========================================
 * 加载数据
 * ========================================= */

const loadData = async () => {

  loading.value = true;

  try {

    const res =
      await getVisualizationOverview(
        selectedMonth.value
      );

    if (res.code !== 200) {

      ElMessage.error(
        res.message ||
        "获取可视化数据失败"
      );

      return;
    }

    Object.assign(
      overview,
      res.data
    );

    await nextTick();

    renderCharts();

  } catch (error) {

    console.error(
      "获取可视化数据失败:",
      error
    );

    ElMessage.error(
      "获取可视化数据失败"
    );

  } finally {

    loading.value = false;

  }

};


/* =========================================
 * 月份切换
 * ========================================= */

const handleMonthChange = () => {

  loadData();

};


/* =========================================
 * 部门员工人数
 * ========================================= */

const renderDeptChart = () => {

  if (!deptChartRef.value) {
    return;
  }

  if (!deptChart) {

    deptChart =
      echarts.init(
        deptChartRef.value
      );

  }


  const names =
    overview.deptStatistics.map(
      item =>
        item.deptName
    );


  const values =
    overview.deptStatistics.map(
      item =>
        Number(
          item.employeeCount
        )
    );


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "axis",

      axisPointer: {

        type:
          "shadow",

        shadowStyle: {

          color:
            "rgba(102,126,234,0.06)"

        }

      },

      formatter: (
        params: any
      ) => {

        const item =
          params?.[0];

        if (!item) {
          return "";
        }

        return `
          <div style="
            min-width:120px;
          ">

            <div style="
              color:#8f96a7;
              font-size:12px;
              margin-bottom:8px;
            ">
              ${item.name}
            </div>

            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:20px;
            ">

              <div style="
                display:flex;
                align-items:center;
                color:#697185;
                font-size:12px;
              ">

                <span style="
                  width:7px;
                  height:7px;
                  margin-right:7px;
                  border-radius:50%;
                  background:#7187ec;
                  display:inline-block;
                "></span>

                员工人数

              </div>

              <div style="
                color:#35405a;
                font-size:16px;
                font-weight:600;
              ">

                ${item.value}

                <span style="
                  margin-left:3px;
                  color:#9ba2b0;
                  font-size:11px;
                  font-weight:400;
                ">
                  人
                </span>

              </div>

            </div>

          </div>
        `;

      }

    },


    grid: {

      left:
        20,

      right:
        40,

      top:
        20,

      bottom:
        20,

      containLabel:
        true

    },


    xAxis: {

      type:
        "value",

      minInterval:
        1,

      axisLine: {
        show:
          false
      },

      axisTick: {
        show:
          false
      },

      axisLabel: {

        color:
          "#a3a8b5",

        fontSize:
          12

      },

      splitLine: {

        lineStyle: {

          color:
            "#eef1f6",

          type:
            "dashed"

        }

      }

    },


    yAxis: {

      type:
        "category",

      inverse:
        true,

      data:
        names,

      axisLine: {
        show:
          false
      },

      axisTick: {
        show:
          false
      },

      axisLabel: {

        color:
          "#606778",

        fontSize:
          13

      }

    },


    series: [

      {

        type:
          "bar",

        data:
          values,

        barWidth:
          16,

        showBackground:
          true,

        backgroundStyle: {

          color:
            "#f4f6fb",

          borderRadius:
            10

        },

        itemStyle: {

          borderRadius: [
            0,
            10,
            10,
            0
          ],

          color: {

            type:
              "linear",

            x:
              0,

            y:
              0,

            x2:
              1,

            y2:
              0,

            colorStops: [

              {
                offset:
                  0,

                color:
                  "#7187ec"

              },

              {
                offset:
                  1,

                color:
                  "#9c7bd9"

              }

            ]

          }

        },

        label: {

          show:
            true,

          position:
            "right",

          color:
            "#697185",

          fontSize:
            12,

          formatter:
            "{c} 人"

        }

      }

    ],


    animationDuration:
      850,

    animationEasing:
      "cubicOut"

  };


  deptChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 性别分布
 * ========================================= */

const renderGenderChart = () => {

  if (!genderChartRef.value) {
    return;
  }

  if (!genderChart) {

    genderChart =
      echarts.init(
        genderChartRef.value
      );

  }


  const data =
    overview.genderStatistics.map(
      item => ({

        name:
          item.gender === 1
            ? "男"
            : "女",

        value:
          Number(
            item.employeeCount
          )

      })
    );


  const total =
    data.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.value
        ),

      0
    );


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "item",

      formatter: (
        params: any
      ) => {

        return `
          <div style="
            min-width:125px;
          ">

            <div style="
              color:#8f96a7;
              font-size:12px;
              margin-bottom:8px;
            ">
              员工性别
            </div>

            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:22px;
            ">

              <div style="
                display:flex;
                align-items:center;
                color:#697185;
                font-size:12px;
              ">

                ${params.marker}

                ${params.name}

              </div>

              <div style="
                color:#35405a;
                font-size:15px;
                font-weight:600;
              ">

                ${params.value}

                <span style="
                  margin-left:3px;
                  color:#9ba2b0;
                  font-size:11px;
                  font-weight:400;
                ">
                  人
                </span>

              </div>

            </div>

            <div style="
              margin-top:7px;
              color:#a1a7b4;
              font-size:11px;
              text-align:right;
            ">
              占比 ${params.percent}%
            </div>

          </div>
        `;

      }

    },


    legend: {

      bottom:
        8,

      left:
        "center",

      itemWidth:
        9,

      itemHeight:
        9,

      icon:
        "circle",

      textStyle: {

        color:
          "#606778",

        fontSize:
          12

      }

    },


    title: {

      text:
        String(total),

      subtext:
        "员工总数",

      left:
        "center",

      top:
        "33%",

      textStyle: {

        fontSize:
          28,

        fontWeight:
          600,

        color:
          "#34394c"

      },

      subtextStyle: {

        fontSize:
          12,

        color:
          "#a2a8b5",

        lineHeight:
          20

      }

    },


    color: [

      "#7187ec",

      "#a07edb"

    ],


    series: [

      {

        type:
          "pie",

        radius: [
          "51%",
          "71%"
        ],

        center: [
          "50%",
          "43%"
        ],

        avoidLabelOverlap:
          true,

        itemStyle: {

          borderColor:
            "#ffffff",

          borderWidth:
            5,

          borderRadius:
            6

        },

        label: {

          show:
            false

        },

        labelLine: {

          show:
            false

        },

        emphasis: {

          scale:
            true,

          scaleSize:
            7,

          label: {

            show:
              true,

            fontSize:
              14,

            fontWeight:
              600,

            color:
              "#34394c",

            formatter:
              "{b}\n{c}人  {d}%"

          }

        },

        data

      }

    ],


    animationDuration:
      900

  };


  genderChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 考勤状态
 * ========================================= */

const renderAttendanceChart = () => {

  if (!attendanceChartRef.value) {
    return;
  }

  if (!attendanceChart) {

    attendanceChart =
      echarts.init(
        attendanceChartRef.value
      );

  }


  const getStatusName = (
    status: number
  ): string => {

    switch (status) {

      case 0:
        return "正常";

      case 1:
        return "迟到";

      case 2:
        return "早退";

      case 3:
        return "迟到且早退";

      default:
        return "其他";

    }

  };


  const data =
    overview.attendanceStatistics.map(
      item => ({

        name:
          getStatusName(
            item.attendanceStatus
          ),

        value:
          Number(
            item.attendanceCount
          )

      })
    );


  const total =
    data.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.value
        ),

      0
    );


  const normalCount =
    data.find(
      item =>
        item.name === "正常"
    )?.value || 0;


  const normalRate =
    total === 0

      ? "0.0"

      : (
          Number(
            normalCount
          ) /
          total *
          100
        ).toFixed(1);


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "item",

      formatter: (
        params: any
      ) => {

        return `
          <div style="
            min-width:135px;
          ">

            <div style="
              color:#8f96a7;
              font-size:12px;
              margin-bottom:8px;
            ">
              考勤状态
            </div>

            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:22px;
            ">

              <div style="
                display:flex;
                align-items:center;
                color:#697185;
                font-size:12px;
              ">

                ${params.marker}

                ${params.name}

              </div>

              <div style="
                color:#35405a;
                font-size:15px;
                font-weight:600;
              ">

                ${params.value}

                <span style="
                  margin-left:3px;
                  color:#9ba2b0;
                  font-size:11px;
                  font-weight:400;
                ">
                  条
                </span>

              </div>

            </div>

            <div style="
              margin-top:7px;
              color:#a1a7b4;
              font-size:11px;
              text-align:right;
            ">
              占比 ${params.percent}%
            </div>

          </div>
        `;

      }

    },


    legend: {

      bottom:
        8,

      left:
        "center",

      itemWidth:
        9,

      itemHeight:
        9,

      icon:
        "circle",

      textStyle: {

        color:
          "#606778",

        fontSize:
          12

      }

    },


    title: [

      {

        text:
          `${normalRate}%`,

        left:
          "center",

        top:
          "33%",

        textStyle: {

          fontSize:
            28,

          fontWeight:
            600,

          color:
            "#34394c"

        }

      },

      {

        text:
          "正常考勤率",

        left:
          "center",

        top:
          "47%",

        textStyle: {

          fontSize:
            12,

          fontWeight:
            400,

          color:
            "#a2a8b5"

        }

      }

    ],


    color: [

      "#6e86ec",

      "#efb45f",

      "#9b7ddd",

      "#e9919e"

    ],


    series: [

      {

        type:
          "pie",

        radius: [
          "51%",
          "71%"
        ],

        center: [
          "50%",
          "43%"
        ],

        itemStyle: {

          borderColor:
            "#ffffff",

          borderWidth:
            5,

          borderRadius:
            6

        },

        label: {

          show:
            false

        },

        labelLine: {

          show:
            false

        },

        emphasis: {

          scale:
            true,

          scaleSize:
            7,

          label: {

            show:
              true,

            fontSize:
              14,

            fontWeight:
              600,

            color:
              "#34394c",

            formatter:
              "{b}\n{c}条"

          }

        },

        data

      }

    ],


    animationDuration:
      900

  };


  attendanceChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 请假审批
 * ========================================= */

const renderLeaveChart = () => {

  if (!leaveChartRef.value) {
    return;
  }

  if (!leaveChart) {

    leaveChart =
      echarts.init(
        leaveChartRef.value
      );

  }


  const getApprovalName = (
    status: number
  ): string => {

    switch (status) {

      case 0:
        return "待审批";

      case 1:
        return "已通过";

      case 2:
        return "已驳回";

      default:
        return "其他";

    }

  };


  const data =
    overview.leaveStatistics.map(
      item => ({

        name:
          getApprovalName(
            item.approvalStatus
          ),

        value:
          Number(
            item.leaveCount
          )

      })
    );


  const total =
    data.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.value
        ),

      0
    );


  const approved =
    data.find(
      item =>
        item.name === "已通过"
    )?.value || 0;


  const approvalRate =
    total === 0

      ? "0.0"

      : (
          Number(
            approved
          ) /
          total *
          100
        ).toFixed(1);


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "item",

      formatter: (
        params: any
      ) => {

        return `
          <div style="
            min-width:135px;
          ">

            <div style="
              color:#8f96a7;
              font-size:12px;
              margin-bottom:8px;
            ">
              请假审批
            </div>

            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:22px;
            ">

              <div style="
                display:flex;
                align-items:center;
                color:#697185;
                font-size:12px;
              ">

                ${params.marker}

                ${params.name}

              </div>

              <div style="
                color:#35405a;
                font-size:15px;
                font-weight:600;
              ">

                ${params.value}

                <span style="
                  margin-left:3px;
                  color:#9ba2b0;
                  font-size:11px;
                  font-weight:400;
                ">
                  条
                </span>

              </div>

            </div>

            <div style="
              margin-top:7px;
              color:#a1a7b4;
              font-size:11px;
              text-align:right;
            ">
              占比 ${params.percent}%
            </div>

          </div>
        `;

      }

    },


    legend: {

      bottom:
        8,

      left:
        "center",

      itemWidth:
        9,

      itemHeight:
        9,

      icon:
        "circle",

      textStyle: {

        color:
          "#606778",

        fontSize:
          12

      }

    },


    title: [

      {

        text:
          `${approvalRate}%`,

        left:
          "center",

        top:
          "33%",

        textStyle: {

          fontSize:
            28,

          fontWeight:
            600,

          color:
            "#34394c"

        }

      },

      {

        text:
          "审批通过率",

        left:
          "center",

        top:
          "47%",

        textStyle: {

          fontSize:
            12,

          fontWeight:
            400,

          color:
            "#a2a8b5"

        }

      }

    ],


    color: [

      "#7187ec",

      "#6ac6b2",

      "#e9919e",

      "#9b7ddd"

    ],


    series: [

      {

        type:
          "pie",

        radius: [
          "51%",
          "71%"
        ],

        center: [
          "50%",
          "43%"
        ],

        itemStyle: {

          borderColor:
            "#ffffff",

          borderWidth:
            5,

          borderRadius:
            6

        },

        label: {

          show:
            false

        },

        labelLine: {

          show:
            false

        },

        emphasis: {

          scale:
            true,

          scaleSize:
            7,

          label: {

            show:
              true,

            fontSize:
              14,

            fontWeight:
              600,

            color:
              "#34394c",

            formatter:
              "{b}\n{c}条"

          }

        },

        data

      }

    ],


    animationDuration:
      900

  };


  leaveChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 获取连续6个月
 * ========================================= */

const getLastSixMonths = (
  monthText: string
): string[] => {

  const parts =
    monthText.split("-");

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const result:
    string[] = [];

  const baseDate =
    new Date(
      year,
      month - 1,
      1
    );


  for (
    let i = 5;
    i >= 0;
    i--
  ) {

    const current =
      new Date(
        baseDate
      );

    current.setMonth(
      baseDate.getMonth() - i
    );

    const currentYear =
      current.getFullYear();

    const currentMonth =
      String(
        current.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    result.push(
      `${currentYear}-${currentMonth}`
    );

  }

  return result;

};


/* =========================================
 * 薪资趋势
 * ========================================= */

const renderSalaryChart = () => {

  if (!salaryChartRef.value) {
    return;
  }

  if (!salaryChart) {

    salaryChart =
      echarts.init(
        salaryChartRef.value
      );

  }


  const months =
    getLastSixMonths(
      selectedMonth.value
    );


  const grossMap =
    new Map(
      overview.salaryTrend.map(
        item => [
          item.salaryMonth,
          Number(
            item.grossSalary
          )
        ]
      )
    );


  const netMap =
    new Map(
      overview.salaryTrend.map(
        item => [
          item.salaryMonth,
          Number(
            item.netSalary
          )
        ]
      )
    );


  const grossData =
    months.map(
      month =>
        Number(
          (
            (grossMap.get(
              month
            ) || 0) /
            10000
          ).toFixed(2)
        )
    );


  const netData =
    months.map(
      month =>
        Number(
          (
            (netMap.get(
              month
            ) || 0) /
            10000
          ).toFixed(2)
        )
    );


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "axis",

      axisPointer: {

        type:
          "line",

        lineStyle: {

          color:
            "rgba(102,126,234,0.22)",

          width:
            1,

          type:
            "dashed"

        }

      },

      formatter: (
        params: any
      ) => {

        const rows =
          Array.isArray(params)
            ? params
            : [];

        if (!rows.length) {
          return "";
        }


        let html = `

          <div style="
            min-width:165px;
          ">

            <div style="
              color:#8991a3;
              font-size:12px;
              margin-bottom:9px;
              padding-bottom:8px;
              border-bottom:
                1px solid
                rgba(102,126,234,0.08);
            ">
              ${rows[0].axisValue}
            </div>

        `;


        rows.forEach(
          (item: any) => {

            html += `

              <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:22px;
                margin-top:7px;
              ">

                <div style="
                  display:flex;
                  align-items:center;
                  color:#687084;
                  font-size:12px;
                ">

                  ${item.marker}

                  ${item.seriesName}

                </div>

                <div style="
                  color:#39425a;
                  font-size:14px;
                  font-weight:600;
                ">

                  ${item.value}

                  <span style="
                    margin-left:3px;
                    color:#9ba2b0;
                    font-size:10px;
                    font-weight:400;
                  ">
                    万元
                  </span>

                </div>

              </div>

            `;

          }
        );


        html += `

            <div style="
              margin-top:9px;
              color:#a3a9b5;
              font-size:10px;
              text-align:right;
            ">
              薪资数据
            </div>

          </div>

        `;


        return html;

      }

    },


    legend: {

      top:
        0,

      right:
        5,

      icon:
        "roundRect",

      itemWidth:
        18,

      itemHeight:
        7,

      textStyle: {

        color:
          "#606778",

        fontSize:
          12

      }

    },


    grid: {

      left:
        15,

      right:
        15,

      top:
        42,

      bottom:
        20,

      containLabel:
        true

    },


    xAxis: {

      type:
        "category",

      boundaryGap:
        false,

      data:
        months,

      axisLine: {

        lineStyle: {

          color:
            "#e6e9f0"

        }

      },

      axisTick: {

        show:
          false

      },

      axisLabel: {

        color:
          "#9aa0ae",

        fontSize:
          12,

        margin:
          10

      }

    },


    yAxis: {

      type:
        "value",

      name:
        "万元",

      nameTextStyle: {

        color:
          "#a5aab6",

        fontSize:
          11

      },

      axisLine: {

        show:
          false

      },

      axisTick: {

        show:
          false

      },

      axisLabel: {

        color:
          "#9aa0ae",

        fontSize:
          12

      },

      splitLine: {

        lineStyle: {

          color:
            "#edf0f5",

          type:
            "dashed"

        }

      }

    },


    color: [

      "#7187ec",

      "#9b7ddd"

    ],


    series: [

      {

        name:
          "应发工资",

        type:
          "line",

        smooth:
          0.38,

        symbol:
          "circle",

        symbolSize:
          6,

        data:
          grossData,

        lineStyle: {

          width:
            1.8

        },

        itemStyle: {

          borderWidth:
            1.5,

          borderColor:
            "#ffffff"

        },

        areaStyle: {

          opacity:
            0.14,

          color: {

            type:
              "linear",

            x:
              0,

            y:
              0,

            x2:
              0,

            y2:
              1,

            colorStops: [

              {

                offset:
                  0,

                color:
                  "#7187ec"

              },

              {

                offset:
                  1,

                color:
                  "rgba(113,135,236,0)"

              }

            ]

          }

        },

        emphasis: {

          focus:
            "series"

        }

      },


      {

        name:
          "实发工资",

        type:
          "line",

        smooth:
          0.38,

        symbol:
          "circle",

        symbolSize:
          6,

        data:
          netData,

        lineStyle: {

          width:
            1.8

        },

        itemStyle: {

          borderWidth:
            1.5,

          borderColor:
            "#ffffff"

        },

        emphasis: {

          focus:
            "series"

        }

      }

    ],


    animationDuration:
      1000,

    animationEasing:
      "cubicOut"

  };


  salaryChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 考勤异常趋势
 * ========================================= */

const renderAttendanceTrendChart = () => {

  if (
    !attendanceTrendChartRef.value
  ) {

    return;

  }


  if (!attendanceTrendChart) {

    attendanceTrendChart =
      echarts.init(
        attendanceTrendChartRef.value
      );

  }


  const months =
    getLastSixMonths(
      selectedMonth.value
    );


  const abnormalMap =
    new Map(
      overview.attendanceTrend.map(
        item => [
          item.attendanceMonth,
          Number(
            item.abnormalCount
          )
        ]
      )
    );


  const values =
    months.map(
      month =>
        abnormalMap.get(
          month
        ) || 0
    );


  const option:
    EChartsOption = {

    tooltip: {

      ...tooltipBase,

      trigger:
        "axis",

      axisPointer: {

        type:
          "line",

        lineStyle: {

          color:
            "rgba(233,141,154,0.22)",

          width:
            1,

          type:
            "dashed"

        }

      },

      formatter: (
        params: any
      ) => {

        const item =
          Array.isArray(params)
            ? params[0]
            : null;

        if (!item) {
          return "";
        }


        return `

          <div style="
            min-width:145px;
          ">

            <div style="
              color:#8991a3;
              font-size:12px;
              margin-bottom:9px;
              padding-bottom:8px;
              border-bottom:
                1px solid
                rgba(233,141,154,0.12);
            ">
              ${item.axisValue}
            </div>


            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:22px;
            ">

              <div style="
                display:flex;
                align-items:center;
                color:#687084;
                font-size:12px;
              ">

                ${item.marker}

                考勤异常

              </div>


              <div style="
                color:#39425a;
                font-size:14px;
                font-weight:600;
              ">

                ${item.value}

                <span style="
                  margin-left:3px;
                  color:#9ba2b0;
                  font-size:10px;
                  font-weight:400;
                ">
                  条
                </span>

              </div>

            </div>

          </div>

        `;

      }

    },


    grid: {

      left:
        20,

      right:
        30,

      top:
        24,

      bottom:
        38,

      containLabel:
        true

    },


    xAxis: {

      type:
        "category",

      boundaryGap:
        false,

      data:
        months,

      axisLine: {

        lineStyle: {

          color:
            "#e6e9f0"

        }

      },

      axisTick: {

        show:
          false

      },

      axisLabel: {

        color:
          "#9aa0ae",

        fontSize:
          12,

        margin:
          10

      }

    },


    yAxis: {

      type:
        "value",

      name:
        "条",

      minInterval:
        1,

      nameLocation:
        "end",

      nameGap:
        10,

      nameTextStyle: {

        color:
          "#a5aab6",

        fontSize:
          11

      },

      axisLine: {

        show:
          false

      },

      axisTick: {

        show:
          false

      },

      axisLabel: {

        color:
          "#9aa0ae",

        fontSize:
          12

      },

      splitLine: {

        lineStyle: {

          color:
            "#edf0f5",

          type:
            "dashed"

        }

      }

    },


    color: [

      "#e98d9a"

    ],


    series: [

      {

        name:
          "考勤异常",

        type:
          "line",

        smooth:
          0.38,

        symbol:
          "circle",

        symbolSize:
          6,

        data:
          values,

        lineStyle: {

          width:
            1.8

        },

        itemStyle: {

          borderWidth:
            1.5,

          borderColor:
            "#ffffff"

        },

        areaStyle: {

          color: {

            type:
              "linear",

            x:
              0,

            y:
              0,

            x2:
              0,

            y2:
              1,

            colorStops: [

              {

                offset:
                  0,

                color:
                  "rgba(233,141,154,0.20)"

              },

              {

                offset:
                  1,

                color:
                  "rgba(233,141,154,0.01)"

              }

            ]

          }

        },

        emphasis: {

          focus:
            "series",

          itemStyle: {

            borderWidth:
              2

          }

        }

      }

    ],


    animationDuration:
      900,

    animationEasing:
      "cubicOut"

  };


  attendanceTrendChart.setOption(
    option,
    true
  );

};


/* =========================================
 * 统一渲染
 * ========================================= */

const renderCharts = () => {

  renderDeptChart();

  renderGenderChart();

  renderAttendanceChart();

  renderLeaveChart();

  renderSalaryChart();

  renderAttendanceTrendChart();

};


/* =========================================
 * 窗口缩放
 * ========================================= */

const handleResize = () => {

  deptChart?.resize();

  genderChart?.resize();

  attendanceChart?.resize();

  leaveChart?.resize();

  salaryChart?.resize();

  attendanceTrendChart?.resize();

};


/* =========================================
 * 百分比
 * ========================================= */

const formatPercent = (
  value: number
): string => {

  return `${Number(
    value || 0
  ).toFixed(2)}%`;

};


/* =========================================
 * 金额
 * ========================================= */

const formatMoney = (
  value: number
): string => {

  return Number(
    value || 0
  ).toLocaleString(
    "zh-CN",
    {
      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2
    }
  );

};


/* =========================================
 * 初始化
 * ========================================= */

onMounted(() => {

  loadData();

  window.addEventListener(
    "resize",
    handleResize
  );

});


/* =========================================
 * 销毁
 * ========================================= */

onBeforeUnmount(() => {

  window.removeEventListener(
    "resize",
    handleResize
  );


  deptChart?.dispose();

  genderChart?.dispose();

  attendanceChart?.dispose();

  leaveChart?.dispose();

  salaryChart?.dispose();

  attendanceTrendChart?.dispose();


  deptChart = null;

  genderChart = null;

  attendanceChart = null;

  leaveChart = null;

  salaryChart = null;

  attendanceTrendChart = null;

});

</script>


<style lang="scss" scoped>

/* =========================================
 * 页面主体
 * ========================================= */

.visualization-container {

  min-height:
    100%;

  padding:
    20px;

  box-sizing:
    border-box;

  background:
    linear-gradient(
      135deg,
      #f4f6fb 0%,
      #f8f9fc 48%,
      #f4f1fb 100%
    );

}


/* =========================================
 * 顶部区域
 * ========================================= */

.top-section {

  position:
    relative;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  min-height:
    108px;

  margin-bottom:
    16px;

  padding:
    22px 24px;

  box-sizing:
    border-box;

  border:
    1px solid
    rgba(255,255,255,0.85);

  border-radius:
    16px;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.92),
      rgba(250,248,255,0.80)
    );

  box-shadow:
    0 10px 30px
    rgba(73,85,128,0.07);

  backdrop-filter:
    blur(14px);

  -webkit-backdrop-filter:
    blur(14px);

  overflow:
    hidden;

}


.top-section::before {

  content:
    "";

  position:
    absolute;

  width:
    180px;

  height:
    180px;

  top:
    -110px;

  right:
    120px;

  border-radius:
    50%;

  background:
    rgba(110,130,239,0.10);

  filter:
    blur(12px);

  pointer-events:
    none;

}


.top-section::after {

  content:
    "";

  position:
    absolute;

  width:
    150px;

  height:
    150px;

  bottom:
    -105px;

  right:
    -20px;

  border-radius:
    50%;

  background:
    rgba(155,123,221,0.11);

  filter:
    blur(10px);

  pointer-events:
    none;

}


.top-left {

  position:
    relative;

  z-index:
    1;

}


.page-badge {

  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  padding:
    4px 9px;

  border-radius:
    20px;

  background:
    rgba(102,126,234,0.08);

  color:
    #6678cf;

  font-size:
    10px;

  font-weight:
    600;

  letter-spacing:
    0.8px;

}


.badge-dot {

  width:
    6px;

  height:
    6px;

  border-radius:
    50%;

  background:
    #6f86ed;

  box-shadow:
    0 0 0 4px
    rgba(111,134,237,0.10);

}


.page-title {

  margin-top:
    8px;

  color:
    #30344a;

  font-size:
    22px;

  font-weight:
    600;

  letter-spacing:
    0.2px;

}


.page-desc {

  margin-top:
    5px;

  color:
    #9197a8;

  font-size:
    13px;

}


.top-right {

  position:
    relative;

  z-index:
    1;

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.current-month {

  display:
    flex;

  align-items:
    center;

  padding:
    5px 7px 5px 14px;

  border:
    1px solid
    rgba(102,126,234,0.11);

  border-radius:
    11px;

  background:
    rgba(255,255,255,0.78);

  box-shadow:
    0 5px 18px
    rgba(74,86,132,0.06);

  backdrop-filter:
    blur(10px);

  -webkit-backdrop-filter:
    blur(10px);

}


.month-label {

  margin-right:
    7px;

  color:
    #7f8799;

  font-size:
    13px;

}


.month-picker {

  width:
    140px;

}


.month-picker
:deep(.el-input__wrapper) {

  box-shadow:
    none !important;

  background:
    transparent !important;

  padding:
    0 7px;

}


.month-picker
:deep(.el-input__inner) {

  color:
    #4f5871;

  font-size:
    13px;

}


.refresh-button {

  width:
    38px;

  height:
    38px;

  border:
    1px solid
    rgba(102,126,234,0.12);

  background:
    rgba(255,255,255,0.82);

  color:
    #6c7dd5;

  box-shadow:
    0 5px 18px
    rgba(74,86,132,0.06);

  backdrop-filter:
    blur(10px);

  -webkit-backdrop-filter:
    blur(10px);

}


.refresh-button:hover {

  border-color:
    rgba(102,126,234,0.22);

  background:
    rgba(255,255,255,0.96);

  color:
    #6577db;

}


/* =========================================
 * 概览卡片
 * ========================================= */

.overview-grid {

  display:
    grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0,1fr)
    );

  gap:
    16px;

  margin-bottom:
    16px;

}


.overview-card {

  position:
    relative;

  min-height:
    138px;

  overflow:
    hidden;

  border:
    1px solid
    rgba(255,255,255,0.85);

  border-radius:
    14px;

  box-shadow:
    0 8px 25px
    rgba(73,85,128,0.06);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;

  backdrop-filter:
    blur(12px);

  -webkit-backdrop-filter:
    blur(12px);

}


.overview-card:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 14px 30px
    rgba(73,85,128,0.10);

}


.overview-card
:deep(.el-card__body) {

  padding:
    0;

  height:
    100%;

}


.card-blue {

  background:
    linear-gradient(
      135deg,
      rgba(248,250,255,0.96),
      rgba(237,243,255,0.88)
    );

}


.card-purple {

  background:
    linear-gradient(
      135deg,
      rgba(252,249,255,0.96),
      rgba(244,239,255,0.90)
    );

}


.card-cyan {

  background:
    linear-gradient(
      135deg,
      rgba(247,253,253,0.96),
      rgba(236,250,249,0.88)
    );

}


.card-indigo {

  background:
    linear-gradient(
      135deg,
      rgba(250,249,255,0.96),
      rgba(241,239,253,0.90)
    );

}


.overview-decoration {

  position:
    absolute;

  width:
    110px;

  height:
    110px;

  top:
    -50px;

  right:
    -35px;

  border-radius:
    50%;

  opacity:
    0.5;

  filter:
    blur(2px);

}


.card-blue
.overview-decoration {

  background:
    rgba(103,130,237,0.13);

}


.card-purple
.overview-decoration {

  background:
    rgba(150,119,218,0.14);

}


.card-cyan
.overview-decoration {

  background:
    rgba(91,198,191,0.14);

}


.card-indigo
.overview-decoration {

  background:
    rgba(126,112,216,0.13);

}


.overview-inner {

  position:
    relative;

  z-index:
    1;

  height:
    100%;

  padding:
    19px 20px;

  box-sizing:
    border-box;

}


.overview-top {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

}


.overview-label {

  color:
    #8f95a6;

  font-size:
    13px;

}


.overview-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    36px;

  height:
    36px;

  border-radius:
    11px;

  font-size:
    18px;

}


.card-blue
.overview-icon {

  background:
    rgba(102,126,234,0.10);

  color:
    #6983e4;

}


.card-purple
.overview-icon {

  background:
    rgba(153,121,220,0.10);

  color:
    #9272d2;

}


.card-cyan
.overview-icon {

  background:
    rgba(87,194,185,0.11);

  color:
    #50afa7;

}


.card-indigo
.overview-icon {

  background:
    rgba(125,111,216,0.11);

  color:
    #786bc9;

}


.overview-main {

  display:
    flex;

  align-items:
    baseline;

  margin-top:
    13px;

}


.overview-value {

  color:
    #33384a;

  font-size:
    30px;

  font-weight:
    600;

  line-height:
    1.2;

  letter-spacing:
    0.2px;

}


.salary-value {

  font-size:
    24px;

}


.overview-unit {

  margin-left:
    5px;

  color:
    #9ba1b0;

  font-size:
    12px;

}


.overview-desc {

  margin-top:
    7px;

  color:
    #a8adba;

  font-size:
    12px;

}


/* =========================================
 * 图表布局
 * ========================================= */

.chart-grid {

  display:
    grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0,1fr)
    );

  gap:
    16px;

  margin-bottom:
    16px;

}


.chart-card {

  min-width:
    0;

  border:
    1px solid
    rgba(255,255,255,0.85);

  border-radius:
    14px;

  background:
    rgba(255,255,255,0.88);

  box-shadow:
    0 8px 25px
    rgba(73,85,128,0.05);

  backdrop-filter:
    blur(12px);

  -webkit-backdrop-filter:
    blur(12px);

  overflow:
    hidden;

  transition:
    box-shadow 0.22s ease,
    transform 0.22s ease;

}


.chart-card:hover {

  box-shadow:
    0 12px 28px
    rgba(73,85,128,0.08);

}


.chart-card
:deep(.el-card__body) {

  padding:
    18px 20px 12px;

}


.chart-card-large {

  min-height:
    380px;

}


/* =========================================
 * 图表标题
 * ========================================= */

.chart-header {

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    space-between;

  min-height:
    48px;

}


.chart-title {

  color:
    #30344a;

  font-size:
    16px;

  font-weight:
    600;

  line-height:
    1.4;

}


.chart-subtitle {

  margin-top:
    4px;

  color:
    #a0a6b5;

  font-size:
    12px;

}


.chart-header-mark {

  flex-shrink:
    0;

  padding:
    5px 9px;

  border-radius:
    7px;

  background:
    rgba(102,126,234,0.07);

  color:
    #7180c9;

  font-size:
    11px;

  line-height:
    1;

}


/* =========================================
 * 图表
 * ========================================= */

.chart {

  width:
    100%;

  margin-top:
    2px;

}


.chart-medium {

  height:
    295px;

}


.chart-large {

  height:
    320px;

}


/* =========================================
 * Loading
 * ========================================= */

.visualization-container
:deep(.el-loading-mask) {

  background:
    rgba(255,255,255,0.52);

  backdrop-filter:
    blur(3px);

  -webkit-backdrop-filter:
    blur(3px);

}


/* =========================================
 * 响应式
 * ========================================= */

@media screen and (max-width: 1200px) {

  .overview-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

  }

  .chart-grid {

    grid-template-columns:
      1fr;

  }

}


@media screen and (max-width: 800px) {

  .visualization-container {

    padding:
      12px;

  }


  .top-section {

    align-items:
      flex-start;

    flex-direction:
      column;

    gap:
      14px;

    padding:
      18px;

  }


  .top-right {

    width:
      100%;

    justify-content:
      space-between;

  }


  .overview-grid {

    grid-template-columns:
      1fr;

  }


  .current-month {

    flex:
      1;

  }


  .month-picker {

    flex:
      1;

    width:
      auto;

  }


  .chart-header {

    gap:
      10px;

  }

}
</style>