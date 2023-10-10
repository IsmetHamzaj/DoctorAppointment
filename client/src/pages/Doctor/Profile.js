import { Button, Input, TimePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import { Form, Col, Row } from 'antd'
import Layout from '../../Components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { showLoading, hideLoading } from './../../redux/alertsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import DoctorForm from './../../Components/DoctorForm'
import moment from 'moment'

function Profile() {
    const dispatch = useDispatch()
    const params = useParams()
    const { user } = useSelector(state => state.user)
    const [doctor, setDoctor] = useState(null)
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try {
            dispatch(showLoading())

            const response = await axios.post(
                "/api/doctor/update-doctor-profile",
                {
                    ...values, userId: user._id, timings: [
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

    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/get-doctor-info-by-user-id',{
                userId: params.userId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctor(response.data.data)
            }
            else {
                localStorage.clear()
                navigate("/login")
            }
        } catch (error) {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getDoctorData()
    }, [])
    return (
        <Layout>
            <h1 className='page-title'>Doctor Profile</h1>
            <hr />
            {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
        </Layout>
    )
}

export default Profile