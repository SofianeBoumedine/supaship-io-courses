import { useParams } from "react-router-dom";

export default function AllPosts() {
    const {pageNumber} = useParams();
    return <h2>Tout les posts; Page: {pageNumber}</h2>;
}