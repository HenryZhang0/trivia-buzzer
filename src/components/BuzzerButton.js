
const BuzzerButton = ({ onBuzz, buzzed}) => {
  let color = buzzed? "red":"green"
    return (
      
    <button onClick={() =>onBuzz()} style={{ backgroundColor:color }} className="buzzerbtn">
        {buzzed?"Buzzed":"Buzz"}
    </button>
  );
};


export default BuzzerButton;
