import React from "react";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

function Register() {

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.alertsReducer);

  function onFinish(values) {
    dispatch(userRegister(values));
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

<div className="row g-0">

<div className="col-lg-6 d-none d-lg-block">

<img
src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
alt=""
style={{
width:"100%",
height:"650px",
objectFit:"cover"
}}
/>

</div>

<div className="col-lg-6">

<div style={{padding:"50px"}}>

<h1
style={{
textAlign:"center",
color:"#1e40af",
marginBottom:"30px"
}}
>
Create Account
</h1>

<Form layout="vertical" onFinish={onFinish}>

<Form.Item
label="Username"
name="username"
rules={[{ required: true }]}
>
<Input size="large"/>
</Form.Item>

<Form.Item
label="Password"
name="password"
rules={[{ required: true }]}
>
<Input.Password size="large"/>
</Form.Item>

<Form.Item
label="Confirm Password"
name="cpassword"
dependencies={["password"]}
rules={[
{ required: true },
({ getFieldValue }) => ({
validator(_, value) {
if (!value || getFieldValue("password") === value) {
return Promise.resolve();
}
return Promise.reject(new Error("Passwords do not match"));
},
}),
]}
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
REGISTER
</button>

<br/><br/>

<div style={{textAlign:"center"}}>

Already have an account?

<br/>

<Link to="/login">
Login Here
</Link>

</div>

</Form>

</div>

</div>

</div>

</div>

</div>

  );
}

export default Register;