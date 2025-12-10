import { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Alert } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { getManagerDepartmentApi } from "../../../utils/Api/departmentApi";
import { getDepartmentShiftsApi } from "../../../utils/Api/departmentShiftApi";
import {
  createShiftAssignmentApi,
  getAllShiftAssignmentsApi,
} from "../../../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "../../../styles/assignShiftModal.css";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const AssignShiftModal = ({ open, onClose, staffId, staff, onSuccess }) => {
  const [form] = Form.useForm();
  const [department, setDepartment] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduledShifts, setScheduledShifts] = useState([]);

  useEffect(() => {
    if (open && staffId) {
      fetchDepartmentAndShifts();
      fetchStaffScheduledShifts();
    }
  }, [open, staffId]);

  const fetchDepartmentAndShifts = async () => {
    try {
      setLoading(true);
      const deptRes = await getManagerDepartmentApi();
      if (deptRes.data) {
        setDepartment(deptRes.data);
        const shiftsRes = await getDepartmentShiftsApi(deptRes.data._id);
        if (shiftsRes && Array.isArray(shiftsRes.data)) {
          const activeShifts = shiftsRes.data.filter((s) => s.isActive);
          setShifts(activeShifts);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load department shifts", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffScheduledShifts = async () => {
    try {
      const res = await getAllShiftAssignmentsApi(null, staffId);
      if (res && res.EC === 0 && res.data) {
        const scheduled = res.data.filter(
          (shift) => shift.status === "scheduled"
        );
        setScheduledShifts(scheduled);
        console.log("Scheduled shifts for staff:", scheduled);
      }
    } catch (error) {
      console.error("Error fetching scheduled shifts:", error);
    }
  };

  const isDateInScheduledRange = (date) => {
    return scheduledShifts.some((shift) => {
      const fromDate = dayjs(shift.fromDate).startOf("day");
      const toDate = dayjs(shift.toDate).endOf("day");
      const currentDate = dayjs(date);

      return (
        currentDate.isSame(fromDate, "day") ||
        currentDate.isSame(toDate, "day") ||
        currentDate.isBetween(fromDate, toDate, "day")
      );
    });
  };

  const disabledDate = (current) => {
    if (!current) return false;

    if (current < dayjs().startOf("day")) {
      return true;
    }

    if (isDateInScheduledRange(current)) {
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const assignmentData = {
        staff: staffId,
        shiftType: values.shiftType,
        department: department._id,
        fromDate: values.dateRange[0].format("YYYY-MM-DD"),
        toDate: values.dateRange[1].format("YYYY-MM-DD"),
      };

      const res = await createShiftAssignmentApi(assignmentData);

      if (res.EC === 0) {
        toast.success(res.EM || "Shift assigned successfully", {
          autoClose: 2000,
        });
        form.resetFields();
        onSuccess();
      } else {
        toast.error(res.EM || "Failed to assign shift", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error assigning shift:", error);
      if (error.errorFields) {
        // Validation errors
        return;
      }
      toast.error(error.response?.data?.EM || "Failed to assign shift", {
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <CalendarOutlined className="modal-icon" />
          <span>Assign Shift</span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Assign"
      cancelText="Cancel"
      confirmLoading={submitting}
      width={600}
      className="assign-shift-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Staff" name="staffInfo">
          <div className="staff-info-display">
            <div className="staff-detail">
              <strong>Name:</strong> {staff?.personalInfo?.fullName}
            </div>
            <div className="staff-detail">
              <strong>Email:</strong> {staff?.personalInfo?.email}
            </div>
          </div>
        </Form.Item>

        <Form.Item label="Department" name="departmentInfo">
          <div className="department-info-display">
            {department?.departmentName || "Loading..."}
          </div>
        </Form.Item>

        <Form.Item
          label="Shift Type"
          name="shiftType"
          rules={[{ required: true, message: "Please select a shift!" }]}
        >
          <Select
            placeholder="Select shift"
            size="large"
            loading={loading}
            disabled={loading || shifts.length === 0}
            options={shifts.map((shift) => ({
              value: shift.shiftType._id,
              label: (
                <div className="shift-option">
                  <span className="shift-code">
                    {shift.shiftType.shiftCode}
                  </span>
                  <span className="shift-time">
                    {shift.shiftType.fromTime} - {shift.shiftType.toTime}
                  </span>
                </div>
              ),
            }))}
          />
        </Form.Item>

        {scheduledShifts.length > 0 && (
          <Alert
            message="Note"
            description="Dates already have scheduled shifts that cannot be selected."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[
            {
              required: true,
              message: "Please select date range!",
            },
          ]}
        >
          <RangePicker
            style={{ width: "100%" }}
            size="large"
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignShiftModal;