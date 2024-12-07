import io from 'socket.io-client'
let socket;

const creteSocket = () => {
    return io("http://localhost:8080",{
        // transports:['websocket'],
        // query:{userId : parseData.user.id},
        reconnection:true,
        reconnectionAttempts:Infinity,
        reconnectionDelay:2000,
        reconnectionDelayMax:5000,
        timeout:20000,
    });
}
export const initializeSocket = () => {
    const users = localStorage.getItem('frontData');
    // console.log(users);
    if(!users) {
        console.error("NO user data found")
        return null;
    }
    if(!socket) {
        socket = creteSocket();

        socket.on('connect',() => {
            const users = localStorage.getItem('frontData');
            if(users) {
                let parseData = JSON.parse(users)
                // console.log(`Socket connected, ${socket.id}`)
                socket.emit("addNewUser",parseData.user.id)
            }
        });

        socket.on('reconnect',() => {
            console.log(`Successfully reconnect`)
            const users = localStorage.getItem('frontData');
            if(users) {
                let parseData = JSON.parse(users)
                console.log(`Socket connected, ${socket.id}`)
                socket.emit("addNewUser",parseData.user.id)
            }
        });

        socket.on('reconnect_attempt',(attemptNumber) => {
            console.log(`Reconnection attempt #${attemptNumber}`)
        });

        socket.on('reconnect_error',(error) => {
            console.log(`Reconnection failed`,error)
        });

        socket.on('reconnect_failed',() => {
            console.log(`Reconnection failed`)
        });
    }

    return socket;
}

export const getSocket = () => {
    if(!socket) {
        socket = initializeSocket();
    }
    return socket;
};