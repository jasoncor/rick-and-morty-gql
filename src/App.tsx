import "./App.css";
import { CharacterList } from "./components/CharacterList";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router basename="/rick-and-morty-gql">
      <div className="container mx-auto w-[1000px]">
        <h1 className="text-4xl font-bold text-center mb-10">
          Rick and Morty Characters
        </h1>
        <Routes>
          <Route path="/page/:page" element={<CharacterList />} />
          <Route path="/" element={<Navigate to="/page/1" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
