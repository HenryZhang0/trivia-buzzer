import Player from './Player'
import Button from './Button'
const PlayerGroup = ({ players, onDelete, showKick, firstBuzz}) => {
  return (
    <>
      {players.map((player, index) => (
        <Player key={index} player={player} onDelete={onDelete} firstBuzz = {firstBuzz} showKick = {showKick} />
      ))}
    </>
  )
}

export default PlayerGroup