import { Button, Input, TimePicker } from 'antd'
import React from 'react'
import { Form, Col, Row } from 'antd'
import Layout from '../Components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { useNavigate } from 'react-router-dom'
import DoctorForm from '../Components/DoctorForm'
import moment from 'moment'

function ApplyDoctor() {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()


    const onFinish = async (values) => {
        try {

            dispatch(showLoading())

            const response = await axios.post(
                "/api/user/apply-doctor-account",
                {
                    ...values, userId: user._id, 
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm")
                    ]
                }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            })

            dispatch(hideLoading())

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/")
            } else {
                toast.error(response.data.message)
            }
        }

        catch (error) {
            console.log(error)
        }
    }
    return (
        <Layout>
            <h1 className='page-title'>Apply Doctor</h1>
            <hr />
            <DoctorForm onFinish={onFinish} />
        </Layout>
    )
}

export default ApplyDoctor