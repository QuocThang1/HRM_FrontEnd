import { useState, useEffect } from "react";
import {
    Table,
    Card,
    Button,
    Space,
    Tag,
    Select,
    Typography,
    Popconfirm,
    Alert,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import {
    getAllPoliciesApi,
    deletePolicyApi,
} from "../../../utils/Api/policyApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreatePolicyModal from "./createPolicyModal";
import EditPolicyModal from "./editPolicyModal";

const { Title } = Typography;
const { Option } = Select;

const ListOfPolicy = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [filteredPolicies, setFilteredPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const categories = [
        { value: "all", label: "All Categories" },
        { value: "leave", label: "Leave Policy" },
        { value: "salary", label: "Salary Policy" },
        { value: "working_hours", label: "Working Hours" },
        { value: "benefits", label: "Benefits" },
        { value: "discipline", label: "Discipline" },
        { value: "recruitment", label: "Recruitment" },
        { value: "general", label: "General" },
    ];

    useEffect(() => {
        fetchPolicies();
    }, []);

    useEffect(() => {
        filterPolicies();
    }, [selectedCategory, policies]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await getAllPoliciesApi();
            if (res && res.data) {
                setPolicies(res.data);
            }
        } catch (error) {
            console.error("Error fetching policies:", error);
            toast.error("Failed to load policies");
        } finally {
            setLoading(false);
        }
    };

    const filterPolicies = () => {
        if (selectedCategory === "all") {
            setFilteredPolicies(policies);
        } else {
            setFilteredPolicies(
                policies.filter((policy) => policy.category === selectedCategory)
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deletePolicyApi(id);
            if (res.EC === 0) {
                toast.success("Policy deleted successfully");
                fetchPolicies();
            } else {
                toast.error(res.EM || "Failed to delete policy");
            }
        } catch (error) {
            console.error("Error deleting policy:", error);
            toast.error("Failed to delete policy");
        }
    };

    const handleEdit = (policy) => {
        setSelectedPolicy(policy);
        setEditModalVisible(true);
    };

    const getCategoryLabel = (value) => {
        const category = categories.find((cat) => cat.value === value);
        return category ? category.label : value;
    };

    const getCategoryColor = (category) => {
        const colors = {
            leave: "blue",
            salary: "green",
            working_hours: "orange",
            benefits: "purple",
            discipline: "red",
            recruitment: "cyan",
            general: "default",
        };
        return colors[category] || "default";
    };

    const columns = [
        {
            title: "No.",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 150,
            render: (text) => (
                <div style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    lineHeight: "1.5"
                }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 150,
            align: "center",
            render: (category) => (
                <Tag color={getCategoryColor(category)}>
                    {getCategoryLabel(category)}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 120,
            align: "center",
            render: (isActive) => (
                <Tag color={isActive ? "success" : "error"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 150,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete Policy"
                        description="Are you sure you want to delete this policy?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="list-policy-page">
            <div className="page-header">
                <Title level={2} className="page-title">
                    <FileTextOutlined /> Company Policies
                </Title>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Space size="large" wrap style={{ width: "100%" }}>
                    <Space direction="vertical" size={4}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                            Filter by Category
                        </span>
                        <Select
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            style={{ width: 200 }}
                            placeholder="Select category"
                        >
                            {categories.map((cat) => (
                                <Option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </Option>
                            ))}
                        </Select>
                    </Space>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateModalVisible(true)}
                        size="large"
                    >
                        Create New Policy
                    </Button>
                </Space>

                {selectedCategory !== "all" && (
                    <Alert
                        message={`Showing policies for: ${getCategoryLabel(
                            selectedCategory
                        )}`}
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredPolicies}
                    loading={loading}
                    rowKey="_id"
                    scroll={{ x: 1000 }}
                    onRow={(record) => ({
                        onClick: (e) => {
                            if (e.target.closest('button')) {
                                return;
                            }
                            navigate(`/profile/policy-management/${record._id}`);
                        },
                        style: { cursor: "pointer" },
                    })}
                    pagination={{
                        pageSize: 4,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} policies`,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    locale={{
                        emptyText: (
                            <Alert
                                message="No Policies"
                                description={
                                    selectedCategory === "all"
                                        ? "No policies found"
                                        : `No policies found for ${getCategoryLabel(
                                            selectedCategory
                                        )}`
                                }
                                type="info"
                                showIcon
                            />
                        ),
                    }}
                />
            </Card>

            <CreatePolicyModal
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onSuccess={() => {
                    setCreateModalVisible(false);
                    fetchPolicies();
                }}
                categories={categories.filter((cat) => cat.value !== "all")}
            />

            <EditPolicyModal
                visible={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedPolicy(null);
                }}
                onSuccess={() => {
                    setEditModalVisible(false);
                    setSelectedPolicy(null);
                    fetchPolicies();
                }}
                policy={selectedPolicy}
                categories={categories.filter((cat) => cat.value !== "all")}
            />
        </div>
    );
};

export default ListOfPolicy;