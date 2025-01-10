import React from 'react'
import { Link } from 'react-router-dom'

const SuperDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

<Link to="/">Home</Link>
      <h1>Super Admin Dashboard</h1>
      <p>Welcome! Here you can manage Teachers and Students.</p>

<p><Link to="/CreateUser"> create user</Link></p>

    </div>
  )
}

export default SuperDashboard