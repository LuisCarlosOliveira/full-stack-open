import "./App.css";
import Salute from "./components/Salute";
import HobbiesList from "./components/HobbiesList";
import FriendList from "./components/FriendsList";
import Profile from "./components/Profile";
import Counter from "./components/Counter";
import ToggleMessage from "./components/ToggleMessage";
import ClickCounter from "./components/ClickCounter";
import DynamicStepCounter from "./components/DynamicStepCounter";
import FormSubmission from "./components/FormSubmission";
import VoteCounter from "./components/VoteCounter";
import ThemeToggle from "./components/ThemeToggle";
import LiveText from "./components/LiveText";
import WordCounter from "./components/WordCounter";

function App() {
  return (
    <>
      <WordCounter />
      <LiveText />
      <ThemeToggle />
      <VoteCounter />
      <FormSubmission />
      <DynamicStepCounter />
      <ClickCounter />
      <Counter />
      <ToggleMessage />
      <Salute salute="Oliveira" />
      <HobbiesList
        hobbies={["Playing", "Reading", "Coding"]}
        climbing="I Like to Climb"
      />
      <FriendList
        friends={["A", "B", "C"]}
        fromWhere="Tokyo"
        friends2={["D", "F", "G"]}
        fromWhere2="Porto"
      />
      <Profile
        name="Oliveira"
        age={25}
        subtitle={"Abilities"}
        abilities={["JavaScript", "React", "Node"]}
      />
    </>
  );
}

export default App;
