import styled from "styled-components";
import { Router, useRouter } from "next/router";
import { LightColors, ThemeConfig } from "@/utils/ThemeConfig";
import { v4 as uuidv4 } from "uuid";

import ServerUrl from "@/utils/ServerUrl";
import NavigationBar from "@/components/NavigationBar";
import MainContentSlider from "@/components/MainContentSlider";
import SettingsModal from "@/components/SettingsModal";
import AnimeCard from "@/components/AnimeCard";

import axios from "axios";
import qs from "qs";
import { useEffect, useState, useRef } from "react";

import {
	useTheme,
	useGenre,
	useScore,
	useEpisodes,
	useSortKey,
	useSortType,
	useSearch,
	useData,
	useYourList,
} from "@/utils/ScoutThemeProvider";

const Page = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	margin-top: 20px;
`;

const BodyHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const HeaderText = styled.div`
	font-size: 24px;
`;

const AnimeCardCont = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
`;

const DarkenBackground = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: ${(props) => props.darkz};
	opacity: ${(props) => props.darkop};
	transition: opacity 0.5s;
`;

let timer = null;

const Home = () => {
	const router = useRouter();
	const [modalVisible, setModalVisible] = useState(false);
	const ref = useRef(null);

	const { data, setData } = useData();
	const { genre } = useGenre();
	const { score } = useScore();
	const { episodes } = useEpisodes();
	const { sortKey } = useSortKey();
	const { sortType } = useSortType();
	const { search, setSearch } = useSearch();
	const { yourList, setYourList } = useYourList();

	useEffect(() => {
		const GetAnime = async () => {
			const result = await axios.get("/api/anime");
			console.log(result.data);
			setData(result.data);
		};

		GetAnime();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const FullSearch = async () => {
		const res = await axios.get("/api/anime", {
			params: {
				txt: search,
				genreFilter: genre,
				scoreFilter: score,
				episodeFilter: episodes,
				sortKeyFilter: sortKey,
				sortTypeFilter: sortType,
			},

			paramsSerializer: (params) => {
				return qs.stringify(params, { arrayFormat: "repeat" });
			},
		});

		setData(res.data);
		ref.current.scrollIntoView();
	};

	const SettingsAppear = () => {
		setModalVisible(true);
	};

	const SettingsExit = () => {
		setModalVisible(false);
	};

	const AddAnimeToYourList = (checked, obj) => {
		console.log(checked, obj);
		if (checked) {
			const new_Anime = {
				...yourList,
			};

			new_Anime[obj.uid] = obj;
			setYourList(new_Anime);
			alert("added" + obj.title + "to your list"); //replace with modal?
		}
	};

	const RemoveAnime = (checked, obj) => {
		if (checked) {
			const new_Anime = {
				...yourList,
			};

			delete new_Anime[obj.uid];
			setYourList(new_Anime);
			alert("removed" + obj.title + "from your list");
		}
	};

	return (
		<Page>
			<DarkenBackground
				darkz={modalVisible === true ? 5 : -5}
				darkop={modalVisible === true ? 1 : 0}
				onClick={SettingsExit}
			/>
			<NavigationBar
				onSearchClick={FullSearch}
				onFilterClick={SettingsAppear}
				onYourListClick={() => router.push(`./yourlist/${uuidv4()}`)}
			/>
			<MainContentSlider
				titletext1="Demon Slayer"
				desctext1="After a demon attack leaves his family slain and his sister cursed, Tanjiro embarks upon a perilious journey to find a cure and avenge those he’s lost."
				bottext="Your most recently watched anime"
				curEp="7"
				totEp="12"
			/>
			<BodyHeader>
				<HeaderText>Explore</HeaderText>
			</BodyHeader>
			<SettingsModal
				tcolor={LightColors.PapayaWhip}
				ExitClick={SettingsExit}
				setScaleFactor={modalVisible ? 1 : 0.5}
				setOp={modalVisible ? 1 : 0}
				setZ={modalVisible ? 10 : -10}
			/>
			<AnimeCardCont ref={ref}>
				{data.map((el, index) => (
					<div key={index}>
						<AnimeCard
							title={el.title}
							synopsis={el.synopsis}
							episodes={el.episodes}
							img_url={el.img_url}
							score={el.score}
							onButtonClick={() => router.push(`./anime/${el.uid}`)}
							onCheckClick={
								// if(yourList[el.uid] !== undefined && yourList[el.uid] !== null)
								(onAddClick = () => {}) =>
									AddAnimeToYourList(onAddClick, el)
							}
							onUncheckClick={
								// if(yourList[el.uid] !== undefined && yourList[el.uid] !== null)
								(onDelClick = () => {}) => RemoveAnime(onDelClick, el)
							}
						/>
					</div>
				))}
			</AnimeCardCont>
		</Page>
	);
};

export default Home;
