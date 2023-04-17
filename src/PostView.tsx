import { useContext, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./App";
import { getPostDetails, PostDetailData, PostPresentation, unsortedCommentsToNested } from "./Post";

export default function PostView() {
    const userContext = useContext(UserContext);
    const params = useParams() as {postId: string};
    const [postDetailData, setPostDetailData] = useState<PostDetailData>({
        post: null,
        comments: [],
    });
    const [bumper, setBumper] = useState(0);
    useEffect(()=> {
        getPostDetails({params, userContext}).then((newPostDetailData) => {
            if(newPostDetailData){
                setPostDetailData(newPostDetailData);
            }
        });
    }, [userContext, params, bumper]);
    const nestedComments = useMemo(
        () => unsortedCommentsToNested(postDetailData.comments),
        [postDetailData]
    );
    return (
        <PostPresentation 
         postDetailData={postDetailData}
         userContext={userContext}
         setBumper={setBumper}
         bumper={bumper}
         nestedComments={nestedComments}
        />
    );
}