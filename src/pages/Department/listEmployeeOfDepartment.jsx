import { useEffect, useState } from "react";
import { Table, notification, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStaffByDepartmentApi } from "../../utils/Api/staffApi";
import AddEmployeeToDepartmentModal from "./AddEmployeeToDepartmentModal";

const ListEmployeeOfDepartment = () => {
    const { departmentId } = useParams();
    const [employees, setEmployees] = useState([]);
    const location = useLocation();
    const departmentName = location.state?.departmentName || "Department";
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                notification.error({
                    message: "Error",
                    description: res?.EM || "Failed to fetch employees",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Cannot fetch employees from server",
            });
        }
    };

    const columns = [
        { title: "ID", dataIndex: "_id" },
        { title: "Full Name", dataIndex: ["personalInfo", "fullName"] },
        { title: "Email", dataIndex: ["personalInfo", "email"] },
        { title: "Role", dataIndex: "role" },
        // Thêm các cột khác nếu cần
    ];

    return (
        <div style={{ padding: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Button onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add Employee
                </Button>
            </div>
            <h2>Employees of {departmentName}</h2>
            <Table
                bordered
                dataSource={employees}
                columns={columns}
                rowKey="_id"
                locale={{ emptyText: "" }}
                pagination={{ pageSize: 8 }}
            />

            <AddEmployeeToDepartmentModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                departmentId={departmentId}
                onSuccess={fetchEmployees}
            />
        </div>
    );
};

export default ListEmployeeOfDepartment;

