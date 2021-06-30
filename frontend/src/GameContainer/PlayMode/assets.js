// tribute to https://github.com/vzhou842/example-.io-game
// svg source: https://www.flaticon.com/
import axios from "axios";
import SealIcon from "../../assets/seal.svg";
import LionIcon from "../../assets/lion.svg";
import CatIcon from "../../assets/cat.svg";
import StarIcon from "../../assets/star.svg";

const ASSET_NAMES = ["seal.svg", "lion.svg", "cat.svg"];
const ALL_ASSET_NAMES = ["seal.svg", "lion.svg", "cat.svg", "star.svg"];

const mapName2Path = {
  "seal.svg": SealIcon,
  "lion.svg": LionIcon,
  "cat.svg": CatIcon,
  "star.svg": StarIcon,
};

const assets = {};

const downloadPromise = Promise.all(ALL_ASSET_NAMES.map(downloadAsset));

/** @param {keyof mapName2Path} name */
async function downloadAsset(name) {
  const image = new Image();
  let imageSrc = mapName2Path[name];
  if (imageSrc.endsWith(".svg")) {
    const resp = await axios.get(mapName2Path[name]);
    const doc = new DOMParser().parseFromString(resp.data, "text/xml");
    const svgElem = doc.getElementsByTagName("svg")[0];
    svgElem.setAttribute("width", "48px");
    svgElem.setAttribute("height", "48px");
    const b64Svg = btoa(new XMLSerializer().serializeToString(svgElem));
    imageSrc = "data:image/svg+xml;base64," + b64Svg;
  }
  await new Promise((resolve) => {
    image.onload = () => resolve();
    image.src = imageSrc;
  });
  assets[name] = image;
}

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];

export const getAssetNames = () => ASSET_NAMES;
