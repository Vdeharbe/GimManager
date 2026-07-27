import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Socios from "./pages/Socios";

function App() {
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />
        <Socios />
      </div>
    </>
  );
}

export default App;
