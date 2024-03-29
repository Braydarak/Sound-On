import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast, Toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";

import "./LoginForm.scss";

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

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

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(response => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);

          if (!response.user.emailVerified) {
            toast.warning("Para poder ingresar debes verificar la cuenta.");
          }
        })
        .catch(err => {
          handlerErrors(err.code);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="login-form">
      <h1>Inicia sesion.</h1>
      <h2>Que estas esperando?</h2>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <input
            type="text"
            name="email"
            placeholder="Correo Electronico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, Introduzca un mail valido.
            </span>
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
            <span className="error-text">Contraseña Invalida.</span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Iniciar Sesion
        </Button>
      </Form>
      {!userActive && (
        <ButtonResetSendEmailVerification
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}
      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿No Tienes Cuenta?{" "}
          <span onClick={() => setSelectedForm("register")}>
            Registrarse Gratis
          </span>
        </p>
      </div>
    </div>
  );
}

function ButtonResetSendEmailVerification(props) {
  const { user, setIsLoading, setUserActive } = props;

  const resendVerificationEmail = () => {
    user
      .sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado el mail de verificacion.");
      })
      .catch(err => {
        handlerErrors(err.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
      });
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el mail de verificacion puedes volver a enviarlo
        haciendo click <span onClick={resendVerificationEmail}> aqui.</span>
      </p>
    </div>
  );
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("El usuario o la contraseña son incorrectos.");
      break;
    case "auth/too-many-requests":
      toast.warning(
        "Has enviado muchos emails de verificacion en poco tiempo."
      );
      break;
    case "auth/user-not-found":
      toast.warning("El usuario o la contraseña son incorrectos.");
      break;
    default:
      break;
  }
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
  };
}
