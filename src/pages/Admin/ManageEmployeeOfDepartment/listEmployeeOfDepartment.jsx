import { useEffect, useState, useContext } from "react";
import { Table, Button, Popconfirm } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getStaffByDepartmentApi,
  removeStaffFromDepartmentApi,
} from "../../../utils/Api/staffApi";
import { DeleteOutlined } from "@ant-design/icons";
import AddEmployeeToDepartmentModal from "./addEmployeeToDepartmentModal";
import "../../../styles/ListEmployeeOfDepartment.css";
import CreateDepartmentReviewModal from "../ManageDepartmentReview/createDepartmentReviewModal";
import { AuthContext } from "../../../context/auth.context";
import { toast } from "react-toastify";
import ViewDepartmentReviewsModal from "../ManageDepartment/viewDepartmentReviewsModal";

const ListEmployeeOfDepartment = () => {
  const { departmentId } = useParams();
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  const departmentName = location.state?.departmentName || "Department";
  const managerId = location.state?.managerId;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
  const [isViewReviewsOpen, setIsViewReviewsOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [departmentId]);

  const fetchEmployees = async () => {
    try {
      const res = await getStaffByDepartmentApi(departmentId);
      if (res && res.EC === 0 && Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch employees", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Cannot fetch employees from server", { autoClose: 2000 });
    }
  };

  const handleRemove = async (staffId) => {
    try {
      const res = await removeStaffFromDepartmentApi(staffId);
      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        fetchEmployees();
      } else {
        toast.error(res?.EM || "Failed to remove employee", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error removing employee from department", {
        autoClose: 2000,
      });
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: ["personalInfo", "fullName"],
      render: (text) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: ["personalInfo", "email"],
      render: (text) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          {text}
        </div>
      ),
    },
    { title: "Role", dataIndex: "role" },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove this employee from department?"
          onConfirm={() => handleRemove(record._id)}
          okText="Yes"
          cancelText="No"
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      ),
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button onClick={() => navigate(-1)}>Back</Button>
        <div>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => setIsCreateReviewModalOpen(true)}
          >
            Create Review
          </Button>
          <Button
            type="default"
            style={{ marginRight: 8 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsViewReviewsOpen(true);
            }}
          >
            View Reviews
          </Button>
          <Button
            type="primary"
            onClick={() => setIsAddEmployeeModalOpen(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>
      <h2>Employees of {departmentName}</h2>
      <Table
        bordered
        dataSource={employees}
        columns={columns}
        rowKey="_id"
        locale={{ emptyText: "" }}
        pagination={{ pageSize: 8 }}
        rowClassName={(record) =>
          managerId && record._id === managerId ? "manager-row" : ""
        }
      />

      <AddEmployeeToDepartmentModal
        open={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        departmentId={departmentId}
        onSuccess={fetchEmployees}
      />
      <CreateDepartmentReviewModal
        open={isCreateReviewModalOpen}
        onClose={() => setIsCreateReviewModalOpen(false)}
        departmentId={departmentId}
        adminId={auth.staff._id}
        onSuccess={() => {
          /* Optionally reload reviews */
        }}
      />
      <ViewDepartmentReviewsModal
        open={isViewReviewsOpen}
        onClose={() => setIsViewReviewsOpen(false)}
        departmentId={departmentId}
      />
    </div>
  );
};

export default ListEmployeeOfDepartment;
