import {motion} from "framer-motion";

const notificationVarients = {
    hidden : {opacity : 0, y:-50},
    visible : {opacity : 1, y:0},
    exit : {opacity:0,y:50},
};

const Notification = ({message,type}) => {
    const typeStyles = {
        success : {backgroundColor:"green",color:"white"},
        error : {backgroundColor:"red",color:"white"},
        // logout : {backgroundColor:"green",color:"white"},
        logout : {backgroundColor:"#FFA500",color:"white"},
        login : {backgroundColor:"#2196F3",color:"white"},
        // add : {backgroundColor:"orange",color:"white"},
    };
    return(
        <motion.div 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVarients}
            transition={{duration:0.5}}
            style={{
                position :"fixed",
                top:"10px",
                right:"42%",
                padding:'10px 20px',
                borderRadius : "5px",
                marginBottom: "10px",
                ...typeStyles[type],

            }}
        >
            {message||"No message provided"}
            {/* <button onClick={onClose} style={{marginLeft:"10px"}}>Close</button> */}

        </motion.div>
    )
}

export default Notification;