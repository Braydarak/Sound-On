import { toast } from "react-toastify";

export default function alertsErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("La contraseña es incorrecta.");
      break;
    case "auth/email-already-in-use":
      toast.warning("El email ya esta en uso.");
      break;
    default:
      toast.warning(
        "No es posible conectarse con el servidor, Intentelo mas tarde."
      );
      break;
  }
}
