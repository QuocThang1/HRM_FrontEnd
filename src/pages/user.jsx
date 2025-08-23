import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../utils/api.js'; // Adjust the import path as necessary
import { notification } from 'antd';

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUserApi();
                if (!res?.message) {
                    setDataSource(res); // Assuming the API returns users in this format                   
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.message,
                    });
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },

    ];

    return (
        <div style={{ padding: '30px' }}>
            <Table
                bordered
                dataSource={dataSource} columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 2 }}
            />
        </div>
    );
}
export default UserPage;