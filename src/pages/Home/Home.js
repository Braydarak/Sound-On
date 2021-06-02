import React, { useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import { map } from "lodash";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import "./Home.scss";
import SongsSliders from "../../components/Sliders/SongsSliders";

const db = firebase.firestore(firebase);

export default function Home(props) {
  const { playersongs } = props;
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("artist")
      .get()
      .then(response => {
        const arrayArtists = [];
        map(response?.docs, artist => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtists(arrayArtists);
      });
  }, []);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then(response => {
        const arrayAlbums = [];
        map(response?.docs, albums => {
          const data = albums.data();
          data.id = albums.id;
          arrayAlbums.push(data);
        });
        setAlbums(arrayAlbums);
      });
  }, []);

  useEffect(() => {
    db.collection("songs")
      .limit(10)
      .get()
      .then(response => {
        const arraySongs = [];
        map(response?.docs, songs => {
          const data = songs.data();
          data.id = songs.id;
          arraySongs.push(data);
        });
        setSongs(arraySongs);
      });
  }, []);
  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Ultimos Artistas"
          data={artists}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Ultimos Albums"
          data={albums}
          folderImage="albums"
          urlName="albums"
        />
        <SongsSliders title="Ultimas Canciones" data={songs} playersongs={playersongs}/>
      </div>
    </>
  );
}
