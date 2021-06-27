// tribute to https://github.com/vzhou842/example-.io-game
// svg source: https://www.flaticon.com/
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

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image();
    asset.onload = () => {
      assets[assetName] = asset;
      resolve();
    };
    asset.src = mapName2Path[assetName];
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];

export const getAssetNames = () => ASSET_NAMES;
