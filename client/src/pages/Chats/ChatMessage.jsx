import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../components/SocketConnection';
import { useCallback, useEffect, useRef, useState } from "react";
import AddNewUser from '../../components/AddNewUser';

export default function ChatMessage({id,closeChatBox}) {
    const socket = getSocket();
    let navigate = useNavigate();
    let messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({behaviour:'smooth'})
    }
    if(!socket) {
        return;
    }
    let [chat, setChat] = useState([]);
    let [message,setMessage] = useState('');//input message
    let [selectMessages,setSelectMessages] = useState(false);
    let [selectedMessages,setSelectedMessages] = useState([]);
    let [selectedMessagesReceiver,setSelectedMessagesReceiver] = useState(true);
    let [addUserInGroup,setAddUserInGroup] = useState(null);

    let [istyping,setIsTyping] = useState(false);
    // let [typingUsers,setTypingUsers] = useState([]);


    const users = localStorage.getItem('frontData');
    if(!users) {
        navigate("/",{state:{errorMessage:"Something went wrong"}})
    } 
    const parseData = users?JSON.parse(users):null;
    let userId = parseData.user.id;

        const fetchChatHistory = useCallback(async() => {
            try {
                const users = localStorage.getItem('frontData');
                if(!users) {
                    navigate("/",{state:{errorMessage:"Something went wrong"}})
                } 
                const response = await fetch(`http://localhost:8080/router/chat/${id}/messages`, {
                    method : "POST",
                    headers : {
                        'Content-type' : "application/json",
                    },
                    body : JSON.stringify({data:parseData.user.id}),
                    credentials : 'include'
                })
    
                const result = await response.json();
                console.log(result);
                if(response.status === 200) {
                    setChat(result);
                }else {
                    throw new Error("Something went wrong")
                }
            } catch (error) {
                navigate("/",{state:{errorMessage:"Something went wrong"}})
                console.error(error,"error");
            }
        },[parseData.user.id,id])

    
        const markMessageAsRead = useCallback(async() => {
            try {
                const users = localStorage.getItem('frontData');
                if(!users) {
                    navigate("/",{state:{errorMessage:"Something went wrong"}})
                } 
                const response = await fetch(`http://localhost:8080/router/chat/${id}/mark-as-read`, {
                    method : "POST",
                    headers : {
                        'Content-type' : "application/json",
                    },
                    body : JSON.stringify({userId:parseData.user.id,chatId:id}),
                    credentials : 'include'
                })
    
                const result = await response.json();
                console.log(result);
                // if(response.status === 200) {
                //     setChat(result);
                // }else {
                //     throw new Error("Something went wrong")
                // }
            } catch (error) {
                // navigate("/",{state:{errorMessage:"Something went wrong"}})
                console.error(error,"error");
            }
        },[parseData.user.id,id])

    useEffect(() => {
        fetchChatHistory();
        // markMessageAsRead();
        scrollToBottom();

        if(socket) {
            socket.on('newMessage',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });

            socket.on('deleteNewMessage',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });
            //userTyping

            socket.on('userTyping',({chatId,userId1}) => {
                if(chatId === id) {
                    if(userId1 !== parseData.user.id) {
                        setIsTyping(true);
                    }
                }
            });

            socket.on('userStopTyping',({chatId,userId1}) => {
                if(chatId === id) {
                    if(userId1 !== parseData.user.id) {
                        setIsTyping(false);
                    }
                }
            });//markAsReadByReceiver

            socket.on('addNewUserInGroupFront',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });

            socket.emit('markAsRead',{userId:parseData.user.id,chatId:id});

            socket.on('markAsReadByReceiver',(chat) => {
                console.log(chat);
                console.log("I am triggered")
                if(chat._id === id) {
                    console.log("I am triggered 2")
                    setChat(chat);
                }
            });//markAsReadByReceiver


        }
        return () => {
            if(socket) {
                socket.off('newMessage')
                socket.off('deleteNewMessage')
                socket.off('userTyping')
                socket.off('addNewUserInGroupFront')
                socket.off('markAsReadByReceiver')
            }
        };
    },[id,parseData.user.id,fetchChatHistory]);

    const sendMessage = (e) => {
        e.preventDefault();
        if(message.trim()) {
            socket.emit('sendMessage',{chatId:id,content:message,senderId:parseData.user.id});
            setMessage('');
            socket.emit('stopTyping',{chatId:id,userId1:parseData.user.id});

        }

    };
    let handleCloseChat = (e) => {
        e.preventDefault();
        closeChatBox()
    }
    if(chat.length == 0) {
        return <div>Loading...</div>
    }

    let handleSelectMessage = () => {
        if(selectMessages) {
            setSelectMessages(false)
        }else {
            setSelectMessages(true)
            setSelectedMessages([])
            setSelectedMessagesReceiver(true);
        }
    };

    let toggleMessageSelection = (messageId,senderId,deleted) => {

        if(selectedMessages.includes(messageId)) {
            setSelectedMessages(selectedMessages.filter(id => id !== messageId));
            setSelectedMessagesReceiver(true);

        } else {
            setSelectedMessages([...selectedMessages,messageId])
            if(senderId !== userId || deleted) {
                setSelectedMessagesReceiver(false);
            }
        }
    };

    let handleDeleteFromMe = async(e) => {
        e.preventDefault();
        if(selectedMessages.length > 0) {
            console.log(selectedMessages);
            setSelectMessages(false);

            let response = await fetch('http://localhost:8080/router/deleteForMe',{
                method:"POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body:JSON.stringify({messagesIds:selectedMessages,chatId:id}),
                credentials : 'include'
            });

            let result = await response.json();
            // console.log(result);
            if(response.status === 200) {
                setSelectedMessages([])
                setChat(result);
            } else {
                navigate("/",{state:{errorMessage:result.message}})
            }

        } else {
            setSelectedMessages([])
            alert("Select at least one message")
        }

    };

    let handleDeleteFromEveryOne = async(e)=> {
        e.preventDefault();
        if(selectedMessages.length > 0) {
            setSelectMessages(false);
            socket.emit('deleteMessage',{chatId:id,messagesIds:selectedMessages,senderId:parseData.user.id});

        } else {
            setSelectedMessages([])
            alert("Select at least one message")
        }
    };

    let timeout = null;
    let handleTyping = () => {

        if(!timeout) {
            socket.emit('typing',{chatId:id,userId:parseData.user.id});
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            socket.emit('stopTyping',{chatId:id,userId:parseData.user.id});
            timeout = null;
        },3000);
    };

    let addNewUserInGroup = (id) => {
        setAddUserInGroup(id);
    };

    let handleCancleAddNewUserINGrop = () => {
        setAddUserInGroup(null)
    }

    return(
        <div className='chat-message-page'>
            {console.log(addUserInGroup)}
            {addUserInGroup && <AddNewUser handleCancleAddNewUserINGrop={handleCancleAddNewUserINGrop} id={id} userId={userId}></AddNewUser>}
            <header className='chat-header'>
                <h4 className='chat-title'>Chat Messages</h4>
                <button className='close-chat-btn' onClick={handleCloseChat}>X</button>
            </header>
            <div className="chat-participants">
                <p className='chat-title'>First message by(creator):{chat.isGroupChat?chat.groupName:chat.createdBy.username}</p>
                <hr></hr> 
                <div className='participants'>
                    <p>participants:</p>
                    {istyping && <p>Someone is typing...</p>}
                    <div className='participant-name-span'>
                        {chat.participants.map((participant) => (
                                <span className='participant-name' key={participant._id}>{participant.user.username}</span> 
                        ))}
                    </div>                    <br></br>


                    <div className='chat-app-actions'>
                       <button className='btn-s create-group-btn' onClick={handleSelectMessage}>{!selectMessages?"Select Messages":"Dont select"}</button>
                        {selectMessages&&<button className='btn-s create-group-btn' onClick={handleDeleteFromMe}>Delete From Me</button>}
                        {selectMessages&& selectedMessagesReceiver &&<button className='btn-s create-group-btn' onClick={handleDeleteFromEveryOne}>Delete from everyone</button>}
                        {chat.isGroupChat && <button onClick={() =>addNewUserInGroup(id)} className='btn-s create-group-btn'>Add New User</button>}
                    </div>

                </div>

                <hr></hr>


                <div className='chat-window'>
                    <h3>Messages:</h3>
                    {chat.messages.length > 0?
                        (chat.messages.filter(message => new Date(message.createdAt) >= new Date(chat.participants.find(p => p.user._id === userId)?.joinedAt))
                        .map((message) => (
                            !message.deletedBy.includes(userId) && (
                                <div className={`message-item ${message.sender._id === userId ? 'sent':'received'}`} key={message._id}>
                                    <div className='message-content'>
                                            {chat.isGroupChat &&<div><p>Sender:{message.sender.username}</p> <hr></hr></div>}
                                           
                                            <p>{message.content}</p>
                                            {selectMessages?<input type="checkbox" onChange={() => toggleMessageSelection(message._id,message.sender._id,message.deleted)}></input>:""}
                                            {/* <small>{message.readBy.length === 0 ? "Unread":message.readBy.some(rb => rb.user === userId) ? "SEEN BY YOU" : "SEEN BY OTHERS"}</small> */}
                                            {message.readBy.length != 0 && message.sender._id === userId &&<small>Seen</small>}
                                     </div>
                                </div>
                            )
                        )))
                    :(<div className='no-messages'>No message yet:</div>)}
                </div>

            </div>

            <div className='message-input'>
                <input className='message-input-field' type="text"
                    value={message}
                    onChange={(e) => {setMessage(e.target.value); handleTyping();}}
                    placeholder="Type a message..."
                >
                </input>
                <button className='send-message-btn' onClick={sendMessage}>Send</button>
                <br></br>

            </div>
        </div>
    )
}
