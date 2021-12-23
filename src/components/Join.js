import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Join = ({ onJoin, onCreate, link }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState(link);
  const history = useHistory();

  const joinRoom = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please Enter Your Name");
      return;
    }
    if (!code) {
      alert("Please Enter a Room Code");
      return;
    }
    onJoin(code, name);
    console.log("redirecting");
    history.push("/"+code);
  };

  

  const createRoom = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please Enter Your Name");
      return;
    }
    if (!code) {
      alert("Please Enter a Room Code");
      return;
    }
    onCreate(code, name);
    console.log("redirecting");
    history.push("/"+code);
  };
  return (
    <div className="container">
      <h4>JOIN A ROOM</h4>

      <form className="add-form">
        <div className="form-control">
          <label>Name</label>
          <input
            type="text"
            placeholder="Joe Mama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Room Code</label>
          <input
            type="text"
            placeholder="d33snutz"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div> 


        <button onClick = {joinRoom}  className="btn btn-block">Join Room</button>
        <button onClick = {createRoom}  className="btn btn-block">Create Room</button>
      </form>

      <Link to="/">To Room</Link>
    </div>
  );
};
export default Join;
