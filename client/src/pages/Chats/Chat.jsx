import './Chat.css'
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import SearchUser from "../../components/SearchUser";
import CreateGroup from "../../components/CreateGroup";
import ChatMessage from "./ChatMessage";
import NotificationContainer, { triggeredNotification } from '../../Notification/NotificationContainer';
export default function Chat() {
    const navigate = useNavigate();
    const location = useLocation();
    let [createGroup,setCreateGroup] = useState(false);
    let [addNewUser,setAddNewUser] = useState(false);
    let [showChatMessage,setShowChatMessage] = useState('');

    useEffect(() => {

        if(location.state && location.state.errorMessage) {
            triggeredNotification(location.state.errorMessage,"error");
            navigate("/chat", {state:{}})
        }

        if(location.state && location.state.successMessage) {
            triggeredNotification(location.state.successMessage,"success");  
            navigate("/chat", {state:{}})
        }

        if(location.state && location.state.loginMessage) {
            triggeredNotification(location.state.loginMessage,"login");  
            navigate("/chat", {state:{}})  
        }
    }, [location.state])

    const handleSelectUser = (result) => {
        // console.log(result);
        const chatId = result.chat._id;
        setShowChatMessage(chatId)
        setAddNewUser(false);
    }

    const users = localStorage.getItem('frontData');
    if(!users) {
        return navigate("/",{state:{errorMessage:"You are not login"}})
    }
    let parseData = JSON.parse(users);
    let userId = parseData.user.id;

    let handleCreateGroup = (e) => {
        e.preventDefault();
        setCreateGroup(true);
    }

    let GroupCreated = (result) => {
        setCreateGroup(false);
        setShowChatMessage(result.newGroupChat._id);
    };

    let handleAddNewUser = (e) => {
        e.preventDefault();
        setAddNewUser(true);
    }

    let showChatId = (chat_id) => {
        setShowChatMessage(chat_id);
    };

    let closeChatBox = () => {
        setShowChatMessage('');
    };

    let CancleGroupCreated = () => {
        setCreateGroup(false);
    };

    let CancleSearch = () => {
        setAddNewUser(false);
    };

    return(
            <div className='chat-app'>
                <NotificationContainer></NotificationContainer>
                    <header className='chat-app-header'>
                        <h3 className='app-title'>let Chats begin!</h3>
                        <div className='chat-app-actions'>
                            <button className='btn-s create-group-btn' onClick={handleCreateGroup}>Create Group</button>
                            <button className='btn-s add-user-btn' onClick={handleAddNewUser}>Add new user</button>
                        </div>
                    </header>


                    <div className="chat-container">
                        <div className='chat-list-wrapper'>
                            {createGroup?<CreateGroup CancleGroupCreated={CancleGroupCreated} GroupCreated={GroupCreated} userId={userId}></CreateGroup>:""}
                            {addNewUser?<SearchUser CancleSearch={CancleSearch} onSelectUser={handleSelectUser}></SearchUser>:""}
                            <ChatList getChatId={showChatId}></ChatList>
                        </div>

                        {/* <div className='chat-container'> */}
                            <div className='chat-message-wrapper'>
                                {showChatMessage?(
                                    <ChatMessage closeChatBox={closeChatBox} id={showChatMessage}></ChatMessage>
                                ):(<div className='no-chat-selected'></div>)}  
                            </div>
                       {/* </div> */}


                    </div>
            </div>
    )
}
