// tribute to https://github.com/vzhou842/example-.io-game 

const ASSET_NAMES = [
  'seal.svg',
  'lion.svg',
  'cat.svg'
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];

export const getAssetNames = () => ASSET_NAMES;