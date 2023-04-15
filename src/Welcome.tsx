import { useContext, useState, useMemo } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import { supaClient } from "./supa-client";


export async function welcomeLoader(){
    const {
        data: {user},
    } = await supaClient.auth.getUser();
    if(!user){
        return redirect("/");
    }
    const {data} = await supaClient
    .from("user_profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();
    if(data?.username){
        return redirect("/");
    }
    return null;
}

export default function Welcome(){
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [serverError, setServerError] = useState("");
    const [formIsDirty, setFormIsDirty] = useState(false);
    const invalidString = useMemo(()=> validateUsername(userName), [userName]);
    return (
        <Dialog allowClose={false} open={true} contents={
            <>
                <h2 className="welcome-header">Bienvenue sur Supaship !!</h2>
                <p className="text-center">
                    Commençons par crée votre nom d'utilisateur
                </p>
                <form className="welcome-name-form" onSubmit={(event)=>{
                    event.preventDefault();
                    supaClient
                    .from("user_profiles")
                    .insert([
                        {
                            user_id: user.session?.user.id || "",
                            username: userName,
                        },
                    ])
                    .then(({error}) => {
                        if(error){
                            console.log(error);
                            setServerError(`Nom d'utilisateur "${userName}" est déjà pris`);
                        } else {
                            const target = localStorage.getItem("returnPath") || "/";
                            localStorage.removeItem("returnPath");
                            navigate(target);
                        }
                    });
                }}
                >
                <input name="username" placeholder="Username" onChange={({ target }) => {
                    setUserName(target.value);
                    if(!formIsDirty){
                        setFormIsDirty(true);
                    }
                    if(serverError){
                        setServerError("");
                    }
                }}
                className="welcome-name-input"></input>
                {formIsDirty && (invalidString || serverError) && (
                    <p className="welcome-form-error-message validation-feedback">
                        {serverError || invalidString}
                    </p>
                )}
                <p className="text-center">
                    C'est le nom que les gens vont voir dans le tableau de bord des message
                </p>
                <button className="welcome-form-submit-button" type="submit" disabled={invalidString != null}>
                    Envoyer
                </button>
                </form>
            </>
        }
        />
    );
}

function validateUsername(username: string): string | undefined {
    if(!username){
        return "Username is required";
    }
    const regex = /^[a-zA-Z0-9_]+$/;
    if(username.length<4) {
        return "Username must be at least 4 characters long";
    }
    if(username.length>14) {
        return "Username must be less than 14 characters long";
    }
    if(!regex.test(username)){
        return "Username can only contain letters, numbers, and underscores";
    }
    return undefined;
}