import { useState } from "react";
import { Game } from "./Game";
import { Home } from "./Home";

export default function App() {
  const [openGame, setOpenGame] = useState(false);
  return (
    <>
      {openGame ? (
        <Game onCloseGame={() => setOpenGame(false)} />
      ) : (
        <Home onOpenGame={() => setOpenGame(true)} />
      )}
    </>
  );
}
