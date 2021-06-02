import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { map } from "lodash";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initialValueForm());
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then(response => {
        const albumArray = [];
        map(response?.docs, album => {
          const data = album.data();
          albumArray.push({
            key: album.id,
            value: album.id,
            text: data.name,
          });
        });
        setAlbums(albumArray);
      });
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setFile(file);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const uploadSongs = fileName => {
    const ref = firebase.storage().ref().child(`songs/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning("El nombre la canción y el album son obligatorios.");
    } else if (!file) {
      toast.warning("La canción es obligatoria.");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadSongs(fileName)
        .then(() => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success("Canción subida correctamente.");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al subir la canción.");
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error al subir la canción");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setAlbums([]);
  };

  return (
    <div>
      <Form className="add-song-form" onSubmit={onSubmit}>
        <Form.Field>
          <Input
            placeholder="Nombre de la canción"
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Selecciona un albúm"
            search
            selection
            lazyLoad
            options={albums}
            onChange={(e, data) =>
              setFormData({ ...formData, album: data.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <div className="song-upload" {...getRootProps()}>
            <Input {...getInputProps()} />
            <Icon name="cloud upload" className={file && "load"} />
            <div>
              <p>
                Arrastra tu canción <span>aquí</span>.
              </p>
              {file && (
                <p>
                  Canción subida: <span>{file.name}</span>
                </p>
              )}
            </div>
          </div>
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Subir canción
        </Button>
      </Form>
    </div>
  );
}

function initialValueForm() {
  return {
    name: "",
    album: ""
  };
}
