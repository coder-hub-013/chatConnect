import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export default function CreateGroup({userId,GroupCreated,CancleGroupCreated}) {
    let [groupName,setGroupName] = useState('');
    let [users,setUsers] = useState([]);
    let [selectedMembers,setSelectedMembers] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        let fetchUsers = async () => {
            const response = await fetch("http://localhost:8080/router/users", {
                method : "GET",
                headers : {
                    'Content-type' : "application/json",
                },
                credentials : 'include'
            })

            const result = await response.json();
            console.log(result);
            if(response.status == 200) {
                const nonAdminUsers = result.filter(user => user._id !== userId);
                setUsers(nonAdminUsers);
            } else {
                navigate("/",{state:{errorMessage:"SOmething went wrong"}})
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

    let handleCreateGroup = () => {
        if(!groupName || selectedMembers.length == 0) {
            return navigate("/chat",{state:{errorMessage:"please provide a group name and select at least one member:"}})
        };

            try {
                let CreateGroup = async () => {
                    const response = await fetch("http://localhost:8080/router/create-group", {
                        method : "POST",
                        headers : {
                            'Content-type' : "application/json",
                        },
                        body : JSON.stringify({groupName:groupName,createdBy:userId,memberIds:selectedMembers}),
                        credentials : 'include'
                    })
        
                    const result = await response.json();
                    console.log(result);
                    if(response.status == 200) {
                        GroupCreated(result);
                        navigate("/chat",{state:{successMessage:result.message}})
                    } else {
                        throw new Error(result.message)
                    }
                }
                CreateGroup();
                setGroupName('')
            } catch (error) {
                navigate("/chat",{state:{errorMessage:"Something went wrong"}})
            }

    }

    let handleCancleGroup = (e) => {
        e.preventDefault();
        CancleGroupCreated();
    }
    return(
        <div className="search-user-container">
            <div className="search-content"> 
                <h3>Create Group</h3>
                <button className="close-btn" onClick={handleCancleGroup}>X</button>

                <div className="search-email">
                    <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)}></input>
                </div>

            <div className="search-email">
                <h3>Select Members</h3>
                {users.map(user => (
                    <div key={user._id}>
                        <input id={`${user.username}`} type="checkbox" value={user._id} onChange={() => toggleMemberSelection(user._id)}></input>
                        <label htmlFor={`${user.username}`}>{user.username}</label>
                    </div>
                ))}
                <button onClick={handleCreateGroup}>Create Group</button>

            </div>

            </div>
        </div>
    )
}