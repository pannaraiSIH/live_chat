import bear from "../assets/images/bear.png";
import dinosaur from "../assets/images/dinosaur.png";
import dragonfly from "../assets/images/dragonfly.png";
import ladybug from "../assets/images/ladybug.png";

export default function getProfileImage(avatar) {
  let image = null;
  switch (avatar) {
    case "bear":
      image = bear;
      break;
    case "dinosaur":
      image = dinosaur;
      break;
    case "dragonfly":
      image = dragonfly;
      break;
    case "ladybug":
      image = ladybug;
      break;
    default:
      break;
  }
  return image;
}
