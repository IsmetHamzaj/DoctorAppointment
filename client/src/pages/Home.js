import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from './../Components/Layout'
import { Col, Row } from 'antd'
import Doctor from '../Components/Doctor'
import { useDispatch } from 'react-redux'
import {showLoading, hideLoading} from './../redux/alertsSlice'


const Home = () => {
    const [doctors, setDoctors] = useState([])
    const dispatch = useDispatch()
    const getData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/user/get-all-approved-doctors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctors(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <Layout>
            <Row gutter={20}>
                {doctors.map((doctor) => {
                    return (
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Doctor doctor={doctor} />
                        </Col>
                    )
                })}
            </Row>
        </Layout>
    )
}

export default Home