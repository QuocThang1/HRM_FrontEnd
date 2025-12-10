import { useEffect, useState } from "react";
import { Row, Col, Spin, Select, Card } from "antd";
import {
  TeamOutlined,
  FolderOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardCard from "../components/DashboardCard";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { getStaffApi } from "../utils/Api/staffApi";
import { getDepartmentsApi } from "../utils/Api/departmentApi";
import {
  getAllContractsApi,
  getExpiringContractsApi,
} from "../utils/Api/contractApi";
import { getAllResignationsApi } from "../utils/Api/resignationApi";
import { getDepartmentReviewsByAdminApi } from "../utils/Api/departmentApi";
import { getAllAttendancesApi } from "../utils/Api/attendanceAPI";
import { getAllShiftAssignmentsApi } from "../utils/Api/shiftAssignmentApi";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { toast } from "react-toastify";

dayjs.extend(isBetween);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalDepartments: 0,
    expiringContracts: 0,
    pendingResignations: 0,
    newCandidates: 0,
    todayAttendance: 0,
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [contractStatusData, setContractStatusData] = useState([]);
  const [candidateStatusData, setCandidateStatusData] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Filter states
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update calendar when filters change
  useEffect(() => {
    if (allShifts.length > 0) {
      updateCalendarEvents();
    }
  }, [selectedDepartment, selectedStaff, allShifts]);

  const updateCalendarEvents = () => {
    let filteredShifts = allShifts;

    // Filter by department
    if (selectedDepartment) {
      filteredShifts = filteredShifts.filter(
        (shift) => shift.department?._id === selectedDepartment
      );
    }

    // Filter by staff
    if (selectedStaff) {
      filteredShifts = filteredShifts.filter(
        (shift) => shift.staff?._id === selectedStaff
      );
    }

    // Convert shifts to calendar events (expand date range)
    const events = [];
    filteredShifts.forEach((shift) => {
      const fromDate = dayjs(shift.fromDate);
      const toDate = dayjs(shift.toDate);

      // Create event for each day in the range
      let currentDate = fromDate;
      while (
        currentDate.isBefore(toDate) ||
        currentDate.isSame(toDate, "day")
      ) {
        events.push({
          title: `${shift.staff?.personalInfo?.fullName || "N/A"} - ${shift.shiftType?.shiftCode || "N/A"}`,
          start: currentDate.format("YYYY-MM-DD"),
          allDay: true,
          backgroundColor:
            shift.status === "scheduled" ? "#1890ff" : "#52c41a",
          borderColor: shift.status === "scheduled" ? "#1890ff" : "#52c41a",
          extendedProps: {
            staffName: shift.staff?.personalInfo?.fullName,
            shiftCode: shift.shiftType?.shiftCode,
            fromTime: shift.shiftType?.fromTime,
            toTime: shift.shiftType?.toTime,
            department: shift.department?.departmentName,
            status: shift.status,
          },
        });
        currentDate = currentDate.add(1, "day");
      }
    });

    setCalendarEvents(events);
  };

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    setSelectedStaff(null); // Reset staff filter

    // Update staff list based on selected department
    if (value) {
      const filteredStaff = allStaff.filter(
        (staff) => staff.departmentId?._id === value
      );
      setFilteredStaffList(filteredStaff);
    } else {
      setFilteredStaffList(allStaff); // Show all staff when no department selected
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel with error handling
      const results = await Promise.allSettled([
        getStaffApi(),
        getDepartmentsApi(),
        getAllContractsApi(),
        getExpiringContractsApi(30),
        getAllResignationsApi(),
        getDepartmentReviewsByAdminApi(),
        getAllAttendancesApi(
          dayjs().format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD")
        ),
        getAllShiftAssignmentsApi(),
      ]);

      // Extract data and log errors
      const [
        staffRes,
        departmentsRes,
        contractsRes,
        expiringRes,
        resignationsRes,
        reviewsRes,
        attendancesRes,
        shiftsRes,
      ] = results.map((result, index) => {
        const apiNames = [
          "Staff",
          "Departments",
          "Contracts",
          "Expiring Contracts",
          "Resignations",
          "Department Reviews",
          "Attendances",
          "Shift Assignments",
        ];

        if (result.status === "fulfilled") {
          console.log(` ${apiNames[index]}:`, result.value?.data);
          return result.value;
        } else {
          console.error(`${apiNames[index]} Error:`, result.reason);
          return { data: [] };
        }
      });

      // Process stats
      const totalStaff =
        staffRes?.data?.filter((s) => s.role !== "candidate").length || 0;
      const totalDepartments = departmentsRes?.data?.length || 0;
      const expiringContracts = expiringRes?.data?.length || 0;

      const pendingResignations =
        resignationsRes?.data?.filter((r) => r.status === "pending")?.length ||
        0;

      const newCandidates =
        staffRes?.data?.filter(
          (staff) =>
            staff.role === "candidate" &&
            staff.candidateInfo?.status === "pending"
        )?.length || 0;

      const todayAttendance = attendancesRes?.data?.length || 0;

      setStats({
        totalStaff,
        totalDepartments,
        expiringContracts,
        pendingResignations,
        newCandidates,
        todayAttendance,
      });

      // Set departments and staff for filters
      setDepartments(departmentsRes?.data || []);
      const staffData =
        staffRes?.data?.filter((s) => ["staff", "manager"].includes(s.role)) ||
        [];
      setAllStaff(staffData);
      setFilteredStaffList(staffData);

      // Process department data for pie chart
      const departmentMap = {};

      staffRes?.data
        ?.filter((staff) => ["staff", "manager"].includes(staff.role))
        .forEach((staff) => {
          if (staff.departmentId?.departmentName) {
            const deptName = staff.departmentId.departmentName;
            departmentMap[deptName] = (departmentMap[deptName] || 0) + 1;
          } else {
            departmentMap["Unassigned"] =
              (departmentMap["Unassigned"] || 0) + 1;
          }
        });

      const colors = [
        "#1890ff",
        "#52c41a",
        "#faad14",
        "#ff4d4f",
        "#722ed1",
        "#13c2c2",
        "#eb2f96",
        "#fa8c16",
      ];
      const deptData = Object.entries(departmentMap).map(
        ([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        })
      );
      setDepartmentData(deptData);

      // Process contract status data
      const contractStatusMap = {
        active: 0,
        expired: 0,
      };

      contractsRes?.data?.forEach((contract) => {
        const status = contract.status || "active";
        contractStatusMap[status] = (contractStatusMap[status] || 0) + 1;
      });

      const contractData = [
        {
          name: "Active",
          value: contractStatusMap.active,
          color: "#52c41a",
        },
        {
          name: "Expired",
          value: contractStatusMap.expired,
          color: "#ff4d4f",
        },
      ];
      setContractStatusData(contractData);

      // Process candidate status data
      const candidateStatusMap = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      staffRes?.data
        ?.filter((staff) => staff.role === "candidate" && staff.candidateInfo)
        .forEach((candidate) => {
          const status = candidate.candidateInfo?.status || "pending";
          candidateStatusMap[status] = (candidateStatusMap[status] || 0) + 1;
        });

      const candidateData = [
        {
          name: "Pending",
          value: candidateStatusMap.pending,
          color: "#faad14",
        },
        {
          name: "Approved",
          value: candidateStatusMap.approved,
          color: "#52c41a",
        },
        {
          name: "Rejected",
          value: candidateStatusMap.rejected,
          color: "#ff4d4f",
        },
      ];
      setCandidateStatusData(candidateData);

      // Process recent reviews (top 5)
      const reviews = reviewsRes?.data?.slice(0, 5) || [];
      setRecentReviews(reviews);

      // Store all shifts for filtering
      setAllShifts(shiftsRes?.data || []);
    } catch (error) {
      console.error("💥 Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  return (
    <div
      className="dashboard"
      style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}
    >
      {/* Quick Stats Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={<TeamOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
            title="Total Staff"
            value={stats.totalStaff}
            options={{ progressColor: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <FolderOutlined style={{ fontSize: 20, color: "#52c41a" }} />
            }
            title="Departments"
            value={stats.totalDepartments}
            options={{ progressColor: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <FileTextOutlined style={{ fontSize: 20, color: "#faad14" }} />
            }
            title="Expiring Contracts"
            value={stats.expiringContracts}
            options={{ progressColor: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <FileDoneOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
            }
            title="Pending Resignations"
            value={stats.pendingResignations}
            options={{ progressColor: "#ff4d4f" }}
          />
        </Col>
      </Row>

      {/* Second Stats Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            type="statCard"
            icon={
              <UserAddOutlined style={{ fontSize: 20, color: "#722ed1" }} />
            }
            title="New Applications"
            value={stats.newCandidates}
            options={{ progressColor: "#722ed1" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            type="statCard"
            icon={
              <ClockCircleOutlined style={{ fontSize: 20, color: "#13c2c2" }} />
            }
            title="Today's Attendance"
            value={stats.todayAttendance}
            options={{ progressColor: "#13c2c2" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            type="statCard"
            icon={
              <FileTextOutlined style={{ fontSize: 20, color: "#eb2f96" }} />
            }
            title="Recent Reviews"
            value={recentReviews.length}
            options={{ progressColor: "#eb2f96" }}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <DashboardCard
            type="pie"
            title="Staff by Department"
            data={departmentData}
            height={300}
            options={{
              dataKey: "value",
              label: true,
            }}
          />
        </Col>
        <Col xs={24} lg={8}>
          <DashboardCard
            type="pie"
            title="Contract Status"
            data={contractStatusData}
            height={300}
            options={{
              dataKey: "value",
              label: true,
            }}
          />
        </Col>
        <Col xs={24} lg={8}>
          <DashboardCard
            type="pie"
            title="Candidate Status"
            data={candidateStatusData}
            height={300}
            options={{
              dataKey: "value",
              label: true,
            }}
          />
        </Col>
      </Row>

      {/* Recent Reviews */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <DashboardCard
            type="task"
            title="Recent Department Reviews"
            data={[
              {
                icon: <FileDoneOutlined style={{ color: "#1890ff" }} />,
                title: "Latest Reviews",
                items:
                  recentReviews.length > 0
                    ? recentReviews.map(
                      (review) =>
                        `${review.departmentId?.departmentName || "N/A"} - ${review.score || "N/A"}/10 - ${dayjs(review.month).format("MM/YYYY")}`
                    )
                    : ["No reviews yet"],
                color: "#1890ff",
                status: "info",
              },
            ]}
          />
        </Col>

        <Col xs={24} lg={12}>
          <DashboardCard
            type="progress-group"
            data={[
              {
                title: "System Statistics",
                icon: <FileTextOutlined />,
                iconColor: "#1890ff",
                items: [
                  {
                    label: "Total Staff",
                    value: stats.totalStaff,
                    total: stats.totalStaff,
                    color: "#1890ff",
                  },
                  {
                    label: "Active Contracts",
                    value: contractStatusData[0]?.value || 0,
                    total: stats.totalStaff,
                    color: "#52c41a",
                  },
                  {
                    label: "Expiring Soon",
                    value: stats.expiringContracts,
                    total: stats.totalStaff,
                    color: "#faad14",
                  },
                  {
                    label: "Resignations",
                    value: stats.pendingResignations,
                    total: 10,
                    color: "#ff4d4f",
                  },
                ],
              },
            ]}
          />
        </Col>
      </Row>

      {/* Calendar with Filters */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  Shift Schedule
                </span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Select
                    placeholder="Select Department"
                    style={{ minWidth: 200 }}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    options={[
                      { label: "All Departments", value: null },
                      ...departments.map((dept) => ({
                        label: dept.departmentName,
                        value: dept._id,
                      })),
                    ]}
                  />
                  <Select
                    placeholder="Select Staff"
                    style={{ minWidth: 200 }}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={selectedStaff}
                    onChange={setSelectedStaff}
                    options={[
                      { label: "All Staff", value: null },
                      ...filteredStaffList.map((staff) => ({
                        label: `${staff.personalInfo?.fullName || "N/A"}${staff.departmentId?.departmentName ? ` (${staff.departmentId.departmentName})` : ""}`,
                        value: staff._id,
                      })),
                    ]}
                  />
                </div>
              </div>
            }
          >
            {calendarEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: 48, marginBottom: 16 }}
                />
                <p>No shifts scheduled</p>
              </div>
            ) : (
              <DashboardCard
                type="calendar"
                height={530}
                options={{
                  calendarProps: {
                    events: calendarEvents,
                    initialView: "dayGridMonth",
                    locale: enLocale,
                    selectable: true,
                    eventContent: (arg) => {
                      return {
                        html: `
                          <div style="
                            padding: 2px 4px; 
                            font-size: 11px; 
                            overflow: hidden; 
                            text-overflow: ellipsis; 
                            white-space: nowrap;
                            cursor: pointer;
                          ">
                            <strong style="color: ${arg.event.backgroundColor};">${arg.event.extendedProps.shiftCode}</strong>: ${arg.event.extendedProps.staffName}
                            <br/>
                            <small style="color: #666;">${arg.event.extendedProps.fromTime} - ${arg.event.extendedProps.toTime}</small>
                          </div>
                        `,
                      };
                    },
                    eventClick: (info) => {
                      const props = info.event.extendedProps;
                      const statusText =
                        props.status === "scheduled"
                          ? "Scheduled"
                          : "Completed";
                      toast.info(
                        <div>
                          <strong>{props.staffName}</strong>
                          <br />
                          <strong>Shift:</strong> {props.shiftCode}
                          <br />
                          <strong>Time:</strong> {props.fromTime} -{" "}
                          {props.toTime}
                          <br />
                          <strong>Department:</strong> {props.department || "N/A"}
                          <br />
                          <strong>Status:</strong> {statusText}
                        </div>,
                        { autoClose: 5000 }
                      );
                    },
                    eventDidMount: (info) => {
                      // Add tooltip
                      info.el.title = `${info.event.extendedProps.staffName} - ${info.event.extendedProps.shiftCode}\n${info.event.extendedProps.fromTime} - ${info.event.extendedProps.toTime}`;
                    },
                  },
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;