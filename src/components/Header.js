import PropTypes from "prop-types";
import Button from "./Button";
import { useLocation } from 'react-router-dom'

const Header = ({ ingame, title, onAdd, showAdd, onBuzz, buzzed }) => {
  const location = useLocation()

  return (
    <header className="header">
      {ingame && <h1 className = "mute">Mute</h1>}
      <h1 className = "title" style={{color:"white"}}>{title}</h1>
      {ingame &&
      <div className = "settings-button"><Button color={showAdd?"red":"green"} text={showAdd?"Close":"Settings"} onClick={onAdd} /> </div>}
    </header>
  );
};

Header.defaultProps = {
  title: "Task Tracker",
};

Header.propTypes = {
  title: PropTypes.string,
};

// const headingStyle = {
//     color:'blue',
//     backgroundColor:'red'
// }

export default Header;
