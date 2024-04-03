import logo from './logo.svg';
import './App.css';
import Missions from './pages/Missions';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Banner from './components/Banner';
import Mission from './pages/Mission';

function App() {
  return (
    <div className="App">
      <Router>
        <Banner />

        <Routes>
          <Route path='/' element={<Missions/>} />
          <Route path='/mission/:missionID' element={<Mission/>} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
