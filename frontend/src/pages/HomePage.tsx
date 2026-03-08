import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>MeetNow</h1>
      <p>A simple dating and matching site MVP for demo.</p>
      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>
          Login
        </Link>
        <Link to="/register">Register</Link>
      </div>
    </main>
  );
}

export default HomePage;

