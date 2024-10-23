import './App.css';
import Salute from './components/Salute';
import HobbiesList from './components/HobbiesList';
import FriendList from './components/FriendsList';

function App() {
  return (
    <>
      <Salute salute="Oliveira" />
      <HobbiesList hobbies={['Playing', 'Reading', 'Coding']} climbing="I Like to Climb" />
      <FriendList friends={['A', 'B', 'C']} fromWhere="Tokyo" friends2={['D', 'F', 'G']} fromWhere2="Porto" />
    </>
  );
}

export default App;
