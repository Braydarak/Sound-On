import React from "react";
import { Switch, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Artist from "../pages/Artist";
import Artists from "../pages/Artists";
import Album from "../pages/Album";
import Albums from "../pages/Albums"

export default function Routes(props) {
  const { user, setReloadApp, playersongs } = props;

  return (
    <switch>
      <Route path="/" exact>
        <Home playersongs={playersongs}/>
      </Route>
      <Route path="/artists" exact>
        <Artists />
      </Route>
      <Route path="/artist/:id" exact>
        <Artist  playersongs={playersongs} />
      </Route>
      <Route path="/Albums" exact>
        <Album />
      </Route>
      <Route path="/Albums/:id" exact>
        <Albums playersongs={playersongs} />
      </Route>
      <Route path="/settings" exact>
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </switch>
  );
}
