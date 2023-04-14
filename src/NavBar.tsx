import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App";

export default function NavBar() {
    const {session} = useContext(UserContext);
  return (
    <>
      <nav className="nav-bar">
        <Link className="nav-log-link" to="/">
          <img
            id="logo"
            className="nav-logo"
            src="https://supaship.io/supaship_logo_with_text.svg"
            alt="logo"
          />
        </Link>

        <ul className="nav-right-list">
          <li className="nav-message-board-list-item">
            <Link to="/1" className="nav-message-board-link">
                Tableau de bord des Messages
            </Link>
          </li>
          <li className="nav-auth-item">
            {session?.user ? 'utilisateur connecté' : 'utilisateur non connecté'}
          </li>
        </ul>
      </nav>
    </>
  );
}
