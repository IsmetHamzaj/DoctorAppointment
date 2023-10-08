import { useDispatch } from 'react-redux'
import Layout from './../../Components/Layout'
import React, { useEffect, useState } from 'react'
import { showLoading, hideLoading } from './../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'

function UsersList() {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()
    const getUsersData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setUsers(response.data.data)

            }
        } catch (error) {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getUsersData()
    }, [])


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => {
                return(
                    <h1 style={{textTransform: 'capitalize'}} className='normal-text'>{record.name}</h1>
                )
            }
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => {
                return (
                    <div className='d-flex'>
                        <h1 className='anchor'>Block</h1>
                    </div>
                )
            }
        },
    ]


    return (
        <Layout>
            <h1>Users List</h1>
            <Table columns={columns} dataSource={users} />
        </Layout>
    )
}

export default UsersList