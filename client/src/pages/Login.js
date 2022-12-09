import React from 'react'
import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onFinish = async(values) => {
        try{
            dispatch(showLoading())
            const response = await axios.post('/api/user/login', values)
            dispatch(hideLoading())
            if(response.data.success) {
                toast.success(response.data.message)
                toast("Redirecting to home page")
                localStorage.setItem("token", response.data.data)
                navigate("/")
            }else {
                dispatch(hideLoading())
                toast.error(response.data.message)
            }
        }
        catch (error) {
            toast.error("Something went wrong")
        }
    }
    return(
        <div className='auth'>
            <div className='register-form card p-3'>
                <h1 className='card-title'>Welcome back</h1>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='Email:' name='email'>
                        <Input placeholder='Email' type='email' />
                    </Form.Item>
                    <Form.Item label='Password:' name='password'>
                        <Input placeholder='Password' type='password'/>
                    </Form.Item>
                    <Button className='primary-button my-2' htmlType='submit'>Log In</Button>
                    <Link className='anchor mt-2' to='/register'>CLICK HERE TO REGISTER</Link>
                </Form>
            </div>
        </div>
    )
}

export default Login