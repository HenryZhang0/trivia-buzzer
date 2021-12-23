import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import PlayerGroup from "./components/PlayerGroup";
import BuzzerButton from "./components/BuzzerButton";
import Join from "./components/Join";
import io from "socket.io-client";
import Button from "./components/Button";
const socket = io("http://localhost:4000");

socket.emit("hi");

let roomName = "";

let x = 0;

function App() {
  const history = useHistory();
  const [showAddTask, setShowAddTask] = useState(false);
  const [ingame, setIngame] = useState(false);
  const [buzzed, setBuzzed] = useState(false);
  let gameState = {};
  const [blueTeam, setBlueTeam] = useState([]);
  const [redTeam, setRedTeam] = useState([]);
  const [background, setBackground] = useState("");
  const [firstBuzz, setFirstBuzz] = useState(null);
  const [redScore, setRedScore] = useState(null);
  const [blueScore, setBlueScore] = useState(null);
  const [showKick, setShowKick] = useState(false);

  const changeSetting = () => {
    return;
  };

  const toggleBuzz = () => {
    return;
  };

  // BUZZER
  const buzz = async () => {
    console.log("buzzerd");
    if (buzzed) return;
    let d = new Date();
    const time = d.getTime();

    socket.emit("buzz", roomName, time);
    setBuzzed(true);
  };

  const createRoom = (code, name) => {
    socket.emit("new-room", code, name);
    console.log("joined room");
  };
  const joinRoom = (code, name) => {
    socket.emit("join-room", code, name, (res) => {
      if (res.status) {
      } else {
        alert("room does not exist");
        console.log("room does not exist");
      }
    });
  };
  useEffect(() => {}); //UNUSED (used to have (socket enter-room) in here)

  socket.on(
    "enter-room",
    (code, state) => {
      roomName = code;
      setIngame(true);
      //history.push("/"+code);
      console.log("entered room");

      socket.on("gameState", handleGameState);
      function handleGameState(data) {
        gameState = data;
        console.log("state change");
        updateGame();
      }

      socket.on("resetBuzzer", () => {
        setBuzzed(false);
      });

      socket.on("changebg", (url) => {
        console.log("recieved image");
        setBackground(url);
      });

      socket.on("youbeenkicked", () => {
        console.log("got kicked");
        setIngame(false);
        //window.location.href="/";
        //alert("You got bullied out of a lobby. Kicking is mean, go tell them that.");
      });
    },
    [socket]
  );

  function updateGame() {
    x += 1;
    console.log(x, " updating game state ", gameState);

    let lowest = 9999999999999999;

    gameState.forEach((element) => {
      if (element.time && element.time < lowest) {
        lowest = element.time;
      }
      setFirstBuzz(lowest);
      console.log(lowest);
    });

    setBlueTeam(
      gameState.filter((player) => {
        if (player.team === 1) {
          return true;
        }
        return false;
      })
    );
    setRedTeam(
      gameState.filter((player) => {
        if (player.team === 0) {
          return true;
        }
        return false;
      })
    );
    let rscore = 0;
    let bscore = 0;
    gameState.forEach((player) => {
      rscore = rscore;
      bscore = bscore;
      if (player.team == 0) {
        rscore += player.points;
      } else if (player.team == 1) {
        bscore += player.points;
      }
    });
    setRedScore(rscore);
    setBlueScore(bscore);
  }

  const kickPlayer = (id) => {
    socket.emit("kickPlayer", id);
  };
  function changeTeam(team) {
    console.log("changing team");
    socket.emit("changeTeam", roomName);
  }
  function reset() {
    console.log("resetting buzzers");
    socket.emit("reset", roomName);
  }
  function changeBackground(link) {
    console.log("bg");
    setBackground(link);
    socket.emit("changebg", roomName, link);
  }
  function showKicker() {
    setShowKick(!showKick);
  }

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundAttachment: "fixed",
      }}
    >
      <Router>
        <Route
          path="/test/:pp"
          render={(props) => (
            <>
              <div>PEEEEEEEEEEEE {props.match.params.pp}</div>
            </>
          )}
        />
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          title={"Trivia Buzzer"}
          showAdd={showAddTask}
          onBuzz={buzz}
          buzzed={buzzed}
          ingame={ingame}
        />
        {showAddTask && (
          <AddTask
            onAdd={changeSetting}
            onBackground={changeBackground}
            onReset={reset}
            onKick={showKicker}
          />
        )}

        <Route
          path="/:link?"
          exact
          render={(props) => (
            <>
              {!ingame && <Join onJoin={joinRoom} onCreate={createRoom} link={props.match.params.link}/>}

              {ingame ? (
                <div className="grid-container">
                  <BuzzerButton onBuzz={buzz} buzzed={buzzed} />

                  <div className="container left">
                    <h2 style={{ color: "red", cursor: "pointer" }}>
                      Red Team
                    </h2>
                    {redTeam.length > 0 ? (
                      <PlayerGroup
                        players={redTeam}
                        onDelete={kickPlayer}
                        showKick={showKick}
                        firstBuzz={firstBuzz}
                      />
                    ) : (
                      "No players"
                    )}
                    <h3 style={{ color: "red" }}>Score: {redScore}</h3>
                  </div>
                  <div className="container right">
                    <h2 style={{ color: "blue", cursor: "pointer" }}>
                      Blue Team
                    </h2>
                    {blueTeam.length > 0 ? (
                      <PlayerGroup
                        players={blueTeam}
                        onDelete={kickPlayer}
                        showKick={showKick}
                        firstBuzz={firstBuzz}
                      />
                    ) : (
                      "No players"
                    )}
                    <h3 style={{ color: "blue" }}>Score: {blueScore}</h3>
                  </div>
                  <button className="switchteams" onClick={changeTeam}>
                    switch team
                  </button>
                </div>
              ) : (
                <div>"nothing"</div>
              )}
            </>
          )}
        />
        <Route path="/join" component={Join} />
        <Route path="/about" component={About} />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
