import { FaTimes } from "react-icons/fa";

const Player = ({ player, onDelete, firstBuzz, showKick }) => {
    //console.log(player.time);
    const color = player.time? "green" : "red"
    let diff = (player.time-firstBuzz)/1000||"FIRST"
    diff = diff=="FIRST"? diff:String("+"+diff) 
  return (
    <div className="player" style={{borderLeft: `7px solid ${color}`}}>
      <h3>
        {player.name}{" "}
        {showKick?<FaTimes
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => onDelete(player.id)}
        />:""}
      </h3>
        <p>{(player.time)? diff: "No buzz"}</p>
      <p>Points: {player.points}</p>
    </div>
  );
};

export default Player;
