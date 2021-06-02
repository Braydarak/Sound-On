import React from "react";
import { Table, Icon } from "semantic-ui-react";
import { map } from "lodash";

import "./ListSongs.scss";

export default function ListSongs(props) {
  const { songs, albumImage, playersongs } = props;

  return (
    <Table inverted className="list-songs">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Titulo</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
          {map(songs, song => (
              <Song key={songs.id} songs={song} albumImage={albumImage} playersongs={playersongs}/>
          ))}
      </Table.Body>
    </Table>
  );
}

function Song(props) {
  const { songs, albumImage, playersongs } = props;

  const onPlay = () => {
      playersongs(albumImage, songs.name, songs.fileName)
  }

  return (
    <Table.Row onClick={onPlay}>
      <Table.Cell collapsing>
        <Icon name="play circle outline" />
      </Table.Cell>
      <Table.Cell>{songs.name}</Table.Cell>
    </Table.Row>
  );
}
