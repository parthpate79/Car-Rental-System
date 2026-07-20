import React from "react";
import { Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

function Login() {

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.alertsReducer);

  function onFinish(values){
      dispatch(userLogin(values));
  }
  
  return (

<div
style={{
minHeight:"100vh",
background:"linear-gradient(135deg,#0f172a,#1e40af)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}
>

{loading && <Spinner/>}

<div
style={{
width:"1100px",
background:"#fff",
borderRadius:"20px",
overflow:"hidden",
boxShadow:"0 15px 40px rgba(0,0,0,.3)"
}}
>

<Row>

<Col lg={12} xs={0}>

<img
src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200"
style={{
width:"100%",
height:"650px",
objectFit:"cover"
}}
/>

</Col>

<Col lg={12} xs={24}>

<div style={{padding:"60px"}}>

<h1
style={{
fontSize:"45px",
fontWeight:"700",
textAlign:"center",
marginBottom:"40px",
color:"#1e40af"
}}
>
DriveEase
</h1>

<Form layout="vertical" onFinish={onFinish}>

<Form.Item
label="Username"
name="username"
rules={[{required:true}]}
>

<Input size="large"/>

</Form.Item>

<Form.Item
label="Password"
name="password"
rules={[{required:true}]}
>

<Input.Password size="large"/>

</Form.Item>

<button
className="btn1"
style={{
width:"100%",
height:"45px",
marginTop:"10px"
}}
>

LOGIN

</button>

<br/><br/>

<div style={{textAlign:"center"}}>

<Link to="/register">

Create New Account

</Link>

</div>

</Form>

</div>

</Col>

</Row>

</div>

</div>

  );
}

export default Login;

