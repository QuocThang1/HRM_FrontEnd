import { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { getManagerDepartmentApi } from "../../../utils/Api/departmentApi";
import { getDepartmentShiftsApi } from "../../../utils/Api/departmentShiftApi";
import { createShiftAssignmentApi } from "../../../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../styles/assignShiftModal.css";

const { RangePicker } = DatePicker;

const AssignShiftModal = ({ open, onClose, staffId, staff, onSuccess }) => {
  const [form] = Form.useForm();
  const [department, setDepartment] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDepartmentAndShifts();
    }
  }, [open]);

  const fetchDepartmentAndShifts = async () => {
    try {
      setLoading(true);
      // Lấy department của manager
      const deptRes = await getManagerDepartmentApi();
      if (deptRes.data) {
        setDepartment(deptRes.data);
        // Lấy danh sách ca của department
        const shiftsRes = await getDepartmentShiftsApi(deptRes.data._id);
        if (shiftsRes && Array.isArray(shiftsRes.data)) {
          // Chỉ lấy ca active
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
            disabledDate={(current) => {
              // Không cho chọn ngày trong quá khứ
              return current && current < dayjs().startOf("day");
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignShiftModal;
