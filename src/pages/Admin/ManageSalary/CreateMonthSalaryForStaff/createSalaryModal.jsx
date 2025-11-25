import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Space,
  Alert,
  Spin,
  Typography,
  Input,
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { getSalaryByStaffApi } from "../../../../utils/Api/salaryApi";
import {
  createMonthlySalaryApi,
  getMonthlySalariesByStaffApi,
} from "../../../../utils/Api/monthlySalaryApi";
import { getAttendancesByDepartmentApi } from "../../../../utils/Api/attendanceAPI";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../../styles/createSalaryModal.css";

const { Text } = Typography;
const { TextArea } = Input;

const CreateSalaryModal = ({
  visible,
  onCancel,
  staff,
  departmentId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [estimatedSalary, setEstimatedSalary] = useState(0);
  const [existingMonths, setExistingMonths] = useState([]);

  const isManager = staff?.role === "manager";

  useEffect(() => {
    if (visible && staff) {
      fetchHourlyRate();
      fetchExistingSalaries();
    }
  }, [visible, staff]);

  const fetchHourlyRate = async () => {
    try {
      setLoading(true);
      const response = await getSalaryByStaffApi(staff._id);
      if (response?.EC === 0 && response.data) {
        setHourlyRate(response.data.hourlyRate);
      } else {
        toast.error(response?.EM || "Failed to load employee salary info", {
          autoClose: 2000,
        });
        setHourlyRate(0);
      }
    } catch (error) {
      toast.error("Error loading employee information", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingSalaries = async () => {
    try {
      const response = await getMonthlySalariesByStaffApi(staff._id);
      if (response?.EC === 0 && response.data) {
        const months = response.data.map((salary) => {
          const monthStr = salary.month.toString().padStart(2, "0");
          return `${monthStr}-${salary.year}`;
        });
        setExistingMonths(months);
      }
    } catch (error) {
      console.error("Error fetching existing salaries:", error);
    }
  };

  const calculateTotalHours = async (staffId, month, year) => {
    if (isManager) {
      return 160;
    }

    try {
      const startDate = dayjs(`${year}-${month}-01`).format("YYYY-MM-DD");
      const endDate = dayjs(`${year}-${month}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");

      const response = await getAttendancesByDepartmentApi(
        departmentId,
        startDate,
        endDate,
      );

      if (response?.EC === 0) {
        const staffAttendances = response.data.filter(
          (att) => att.staffId._id === staffId,
        );
        const total = staffAttendances.reduce(
          (sum, att) => sum + (att.workingHours || 0),
          0,
        );
        return total;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating hours:", error);
      return 0;
    }
  };

  const handleMonthChange = async (date) => {
    if (!date || !staff) return;

    const month = date.month() + 1;
    const year = date.year();
    const monthKey = `${month.toString().padStart(2, "0")}-${year}`;

    if (existingMonths.includes(monthKey)) {
      toast.warning(
        `Salary for ${date.format("MM/YYYY")} has already been created!`,
        {
          autoClose: 3000,
        },
      );
    }

    setLoading(true);
    const hours = await calculateTotalHours(staff._id, month, year);
    setTotalHours(hours);

    const bonus = form.getFieldValue("bonus") || 0;
    const deduction = form.getFieldValue("deduction") || 0;
    const estimated = hours * hourlyRate + bonus - deduction;
    setEstimatedSalary(estimated);
    setLoading(false);

    // Chỉ hiển thị warning nếu không phải Manager và không có giờ làm
    if (hours === 0 && !isManager) {
      toast.info("No working hours found for the selected month.", {
        autoClose: 3000,
      });
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    const bonus = allValues.bonus || 0;
    const deduction = allValues.deduction || 0;
    const estimated = totalHours * hourlyRate + bonus - deduction;
    setEstimatedSalary(estimated);
  };

  const handleSubmit = async (values) => {
    if (totalHours === 0 && !isManager) {
      toast.error("Cannot create salary record with zero working hours.", {
        autoClose: 2000,
      });
      return;
    }

    const month = values.month.month() + 1;
    const year = values.month.year();
    const monthKey = `${month.toString().padStart(2, "0")}-${year}`;

    if (existingMonths.includes(monthKey)) {
      toast.error("Salary for this month already exists!", { autoClose: 2000 });
      return;
    }

    try {
      setSubmitting(true);

      const response = await createMonthlySalaryApi(
        staff._id,
        month,
        year,
        values.bonus || 0,
        values.deduction || 0,
        values.note || "",
      );

      if (response?.EC === 0) {
        toast.success(response?.EM || "Salary created successfully!", {
          autoClose: 2000,
        });
        handleClose();
        onSuccess?.();
      } else {
        toast.error(response?.EM || "An error occurred", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error creating salary", { autoClose: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setTotalHours(0);
    setEstimatedSalary(0);
    setExistingMonths([]);
    onCancel();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const dateRender = (currentDate) => {
    const month = (currentDate.month() + 1).toString().padStart(2, "0");
    const year = currentDate.year();
    const monthKey = `${month}-${year}`;

    const isExisting = existingMonths.includes(monthKey);

    return (
      <div
        className={`ant-picker-cell-inner ${isExisting ? "salary-existing-month" : ""}`}
        style={
          isExisting
            ? {
                backgroundColor: "#ff4d4f",
                color: "#fff",
                borderRadius: "4px",
                fontWeight: "bold",
              }
            : {}
        }
      >
        {currentDate.format("MMM")}
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="salary-modal-header">
          <DollarOutlined className="salary-modal-header-icon" />
          <span>Create Salary - {staff?.personalInfo.fullName}</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      className="create-salary-modal"
    >
      <Spin spinning={loading}>
        <Alert
          message={"Basic Salary Information"}
          description={
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>Hourly Rate: {formatCurrency(hourlyRate)}</Text>
              <Text>Total Hours: {totalHours.toFixed(1)}h</Text>
              <Text strong style={{ color: "#2c3e50" }}>
                Estimated Salary: {formatCurrency(estimatedSalary)}
              </Text>
              {existingMonths.length > 0 && (
                <Text type="warning" style={{ fontSize: "12px" }}>
                  ⚠️ Red months indicate salary has already been created
                </Text>
              )}
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormValuesChange}
          className="salary-form"
        >
          <Form.Item
            label="Select Month"
            name="month"
            rules={[{ required: true, message: "Please select a month" }]}
          >
            <DatePicker
              picker="month"
              format="MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Select month"
              onChange={handleMonthChange}
              size="large"
              monthCellRender={dateRender}
            />
          </Form.Item>

          <Form.Item label="Bonus" name="bonus" initialValue={0}>
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              step={0.01}
              precision={2}
              placeholder="Enter bonus amount"
            />
          </Form.Item>

          <Form.Item label="Deduction" name="deduction" initialValue={0}>
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              step={0.01}
              precision={2}
              placeholder="Enter deduction amount"
            />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <TextArea
              rows={3}
              placeholder="Enter note (optional)"
              maxLength={500}
              showCount
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="ant-btn-default"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ant-btn-primary"
                disabled={submitting || (totalHours === 0 && !isManager)}
              >
                {submitting ? "Creating..." : "Create Salary"}
              </button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateSalaryModal;
