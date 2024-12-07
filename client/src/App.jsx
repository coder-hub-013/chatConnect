import React, { useEffect } from 'react'
// import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Login/SignupPage';
import Chat from './pages/Chats/Chat';
import SearchUser from './components/SearchUser';
import ChatMessage from './pages/Chats/ChatMessage';
import PrivateRoute from './components/PrivateRoute';
import SomethingNew from './SomethingNew/SomethingNew';
import VoiceRecorder from './VoiceRecorder';
// import { ChatProvider } from './components/ChatProvider';

function App() {

  return(
          <div className='App'>
                {/* <ChatProvider> */}
                <Router>
                      <Routes>

                            <Route path='/' element={<Home></Home>}></Route>
                            <Route path='/login' element={<LoginPage></LoginPage>}></Route>
                            <Route path='/signup' element={<SignupPage></SignupPage>}></Route>


                            <Route element={<PrivateRoute></PrivateRoute>}>
                              <Route path='/chat' element={<Chat></Chat>}></Route>
                              <Route path='/chat/:id/messages' element={<ChatMessage></ChatMessage>}></Route>
                            </Route>


                      </Routes>
                  </Router>
                {/* </ChatProvider> */}
          </div>

          // // <SearchUser></SearchUser>

          // <SomethingNew></SomethingNew>

          // <VoiceRecorder></VoiceRecorder>

  )
}

export default App;


