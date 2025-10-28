import { Table } from "antd";
import { useEffect, useState } from "react";
import { getStaffApi } from "../utils/api.js"; // Adjust the import path as necessary
import { notification } from "antd";

const StaffPage = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await getStaffApi();
        console.log("API response:", res);
        if (!res?.message) {
          setDataSource(res); // Assuming the API returns staffs in this format
        } else {
          notification.error({
            message: "Error",
            description: res.message,
          });
        }
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };
    fetchStaffs();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 2 }}
      />
    </div>
  );
};
export default StaffPage;
