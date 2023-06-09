import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import AllPosts from "./AllPosts";
import { UserContext } from "./App";
import { CreatePost } from "./CreatePost";
import Login from "./Login";
import { PostView } from "./Post";

export default function MessageBoard(){
    const userProfile = useContext(UserContext);
    return (
        <div className="message-board-container">
            <Link to="/message-board/1">
                <h2 className="message-board-header-link text-5xl text-center mb-1">Bienvenue sur Supaship !!</h2>
                <h2>Tableau de bord des Messages</h2>
            </Link>
            {userProfile.session ? (
                <>
                    {/* <CreatePost/> */}
                    {/* <PostView/> */}
                    {/* <AllPosts/> */}
                </>
            ) : (
                <h2 className="message-board-login-message" data-e2e="message-board-login">
                    Yo Dawg. Tu dois <Login /> pour joindre les discussion.
                </h2>
            )}
            <Outlet/>
        </div>
    );
}