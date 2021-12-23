import { useState } from "react";
import Button from "./Button"
const AddTask = ({ ingame, onBackground, onKick, onReset }) => {
  const [text, setText] = useState("");
  const [background, setBackground] = useState("");
  const [reminder, setReminder] = useState(false);
  const [day, setDay] = useState("");
  const [toggle, setToggle] = useState(false);
  const [ngame, x] = useState(ingame)
  const onSubmit = (e) => {
    e.preventDefault()
  }

  const kicker = () => {
    setToggle(!toggle);
    onKick();
  }
  const bg = () => {
    onBackground(background)
  }
  return (
    <form className="add-form" onSubmit = {onSubmit}>
        {false && <label style = {{display:"flex",justifyContent:"center", fontWeight:"bold"}}>Settings</label>}
        <div className="settings">
        <div className="settingblock">
          <div className="form-control">
            <input
              type="text"
              placeholder="image url"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
          <button className="btn btn-block" onClick={bg}>Change Background</button>
        </div>
        <div className="settingblock">
          <div className="form-control">
            <input
              type="text"
              placeholder="time in seconds"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button className="btn btn-block" onClick={onBackground}>Apply</button>
        </div>
        <div className="settingblock">
          <Button className = "settings" color={toggle?"red":"green"} text={toggle?"Hide Kick":"Kick Player"} onClick={kicker} />
        </div>
        <div className="settingblock">
          <button className="btn btn-block" onClick={onReset}>Reset Buzzers</button>

        </div>

    </div>
      </form>
  );
};

export default AddTask;
