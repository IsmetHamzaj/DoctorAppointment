import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import { Button, Col, DatePicker, Row, TimePicker } from 'antd'
import moment from 'moment'
import toast from 'react-hot-toast'

function BookAppointment() {
    const [isAvailabale, setIsAvailable] = useState(false)
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const { user } = useSelector((state) => state.user)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [doctor, setDoctor] = useState(null)

    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/get-doctor-info-by-id', {
                doctorId: params.doctorId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctor(response.data.data)
                console.log(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getDoctorData()
    }, [])

    const bookNow = async () => {
        try {
            // if (!date || !time) {
            //     toast.error("Please select a date and time.");
            //     return;
            // }
            dispatch(showLoading())
            const response = await axios.post('/api/user/book-appointment' , {
                doctorId: params.doctorId,
                userId: user ? user._id : null,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error("Error booking appointment")
            dispatch(hideLoading())
        }
    }
    console.log(user)
    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
                    <hr />
                    <Row>
                        <Col span={8} sm={24} xs={24} lg={8}>
                            <h1 className='normal-text'><b>Timings: </b> {doctor.timings[0]} - {doctor.timings[1]}</h1>
                            <div className='d-flex flex-column pt-2'>
                                <DatePicker format="DD-MM-YYYY" name='date' onChange={(value) => setDate(moment(value).format("DD-MM-YYYY"))} />
                                <TimePicker format="HH:mm" className='mt-3' name='time' onChange={(value) => {
                                    setTime(
                                        moment(value).format("HH:mm")
                                    )
                                }} />
                                <Button className='primary-button mt-3 full-width-button'>Check Availability</Button>
                                <Button className='primary-button mt-3 full-width-button' onClick={bookNow}>Book Now</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Layout>
    )
}

export default BookAppointment