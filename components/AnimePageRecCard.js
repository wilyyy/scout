import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import { Bookmark } from "@styled-icons/bootstrap/Bookmark";
import { BookmarkCheckFill } from "@styled-icons/bootstrap/BookmarkCheckFill";

const Container = styled.div`
    width: 200px;
    height: 275px;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    overflow: hidden;
`;

const Card = styled.div`
    width: 100%;
    height: 70px;
    background-color: #000;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 2px;
`;

const Column = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const BookmarkIcon = styled(Bookmark)`
    width: 20px;
    height: 27px;
`;

const BookmarkCheckIcon = styled(BookmarkCheckFill)`
    width: 20px;
    height: 27px;
`;

const AnimePageRecCard = ({title, genres, onFavClick}) => {
    const [icon, setIcon] = useState(false);

    const ClickFav = () => {
        setIcon(!icon);
        onFavClick();
    }
    
    return (
        <Container>
            <img
                src="https://placekitten.com/200/199"
            />
            <Card>
                <Column>
                    {title}
                    <br />
                    {genres}
                </Column>
                <div onClick={ClickFav}>
                    {icon === false ? (
                            <BookmarkIcon />
                        ) : (
                            <BookmarkCheckIcon />        
                        )
                    }
                </div>
            </Card>
        </Container>
    )
}

export default AnimePageRecCard;