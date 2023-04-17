import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./App";
import { castVote } from "./cast-vote";
import { CreatePost } from "./CreatePost";
import { GetPostsResponse } from "./database.types";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";
import { usePostScore } from "./use-post-score";


interface PostData {
    id: string;
    title: string;
    score: number;
    username: string;
    user_id: string;
}

export default function AllPosts() {
    const { session } = useContext(UserContext);
    const {pageNumber} = useParams();
    const [bumper, setBumper] = useState(0);
    const [posts, setPosts] = useState<GetPostsResponse[]>([]);
    const [myVotes, setMyVotes] = useState<Record<string, "up" | "down" | undefined>>({});
    const [totalPages, setTotalPages] = useState(0);
    useEffect(()=>{
        const queryPageNumber = pageNumber ? +pageNumber : 1;
        supaClient.rpc("get_posts", {page_number: queryPageNumber}).select("*").then(({data})=>{
            setPosts(data as GetPostsResponse[]);
            if(session?.user){
                supaClient.from("post_votes").select("*").eq("user_id", session.user.id).then(({data : votesData}) => {
                    if (!votesData){
                        return;
                    }
                    const votes = votesData.reduce((acc, vote) => {
                        acc[vote.post_id] = vote.vote_type as any;
                        return acc;
                    }, {} as Record<string, "up" | "down" | undefined>);
                    setMyVotes(votes);
                });
            }
        });
        supaClient.from("posts").select("*", {count: "exact", head: true}).filter("path", "eq", "root").then(({count})=>{
            count == null ? 0 : setTotalPages(Math.ceil(count/10));
        })
    }, [session, bumper, pageNumber])
    return (
        <>
        {session && (
            <CreatePost newPostCreated={() => {
                setBumper(bumper + 1);
            }}
            />
        )}
        <div className="posts-container">
            {posts?.map((post, id)=> (
                <Post key={post.id} postData={post} myVote={myVotes?.[post.id] || undefined} onVoteSuccess={()=> {
                    setBumper(bumper+1);
                }}
                />
            ))}
        </div>
        </>
    );
}

function Post({ postData, myVote, onVoteSuccess} : {
    postData: GetPostsResponse;
    myVote: "up" | "down" | undefined;
    onVoteSuccess: () => void;
}) {
    const score = usePostScore(postData.id, postData.score);
    const {session} = useContext(UserContext);
    return(
        <div>
            <div>
                <UpVote
                direction="up"
                filled={myVote === "up"}
                enabled={!!session}
                onClick={async () => {
                    await castVote({
                        postId: postData.id,
                        userId: session?.user.id as string,
                        voteType: "up",
                        onSuccess: () => {
                            onVoteSuccess();
                        },
                    });
                }}
                />
                <p className="text-center" data-e2e="upvote-count">{score}</p>
                <UpVote
                direction="down"
                filled={myVote === "down"}
                enabled={!!session}
                onClick={async () => {
                    await castVote({
                        postId: postData.id,
                        userId: session?.user.id as string,
                        voteType: "down",
                        onSuccess: () => {
                            onVoteSuccess();
                        },
                    });
                }}
                />
            </div>
            <Link to={`/message-board/post/${postData.id}`} className="flex-auto">
                <p className="mt-4">
                    Posted By {postData.username} {timeAgo((postData as any).created_at)}{""}
                    ago
                </p>
                <h3 className="text-2xl">{postData.title}</h3>
            </Link>
        </div>
    )
}