import Subtitle from "./Subtitle";
import AbilityList from "./AbilityList";

function Profile(props) {
  return (
    <div>
      <h1>Profile</h1>
      <p>
        Name: {props.name}
      </p>
      <p>
        Age: {props.age}
      </p>
        <Subtitle subtitle={props.subtitle} />
        <AbilityList abilities={props.abilities} />
    </div>
  );
}

export default Profile;