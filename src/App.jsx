import './App.css'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login'
import Register from './components/Register'

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
