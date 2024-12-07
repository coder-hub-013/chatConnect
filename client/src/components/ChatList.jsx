import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getSocket } from "./SocketConnection";

export default function ChatList({getChatId,}) {
    let [chats, setChats] = useState([]);
    let navigate = useNavigate();

    const users = localStorage.getItem('frontData');
    if(!users) {
        navigate("/",{state:{errorMessage:"You are not login"}})
    }
    const parseData = JSON.parse(users);
    const userId = parseData.user.id

    useEffect(() => {
        const socket = getSocket();
        if(!socket) {
            return;
        }
        
        let fetchChatHistory = async () => {
            const response = await fetch("http://localhost:8080/router/chats", {
                method : "POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({data:parseData.user.id}),
                credentials : 'include'
            })
            const result = await response.json();
            // console.log(result);
            if(response.status == 200) {
                setChats(result);
            } else {
                navigate('/',{state:{errorMessage:result.message}})
            }
        }
        fetchChatHistory();
        

        if(socket) {
            socket.on('updateChatList',(receiverDetails) => {
                setChats((prevChat) =>  [...prevChat,...receiverDetails]);
            });
            return () => {
                socket.off('updateChatList');
            }
        }

    },[parseData.user.id])
    let handleViewChat = (chat_id) => {
       getChatId(chat_id)
    }


    return(
        <div className="chat-list-page">
            <div className="chat-list-header">
                <h2>Chats:</h2>
            </div>
            <div className="chat-list">

                {chats.length > 0 ? chats.map(chat => {
                    const sender = chat.participants.find(p => p.user._id !== userId);
                    return(
                        <div key={chat._id} className="chat-item">
                            <div className="chat-item-info">
                                <h4 className="username">{chat.isGroupChat?chat.groupName:sender.user.username}</h4>
                                {/* <p className="chat-last-message">No message yet</p> */}
                            </div>
                            <button className="view-chat-btn" onClick={() =>handleViewChat(chat._id)}>View Chat</button>
                        </div>
                    )
                }):<div className="no-chats">No USERS are there Firstly start the chat</div>}


            </div>            
         </div>
    )
};






















// body {
//     background-color: #F0F0F0;
//     margin: 0;
//     padding: 0;
// }

// .chat-app {
//     height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: #e5ddd5;
// }

// .chat-container {
//     display: flex;
//     width: 90%;
//     height: 50vh;
//     background-color: white;
//     border-radius: 10px;
//     box-shadow: 0 0 15px rgba(0, 0,0,0.2);
// }

// .chat-app-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 10px;
//     background-color: #128C7E;
//     color: #fff;
// }

// /* .app-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 10px 20px;
//     background-color: #128C7E;
//     color: #fff;
// } */

// .app-title {
//     font-size: 24px;
//     margin: 0;
// }

// .chat-app-actions .btn-s{
//     margin-left: 10px;
//     background-color: #25D366;
//     color: #fff;
//     border: none;
//     padding: 5px 10px;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 14px;
// }

// .chat-app-actions .btn-s:hover {
//     font-weight: bolder;
// }

// /* .chat-list-page {
//     width: 50%;
//     background-color: #fff;
//     border-right: 1px solid #ddd;
//     overflow-y: auto;
// } */

// .chat-list {
//     flex: 1;
//     border-right: 1px solid #ccc;
//     background-color: #f8f8f8;
//     padding: 20px;
//     overflow-y: auto;
//     /* display: flex;
//     flex-direction: column;
//     gap: 10px;
//     max-height: 70vh;
//     overflow-y: auto; */
// }

// .chat-message {
//     flex: 2;
//     display: flex;
//     flex-direction: column;
//     background-color: #efddd5;
//     padding: 20px;
//     overflow-y: auto;
// }

// .no-chat-selected {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-grow: 1;
//     font-size: 18px;
//     color: #999;
// }

// /* .chat-list-header {
//     background-color: #128C7E;
//     color: #fff;
//     padding: 10px;
//     font-size: 18px;
//     font-weight: bold;
//     text-align: center;
// } */

// .chat-item {
//     display: flex;
//     /* justify-content: space-between; */
//     align-items: center;
//     padding: 10px;
//     background-color: #f0f0f0;
//     border-radius: 8px;
//     cursor: pointer;
//     transition: background-color 0.3s;
// }

// .chat-item:hover {
//     background-color: #e0e0e0;
// }

// .chat-item-info {
//     margin-left: 10px;
// }

// .chat-item-info .username {
//     font-size: 16px;
//     font-weight: bold;
// }

// .chat-message-container {
//     width: 70%;
//     display: flex;
//     flex-direction: column;
//     padding: 20px;
// }

// .chat-message-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding-bottom: 10px;
//     border-bottom: 1px solid #ddd;
//     background-color: #109888;
//     color: white;
// }

// .chat-window {
//     overflow-y: auto;
//     max-height: 60vh;
//     padding: 10px;
//     background-color: #f5f5f5;
// }

// .message-bubble {
//     margin: 5px 0;
//     padding: 10px;
//     border-radius: 10px;
//     max-width: 60%;
// }


// .message-bubble.sent {
//     background-color: #dcf8c6;
//     text-align: right;
// }

// .message-bubble.received {
//     background-color: #fff;
// }

// .message-input-section {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// }

// .input-area {
//     display: flex;
//     align-items: center;
//     padding: 10px;
//     background-color: #f0f0f0;
// }

// .input-area input {
//     flex: 1;
//     padding: 10px;
//     border-radius: 20px;
//     border: 1px solid #ccc;
//     margin-right: 10px;
// }

// .input-area button {
//     background-color: #25D366;
//     color: white;
//     padding: 10px 20px;
//     border: none;
//     border-radius: 20px;
//     cursor: pointer;
// }