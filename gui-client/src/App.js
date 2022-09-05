import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Header from './components/navbar/Header';
import Url from './components/Url/Url';
import Image from './components/Image/Image'


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/image' element={<Image/>} />
        <Route path='/' element={<Url/>} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
