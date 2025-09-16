import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import UserProvider from "./context/userContext"
import Landing from "./pages/Landing"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
function App() {
  return (
    <>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
        </Routes>
      </Router>
    </UserProvider>
    </>
  )
}

export default App
