import React, { useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { size, map } from "lodash";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./SongsSliders.scss";

const db = firebase.firestore(firebase);

export default function SongsSliders(props) {
  const { title, data, playersongs } = props;

  const settings = {
    dats: false,
    infinite: true,
    slidersToShow: 1,
    slidersToScroll: 2,
    centerMode: true,
    className: "songs-sliders__list",
  };

  if (size(data) < 5) {
    return null;
  }

  return (
    <div className="songs-sliders">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, item => (
          <Song key={item.id} item={item} playersongs={playersongs} />
        ))}
      </Slider>
    </div>
  );
}

function Song(props) {
  const { item, playersongs } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(item.album)
      .get()
      .then(response => {
        const albumTemp = response.data();
        albumTemp.id = response.id;
        setAlbum(albumTemp);
        getImage(albumTemp);
      });
  }, [item]);

  const getImage = album => {
    firebase
      .storage()
      .ref(`albums/${album.banner}`)
      .getDownloadURL()
      .then(bannerUrl => {
        setBanner(bannerUrl);
      });
  };

  const OnPlay = () => {
    playersongs(banner, item.name, item.fileName);
  };

  return (
    <div className="songs-sliders__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={OnPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/albums/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}
