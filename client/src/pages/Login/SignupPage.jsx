import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationContainer, { triggeredNotification } from "../../Notification/NotificationContainer";
import { initializeSocket } from "../../components/SocketConnection";

export default function SignupPage() {

    let [data, setData] = useState({username:"",email:"",password:""});
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {

        if(location.state && location.state.errorMessage) {
            triggeredNotification(location.state.errorMessage,"error");
            navigate("/signup", {state:{}})
        }

    },[location.state])

    let handleInput = (e) => {
        setData((curr) => {
            return{
                ...curr,[e.target.name]:e.target.value
            }
        })
    }

    let handleForm = async (e) => {
        e.preventDefault();
        console.log(data);
        setData({username:"",email:"",password:""})

        try {
            let response = await fetch("http://localhost:8080/router/signup",{
                method: "POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({data:data}),
                credentials:'include'
            });
    
            let result = await response.json();
            console.log(result);
            if(response.status == 200) {
                localStorage.setItem('frontData',JSON.stringify(result));
                const users = localStorage.getItem('frontData');
                let parseData = JSON.parse(users)
                const socket = initializeSocket();
                socket.emit("addNewUser",parseData.user.id)
                navigate('/chat',{state:{loginMessage:result.message}})
            }else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error.message)
            navigate('/signup',{state:{errorMessage : error.message}})
        }
    }
    return(

        <div className="auth-page">
            <NotificationContainer></NotificationContainer>
            <div className="auth-container">
            <h3>Signup page</h3>
            <form onSubmit={handleForm}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input required onChange={handleInput} value={data.username} name="username" id="username" placeholder="Enter your Username"></input>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input required onChange={handleInput} value={data.email} name="email" id="email" placeholder="Enter your email"></input>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input required onChange={handleInput} value={data.password} name="password" placeholder="Enter the password" id="password"></input><br></br>
                </div>
                <button className="btn btn-primary">Submmit</button>
            </form>
            <p>Already have an account?<Link className="link" to={"/login"}>Login</Link></p>
            </div>
        </div>
    )
}