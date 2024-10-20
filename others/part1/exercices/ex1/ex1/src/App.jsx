import './App.css';
import Salute from './components/Salute';
import HobbiesList from './components/HobbiesList';

function App() {
  return (
    <>
      <Salute salute="Oliveira" />
      <HobbiesList HobbiesList={['Playing', 'Reading', 'Coding  ']} />
    </>
  );
}

export default App;
