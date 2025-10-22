import { Table, Button, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { getStaffApi, deleteStaffApi } from "../../utils/Api/staffApi";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddEmployeeModal from "./addEmployeeModal"; // import modal mới
import EditEmployeeModal from "./editEmployeeModal";
import { toast } from "react-toastify";

const StaffPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentStaffId, setCurrentStaffId] = useState(null);

    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            const res = await getStaffApi();
            if (!res?.message) {
                setDataSource(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch staffs", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching staffs:", error);
        }
    };

    const handleEdit = (record) => {
        setCurrentStaffId(record._id);
        setEditModalOpen(true);
    };

    const handleDelete = async (staffId) => {
        try {
            const res = await deleteStaffApi(staffId);
            toast.success(res.EM, { autoClose: 2000 });
            fetchStaffs(); // reload danh sách
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee", { autoClose: 2000 });
        }
    };

    const columns = [
        { title: "Id", dataIndex: "_id" },
        { title: "Email", dataIndex: ["personalInfo", "email"] },
        { title: "Full Name", dataIndex: ["personalInfo", "fullName"] },
        { title: "Role", dataIndex: "role" },
        {
            title: "",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    {/* Nút chỉnh sửa */}
                    <EditOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() => handleEdit(record)}
                    />

                    {/* Nút xóa có xác nhận */}
                    <Popconfirm
                        title="Are you sure to delete this employee?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "16px", textAlign: "right" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Employee
                </Button>
            </div>

            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="_id"
                locale={{ emptyText: "" }}
                pagination={{ pageSize: 6 }}
            />
            <AddEmployeeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchStaffs}
            />

            <EditEmployeeModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                staffId={currentStaffId}
                onSuccess={fetchStaffs}
            />
        </div>
    );
};

export default StaffPage;


