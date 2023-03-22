import React, { useEffect, useState } from "react";
import { LeftMenu } from "../menu/leftMenu";
import { TopMenu } from "../menu/topMenu";
import { Slider } from "./slider";
import { GameList } from "./gameList";
import { GamesApi } from "../../services/API/games.api";
import Loader from "../../helpers/Loader/loader";
import {GameModal} from './gameModal';

import defaultImage  from '../../assets/games/default.png'

import './games.styles.scss';

export const Games = () => {

  const[games, setGames] = useState([]);
  const[error, setError] = useState({});
  const[loading, setLoading] = useState(false);
  const[isOpen, setIsOpen] = useState({}) 
  const[isOk, setIsOk] = useState(false);
  const[selectedGame, setSelectedGame] = useState(defaultImage);


  const getGames = async () => {

    setLoading(true);
  
    const header = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    try {
      let response = await GamesApi(header)
  
      setLoading(false);
  
      if(response.status === 200) {
        setGames(response.data);
        setSelectedGame(response.data[0].image)
      }
      if(response.status === 500) {
        setError({getGames:'Ups! We have a problems getting the games list'})
      }
      if(response.status === 403) {
        setError({getGames:'Ups! We found a communication problem with the server'})
      }
      if(response.status === 404) {
        setError({getGames:'Ups! We didn\'t find the correct link to get the games list'})
      }
    } catch (error) {
      setLoading(false);
      setError({getGames:'Ups! We found a communication problem with the server, we are no able to show the slider game'})
    }
  
  }

  useEffect(() => {
    getGames();
  },[isOk])

  return (
    <div>
      {(Object.entries(isOpen)).length > 0 && <GameModal isOpen={isOpen} setIsOpen={setIsOpen} isOk={isOk} setIsOk={setIsOk}  /> }
      {loading && <Loader/>}
      <TopMenu title="Games"/>
      <LeftMenu/>
      <Slider 
        games={games} 
        error={error} 
        selectedGame={selectedGame} 
        setSelectedGame={setSelectedGame}
      />
      <GameList
        games={games} 
        setIsOpen ={setIsOpen}
      />
      
    </div>
  )
  }