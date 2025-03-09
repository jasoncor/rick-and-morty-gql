import "./App.css";
import { CharacterList } from "./components/CharacterList";

function App() {
  return (
    <div className="container mx-auto mb-[20px] w-[1000px]">
      <h1 className="text-4xl font-bold text-center mb-20">
        Rick and Morty Characters
      </h1>
      <CharacterList />
    </div>
  );
}

export default App;
