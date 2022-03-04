import styled from 'styled-components';
import {Router, useRouter} from 'next/router';
import { LightColors, ThemeConfig } from '@/utils/ThemeConfig';
import { v4 as uuidv4 } from 'uuid';

import NavigationBar from '@/components/NavigationBar';
import AccountCard from '@/components/AccountCard';
import FavCard from '@/components/FavCard';

import { IoMdFunnel } from 'react-icons/io';

import axios from 'axios';
import qs from 'qs';
import { useEffect, useState, useRef } from 'react';

import {
  useTheme,
  useGenre, 
  useScore, 
  useEpisodes, 
  useSortKey, 
  useSortType,
  useSearch,
  useData,
  useYourList
} from '@/utils/ScoutThemeProvider';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const Body = styled.div`
  width: 1265px;
  height: 735px;
  display: flex;
  justify-content: space-between;
  padding: 55px;
  border: 1px solid;

border-image-source: radial-gradient(69.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%),
radial-gradient(60% 51.57% at 50% 50%, #0938DF 0%, rgba(9, 56, 223, 0) 100%),
radial-gradient(54.8% 53% at 50% 50%, #151515 0%, rgba(21, 21, 21, 0) 100%);

background: linear-gradient(152.97deg, rgba(42, 76, 198, 0) 0%, rgba(246, 119, 79, 0.2) 100%);
border-radius: 16px;
`;

const DarkenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props=>props.darkz};
  opacity: ${props=>props.darkop};
  transition: opacity 0.5s;
`;

let timer = null;

const TestPage = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const {theme} = useTheme();
  const {data, setData} = useData();
  const {genre} = useGenre();
  const {score} = useScore();
  const {episodes} = useEpisodes();
  const {sortKey} = useSortKey();
  const {sortType} = useSortType();
  const {search, setSearch} = useSearch();
  const {yourList, setYourList} = useYourList();

  useEffect(()=>{
    const GetAnime = async()=>{
      const result = await axios.get("/api/anime");
      console.log(result.data);
      setData(result.data);
    }

    GetAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inputFilter = async (txt) => {
    setSearch(txt)
    console.log(search);
    if(timer){
      clearTimeout(timer);
      timer = null;
    }

    if(timer === null) {
      timer = setTimeout(async ()=>{
        console.log('async call');

        console.log(genre);

        const res = await axios.get("/api/anime", {
          params: {
            txt:txt,
            genreFilter: genre,
            scoreFilter: score,
            episodeFilter: episodes,
            sortKeyFilter: sortKey,
            sortTypeFilter: sortType
          },

          paramsSerializer: params => {
            
            return qs.stringify(params, { arrayFormat: "repeat"})
          }
        })

        setData(res.data);
        timer = null;
      }, 1000)
    }
  }

  const SettingsAppear = () => {
    setModalVisible(true);
  }

  const SettingsExit = () => {
    setModalVisible(false);
  }

  const AddAnimeToYourList = (checked, obj) => {
    //adds anime to global state yourList
    //func takes 2 params, checked on in future clicked and the mapped data json object itself
    console.log(checked, obj);
    // if its checked, add to yourlist, if unchecked, delete from yourlist
    if(checked){
      const new_Anime = {
        ...yourList
      };

      new_Anime[obj.uid] = obj;
      setYourList(new_Anime);
      alert("added" + obj.title + "to your list"); //replace with modal?
    } else {
      const new_Anime = {
        ...yourList
      };

      delete new_Anime[obj.uid];
      setYourList(new_Anime);
      alert("removed" + obj.title + "from your list"); //replace with modal?
    }
  }

  return (
    <Page>
      <DarkenBackground 
        darkz = {modalVisible === true ? 5 : -5}
        darkop = {modalVisible === true ? 1 : 0}
        onClick = {SettingsExit}
      />
      <NavigationBar 
        onSearchType={(e)=>{inputFilter(e.target.value)}}
        onFilterClick={SettingsAppear}
        onYourListClick={()=>router.push(`./yourlist/${uuidv4()}`)}
      />
      <Body>
      <AccountCard />
        <FavCard />
        <FavCard />
        <FavCard />
        <FavCard />
        <FavCard />
      </Body>
    </Page>
  )
}

export default TestPage;
