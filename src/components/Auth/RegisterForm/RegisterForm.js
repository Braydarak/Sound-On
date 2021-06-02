import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast, Toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";

import "./RegisterForm.scss";

export default function RegisterForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm());
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {

    setFormError({});
    let errors = {};
    let formOk = true;

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }
    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }
    if (!formData.username) {
      errors.username = true;
      formOk = false;
    }
    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          changeUserName();
          sendVerificationEmail();
        })
        .catch(() => {
          toast.error("Error al crear la cuenta.");
        })
        .finally(() => {
          setIsLoading(false);
          setSelectedForm(null);
        });
    }
  };

  const changeUserName = () => {
    firebase.auth().currentUser.updateProfile({
      displayName: formData.username
    }).catch(() => {
      toast.error("Error al asignar el nombre de usuario.");
    })
  };

  const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      toast.success("Se ha enviado un mail de verificacion.");
    }).catch (() => {
      toast.error("Error al enviar el email de verificacion.");
    })

  }

  return (
    <div className="register-form">
      <h1>Comienza a disfrutar de la musica con un simple registro.</h1>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <input
            type="text"
            name="email"
            placeholder="Correo electronico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">Email invalido.</span>
          )}
        </Form.Field>
        <Form.Field>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            icon="eye"
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              La contraseña debe contener al menos 6 caracteles.
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            icon="user circle outline"
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">Introduzca un nombre de usuario.</span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Continue
        </Button>
      </Form>
      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}> Volver</p>
        <p>
          ¿Ya tienes Musicfy?{" "}
          <span onClick={() => setSelectedForm("login")}>Iniciar Sesion</span>
        </p>
      </div>
    </div>
  );
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}
