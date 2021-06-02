import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";
import "firebase/storage";

import "./BannerHome.scss";

export default function BannerHome() {
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref("others/banner-home.png")
      .getDownloadURL()
      .then(Url => {
        setBannerUrl(Url);
      }).catch(() => {
      })
  }, []);

  if (!bannerUrl) {
    return null;
  }

  return (
    <div
      className="banner-home"
      style={{ backgroundImage: `url('${bannerUrl}')`}}
    />
  );
}
