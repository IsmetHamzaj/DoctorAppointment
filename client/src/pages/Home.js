import React, {useEffect} from 'react'
import axios from 'axios'
import Layout from './../Components/Layout'


const Home = () => {

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post("/api/user/get-user-by-id", {} ,{
                    headers: {
                        Authorization: 'Bearer' + localStorage.getItem("token")
                    }
                })
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }
    },[])

    return <Layout>
        <h1>Homepage</h1>
    </Layout>
}

export default Home