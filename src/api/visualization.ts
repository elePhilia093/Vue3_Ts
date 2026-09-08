import request from '@/utils/request';

/**
 * =========================
 * 可视化数据类型
 * =========================
 */

export interface DeptStatistics {
  deptName: string;
  employeeCount: number;
}

export interface GenderStatistics {
  gender: number;
  employeeCount: number;
}

export interface AttendanceStatistics {
  attendanceStatus: number;
  attendanceCount: number;
}

export interface LeaveStatistics {
  approvalStatus: number;
  leaveCount: number;
}

export interface SalaryTrend {
  salaryMonth: string;
  grossSalary: number;
  netSalary: number;
}

export interface AttendanceTrend {
  attendanceMonth: string;
  abnormalCount: number;
}

export interface VisualizationOverviewVO {
  employeeTotal: number;

  deptTotal: number;

  attendanceRate: number;

  monthNetSalary: number;

  deptStatistics: DeptStatistics[];

  genderStatistics: GenderStatistics[];

  attendanceStatistics: AttendanceStatistics[];

  leaveStatistics: LeaveStatistics[];

  salaryTrend: SalaryTrend[];

  attendanceTrend: AttendanceTrend[];
}

/**
 * 获取可视化统计数据
 */
export function getVisualizationOverview(month?: string) {
  return request<VisualizationOverviewVO>({
    url: '/visualization/overview',
    method: 'get',
    params: {
      month,
    },
  });
}
