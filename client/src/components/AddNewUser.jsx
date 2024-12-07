import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getSocket } from "./SocketConnection";

export default function AddNewUser({userId,id,handleCancleAddNewUserINGrop}) {

    let [groupDetails,setGroupDetails] = useState(null);
    let [users,setUsers] = useState([]);
    let [selectedMembers,setSelectedMembers] = useState([]);
    let navigate = useNavigate();
    let socket = getSocket(); 


    useEffect(() => {
        let fetchUsers = async () => {
            const response = await fetch("http://localhost:8080/router/addUserInGroupDetails", {
                method : "POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({chatId:id}),
                credentials : 'include',
            })

            const result = await response.json();
            console.log(result,"19");
            if(response.status == 200) {
                setGroupDetails(result.chatData)
                setUsers(result.userNotInData);
            } else {
                navigate('/',{state:{errorMessage:result.message}})
            }
        }
        fetchUsers();
    },[]);

    let toggleMemberSelection = (userId) => {
        if(selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers,userId])
        }
    };

    let handleCancle = () => {
        handleCancleAddNewUserINGrop();
    };

    let handleAddInGroup = () => {
        if(selectedMembers.length == 0) {
            return navigate("/chat",{state:{errorMessage:"please select at least one member:"}})
        };
        console.log(selectedMembers);
        socket.emit('addNewUserInGroup',{chatId:id,newUserIds:selectedMembers,userId:userId});
        handleCancleAddNewUserINGrop();

    }

    if(!groupDetails) {
        return(
            <div>Loading...</div>
        )
    }
    
    return(
        <div>
            <div className="search-user-container">
            <div className="search-content"> 
            <p>Add New User in group</p>
                <button onClick={handleCancle} className="close-btn" >X</button>

                <div className="search-email">
                    <p>Group Name:</p>
                    <input type="text" value={groupDetails.groupName} readOnly></input>
                </div>

            <div className="search-email">
                <h3>Select Members</h3>
                {users.map(user => (
                    <div key={user._id}>
                        <input id={`${user.username}`} type="checkbox" value={user._id} onChange={() => toggleMemberSelection(user._id)}></input>
                        <label htmlFor={`${user.username}`}>{user.username}</label>
                    </div>
                ))}
                <button onClick={handleAddInGroup}>Add in group</button>
            </div>
            </div>
        </div>
        </div>
    )
}