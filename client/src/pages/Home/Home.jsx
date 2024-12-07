import { useEffect, useState } from 'react';
import './Home.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationContainer, { triggeredNotification } from '../../Notification/NotificationContainer';

export default function Home() {
  let location = useLocation();
  let navigate = useNavigate();

    let [loaded,setLoaded] = useState(false);
    let [login,setLogin] = useState(false);
    // const users = localStorage.getItem('frontData');
    // console.log(users);

    useEffect(() => {
      let auth = async() =>{
        try {
          let response = await fetch("http://localhost:8080/router/authcontext",{
            method: "GET",
            headers : {
                'Content-type' : "application/json",
            },
            credentials:'include'
        });

        let result = await response.json();
        if(response.status == 200) {
            setLogin(true)
        } 
        // else {
        //   setLogin(false);
        //     navigate('/',{state:{errorMessage:"You are not login"}})
        // }
        } catch (error) {
          // navigate('/',{state:{errorMessage:"Something went wrong"}})
        }
      }
      auth();
  },[])

    useEffect(() => {

      if(location.state && location.state.errorMessage) {
          triggeredNotification(location.state.errorMessage,"error");
          navigate("/", {state:{}})
      }

      if(location.state && location.state.successMessage) {
          triggeredNotification(location.state.successMessage,"success");  
          navigate("/chat", {state:{}})
      }

      if(location.state && location.state.logoutMessage) {
        triggeredNotification(location.state.logoutMessage,"logout");
        navigate("/", {state:{}})
    }

  }, [location.state])

    useEffect(() => {
      setLoaded(true);
      // if(users) {
      //   setLogin(true);
      // } else {
      //   setLogin(false);
      // }
    },[]);

    let handleLogout = async (e) => {
        e.preventDefault();
        try {
          let response = await fetch("http://localhost:8080/router/logout",{
            method :"POST",
            credentials : 'include'
          });
    
          let result = await response.json();
          console.log(result);
          if(response.status == 200) {
            localStorage.removeItem('frontData');
            setLogin(false);
            navigate("/",{state:{logoutMessage:result.message}});
          }
        } catch (error) {
          console.log("error")
          setLogin(false);
          navigate("/",{state:{errorMessage:result.message}})
        }
      }
    return(
        <div className={`landing-page ${loaded?'loaded':''}`}>
          <NotificationContainer></NotificationContainer>
            <h1>Welcome to ChatApp</h1>
            <p>Connect and chat with friends and colleagues easily.</p>
            <div className="buttons">
              <Link className="btn btn-primary"  to={"/chat"}>Let's Start the chat</Link>

              {!login &&  <Link className="btn btn-secondary"  to={"/signup"}>Sign up</Link>}
              {!login &&  <Link className="btn btn-secondary"  to={"/login"}>Login</Link>}
              {login &&  <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>}

            </div>


        </div>
    )
}