import React, { useState } from "react";
import { Grid, Icon, Progress, Input, Image } from "semantic-ui-react";
import ReactPlayer from "react-player";

import "./Player.scss";

export default function Player(props) {
  const { songData } = props;
  const [playing, setPlaying] = useState(false);
  const [playerSeconds, setPlayerSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [volumen, setVolumen] = useState(0.3);

  const onStart = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = data => {  
    setPlayerSeconds(data.playedSeconds);
    setTotalSeconds(data.loadedSeconds);
  };

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          <Image src={songData?.image} />
          {songData?.name}
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            {playing ? (
              <Icon onClick={onPause} name="pause circle outline" />
            ) : (
              <Icon onClick={onStart} name="play circle outline" />
            )}
          </div>
          <Progress
            progress="value"
            value={playerSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            label={<Icon name="volume up" />}
            min={0}
            max={1}
            step={0.01}
            type="range"
            name="volume"
            onChange={(e, data) => setVolumen(data.value)}
            value={volumen}
          />
        </Grid.Column>
      </Grid>

      <ReactPlayer
        className="react-player"
        url={songData?.url}
        playing={playing}
        height="0"
        width="0"
        volume={volumen}
        onProgress={e => onProgress(e)}
      />
    </div>
  );
}
