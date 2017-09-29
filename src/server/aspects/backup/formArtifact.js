export default function form(version) {
  const { artifact, payment } = this;

  const timestamp = new Date().getTime() / 1000 | 0;

  const artifactData = artifact::makeArtifact(timestamp);
  const infoData = this::makeInfo();
  const storageData = artifact::makeStorage();
  const paymentData = payment ? payment::makePayment() : {};

  const header = {
    signature: artifact::makeSignature(timestamp)
  };

  const result = {
    'oip-041': 'oip-041' === version && {
      artifact: {
        ...artifactData,
        info: infoData,
        storage: storageData,
        payment: paymentData
      },
      ...header
    }
  }

  return result;
}

function makePayment() {
  const { fiat, scale, tip, addresses } = this;

  return {
    fiat: fiat,
    scale: scale,
    sugTip: tip.suggested,
    tokens: {
      ...addresses
    }
  };
}

function makeInfo() {
  const { artifact, artifact: { people, licence = {} } } = this;

  if (!people) throw new TypeError('Object(People) of [artist, distributor, composers] is required.');

  return {
    title:artifact.title,
    description:artifact.description,
    year: artifact.year,
    extraInfo:{
      artist: people.artist,
      company: people.distributor,
      composers: people.composers,
      copyright: licence.copyright,
      usageProhibitions: licence.prohibitions,
      usageRights: licence.rights,
      genre: artifact.genre,
      tags: artifact.tags
    }
  };
}

function makeArtifact(date) {
  const { type, publisher } = this;

  return {
    publisher: publisher.address,
    timestamp: date,
    type
  };
}

function makeSignature(date) {
  const { fileInfo: { storage }, publisher } = this;

  return `${storage.address}-${publisher.address}-${date}`;
}

function makeFile(file) {
  if (!('pricing' in this)) throw new TypeError('Object(Pricing) of [price, cut] is required.');

  const { pricing: { price, cut }, permissions } = this;

  const fileData = {
    dname: file.names.display,
    fname:file.names.file,
    type: file.type,
    fsize: file.size,
    minPlay: price.play,
    sugPlay: price.suggested.play,
    minBuy: price.buy,
    sugBuy: price.suggested.buy,
    promo: cut.promotor,
    retail: cut.retail
  };

  if (['video', 'audio'].includes(file.type)) fileData.duration = file.duration;
  if (permissions) Object.keys(permissions).forEach(
    disallow => !disallow && fileData[`disallow${disallow}`]);

  return fileData;
}

function makeStorage() {
  const { fileInfo: { storage: { network, address }, files }  } = this;

  return {
    network: network,
    location: address,
    files: files.map(file => this::makeFile(file))
  };
}

// const defaults = {
//   people: {
//     artist: '',
//     distributor: '',
//     composers: []
//   },
//   licence: {
//     copyright: '',
//     prohibitions: '',
//     rights: ''
//   },
//   artifact: {
//     genre: '',
//     tags: []
//   }
// };

// function makeDefaults(obj) {
//   const formed = {};

//   for (let prop in obj) {
//     const objForProp = obj[prop];
//     const defaultForm = defaults[prop];

//     if (!defaultForm) {
//       console.warn(`No defaults for ${prop}`);
//       continue;
//     }

//     formed[prop] = Object.assign({}, defaultForm, objForProp);
//   }

//   return formed;
// }