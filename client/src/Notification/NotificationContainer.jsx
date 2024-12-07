import {motion, AnimatePresence} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Notification from "./Notification";

const NotificationContainer = () => {
    const [notification, setNotification] = useState([]);

    const addNotification = useCallback((message,type) => {
        // console.log(message,type)
        const id = new Date().getTime();
        setNotification([...notification,{id,message,type}]);
        setTimeout(() => {
            setNotification((current) => current.filter((n) => n.id !== id));
        }, 3000);
    },[]);

    useEffect(() => {
        window.addNotificationHandle = addNotification;
    },[addNotification]);

    return(
        <div style={{position:"fixed", top:"10px", right:"10px"}}>
            <AnimatePresence>
                {notification.map((notifications) => (
                    <Notification key={notifications.id} 
                                  message={notifications.message}
                                  type={notifications.type}>

                    </Notification>
                ))}
            </AnimatePresence>

        </div>
    );
};

export const triggeredNotification = (message,type) => {
    if(addNotificationHandle) {
        addNotificationHandle(message,type);
    }
};

export default NotificationContainer;