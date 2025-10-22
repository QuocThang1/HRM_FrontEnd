import { Table, Button, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getDepartmentsApi,
    deleteDepartmentApi,
} from "../../../utils/Api/departmentApi";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddDepartmentModal from "./addDepartmentModal";
import EditDepartmentModal from "./editDepartmentModal";
import { toast } from "react-toastify";

const DepartmentPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await getDepartmentsApi();
            if (res && Array.isArray(res.data)) {
                setDataSource(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch departments", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Cannot fetch departments from server", { autoClose: 2000 });
        }
    };

    const handleEdit = (record) => {
        setCurrentDepartmentId(record._id);
        setEditModalOpen(true);
    };

    const handleDelete = async (departmentId) => {
        try {
            await deleteDepartmentApi(departmentId);
            toast.success("Department deleted successfully", { autoClose: 2000 });
            fetchDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
            toast.error("Failed to delete department", { autoClose: 2000 });
        }
    };

    const columns = [
        { title: "ID", dataIndex: "_id" },
        { title: "Department Name", dataIndex: "departmentName" },
        { title: "Description", dataIndex: "description" },
        {
            title: "Manager",
            dataIndex: "managerId",
            render: (manager) => manager?.personalInfo?.fullName || "None",
        },
        {
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <EditOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this department?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </div>
            ),
            onCell: () => ({
                onClick: e => e.stopPropagation()
            }),
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
                    Add Department
                </Button>
            </div>

            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="_id"
                locale={{ emptyText: "" }}
                pagination={{ pageSize: 6 }}
                onRow={(record) => ({
                    onClick: () =>
                        navigate(`/profile/departments/${record._id}/employees`, {
                            state: { departmentName: record.departmentName, managerId: record.managerId?._id }
                        }),
                    style: { cursor: "pointer" }
                })}
            />

            <AddDepartmentModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDepartments}
            />

            <EditDepartmentModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                departmentId={currentDepartmentId}
                onSuccess={fetchDepartments}
            />
        </div>
    );
};

export default DepartmentPage;

