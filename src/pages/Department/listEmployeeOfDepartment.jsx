import { useEffect, useState } from "react";
import { Table, notification, Button, Popconfirm } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStaffByDepartmentApi, removeStaffFromDepartmentApi } from "../../utils/Api/staffApi";
import { DeleteOutlined } from "@ant-design/icons";
import AddEmployeeToDepartmentModal from "./AddEmployeeToDepartmentModal";
import "../../css/ListEmployeeOfDepartment.css"

const ListEmployeeOfDepartment = () => {
    const { departmentId } = useParams();
    const [employees, setEmployees] = useState([]);
    const location = useLocation();
    const departmentName = location.state?.departmentName || "Department";
    const managerId = location.state?.managerId;
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

    const handleRemove = async (staffId) => {
        try {
            const res = await removeStaffFromDepartmentApi(staffId);
            if (res && res.EC === 0) {
                notification.success({ message: "Success", description: res.EM });
                fetchEmployees();
            } else {
                notification.error({ message: "Error", description: res?.EM || "Failed to remove employee" });
            }
        } catch (error) {
            notification.error({ message: "Error", description: "Cannot remove employee" });
        }
    };

    const columns = [
        { title: "ID", dataIndex: "_id" },
        { title: "Full Name", dataIndex: ["personalInfo", "fullName"] },
        { title: "Email", dataIndex: ["personalInfo", "email"] },
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
                    onClick={e => e.stopPropagation()}
                >
                    <DeleteOutlined style={{ color: "red", cursor: "pointer" }} onClick={e => e.stopPropagation()} />
                </Popconfirm>
            ),
            onCell: () => ({
                onClick: e => e.stopPropagation()
            }),
        },
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
                rowClassName={(record) =>
                    managerId && record._id === managerId ? "manager-row" : ""
                }
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

