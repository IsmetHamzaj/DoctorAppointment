import React, { useState } from 'react'
import './../Layout.css'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge } from 'antd'


function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Appointments',
            path: "/appointments",
            icon: 'ri-file-list-line'
        },
        {
            name: 'Apply Doctor',
            path: "/apply-doctor",
            icon: 'ri-hospital-line'
        },
        {
            name: 'Profile',
            path: "/profile",
            icon: 'ri-user-line'
        },
    ]
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line'
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "ri-user-line"
        },
        {
            name: 'Users',
            path: '/users',
            icon: 'ri-user-line'
        },
        {
            name: "Doctors",
            path: '/doctors',
            icon: "ri-user-star-line"
        },
    ]

    const menuToBeRender = user?.isAdmin ? adminMenu : userMenu

    return (
        <div className='main p-2'>
            <div className='d-flex layout'>
                <div className="sidebar">
                    <div className='sidebar-header'>
                        <h1 className='logo'>IH</h1>
                    </div>

                    <div className='menu'>
                        {
                            menuToBeRender.map((menu) => {
                                const isActive = location.pathname === menu.path
                                return (
                                    <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                        <i className={menu.icon}></i>
                                        {
                                            !collapsed && <Link to={menu.path}>{menu.name}</Link>
                                        }
                                    </div>
                                )
                            })
                        }
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.clear()
                            navigate('/login')
                        }}>
                            <i className='ri-logout-circle-line'></i>
                            {
                                !collapsed && <Link to='/login'>Logout</Link>
                            }
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        {collapsed ? <i className='ri-menu-2-fill header-action-icon' onClick={() => setCollapsed(!collapsed)}></i> : <i className='ri-close-fill header-action-icon' onClick={() => setCollapsed(!collapsed)}></i>}
                        <div className='d-flex align-items-center px-4'>
                            <Badge count={user?.unseenNotifications.length}>
                            <i className='ri-notification-line header-action-icon px-3'></i>
                            </Badge>
                            
                            <Link className='anchor mx-2' to='/profile'>{user?.name}</Link>

                        </div>
                    </div>
                    <div className='body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout