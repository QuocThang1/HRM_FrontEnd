import Header from "../components/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer.jsx";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
