import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import { Link } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";

const db = firebase.firestore(firebase);

export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then(response => {
        const arrayAlbums = [];
        map(response?.docs, album => {
          const data = album.data();
          data.id = album.id;
          arrayAlbums.push(data);
        });
        setAlbums(arrayAlbums);
      });
  }, []);

  return (
    <div className="albums">
      <h1>Albums</h1>
      <Grid>
        {map(albums, album => (
          <Grid.Column key={album.id} mobilw={8} tablet={4} computer={3}>
            <Album album={album} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Album(props) {
  const { album } = props;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`albums/${album.banner}`)
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      });
  }, [album]);

  return (
    <Link to={`/albums/${album.id}`}>
      <div className="albums__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}
