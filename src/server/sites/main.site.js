import Hoek from 'hoek';
import { renderApp } from 'alexandria-browser-html';
import Oip041 from 'oip-npm';
import fetch from 'node-fetch';
import litecoin from 'node-litecoin';
import * as youtube from '../aspects/stream/adapters/youtube';
import * as downloader from '../aspects/backup/downloader';
import * as ipfs from '../aspects/backup/ipfs';
import formArtifact from '../aspects/backup/formArtifact';
import florinCoinRpcConfig from './florin.config';

const oip = new Oip041(florinCoinRpcConfig);

function asyncWrap(arg) {
  const func = this;

  return new Promise((resolve, reject) => {
    func.call(null, arg, (err, value) => {
      if (!err) resolve(value);
      else reject(err);
    });
  });
}

const getClientVideo = (formats)  => formats
    .filter(({ acodec, vcodec }) => [acodec, vcodec].every(a => a !== 'none'))
    .sort((a, b) => 
        a.height > b.height &&
        a.width > b.width
      )
    .pop();

async function formRawArtifact() {
  const { 
    ipfsResult: { rootDirectoryPath, results },
    details,
    artifactFiles } = this;

  const { title, description, uploader } = details;

  const rootDirectoryHash = results.find(({ path }) => path === rootDirectoryPath).hash;

  const zeroPricing = {
    price: {
      play: 0,
      buy: 0,
      suggested: {
        play: 0,
        buy: 0
      }
    },
    cut: {
      promotor: 0,
      retail: 0
    }
  };

  const { host, port, username: user, password: pass } = florinCoinRpcConfig;
  const florinApi = new litecoin.Client({
    host, port,
    user, pass
  });
  const publisherAddress = await ::florinApi.getAccountAddress::asyncWrap('youtubexit');

  const artifact = {
    title,
    genre: 'Film & Animation',
    description: description + '.:. Uploaded via YouTubeExit.com | Saving the world\'s videos one watch at a time.',
    year: 2017,
    type: 'Video-Basic',
    publisher: {
      address: publisherAddress
    },
    pricing: zeroPricing,
    fileInfo: {
      storage: {
        address: rootDirectoryHash,
        network: 'IPFS'
      },
      files: artifactFiles
    }
  };

  return artifact;
};

async function $getThumbnail(thumbnailUrl) {
  const response = await fetch(thumbnailUrl);

  return response.buffer();
}

const getFileName = (title, ext) => `${title.split(' ').join('%20')}.${ext}`;

async function persist() {
  const { video: { $video, details, url, format } } = this;
  
  // const { $video, data: details } = await youtube.getVideo(url);
  const { extractor_key: service, id, thumbnail, title, uploader, size } = details;
  
  const $thumbnail = await $getThumbnail(thumbnail);

  const ipfsFileDescriptors = [];
  // for (const file of files) {
    const videoFileName = getFileName(title, format.ext);

    const ipfsFileDescriptor = {
      $content: $video,
      name: videoFileName
    };

    ipfsFileDescriptors.push(ipfsFileDescriptor);
  //}

  const thumbnailFileName = `thumbnail-${id}.jpg`;
  ipfsFileDescriptors.push({
    $content: $thumbnail,
    name: thumbnailFileName
  });

  const ipfsRootDirectoryPath = `exit/${service}/video/${id}`;
  const ipfsResult = {
    rootDirectoryPath: ipfsRootDirectoryPath,
    results: await ipfs.addFiles({
      root: ipfsRootDirectoryPath,
      files: ipfsFileDescriptors
    })
  };

  const duration = parseDuration(details.duration);
  const artifactFiles = [{
    names: {
      display: 'thumbnail',
      file: thumbnailFileName
    },
    type: 'Image',
    subtype: 'thumbnail',
    size: $thumbnail.length
  }, {
    names: {
      display: title,
      file: videoFileName
    },
    size: size,
    type: 'Video',
    subtype: '4k'
  }];

  console.log('artifactFiles', artifactFiles);

  const rawArtifact = await {
    ipfsResult,
    artifactFiles,
    details
  }::formRawArtifact();

  console.log('raw', JSON.stringify(rawArtifact));

  const oipArtifact = ({
    artifact: {
      ...rawArtifact,
      people: {
        artist: uploader,
        distributor: uploader
      }
    },
     payment:{  
        fiat:"USD",
        scale:"1000:1",
        maxdisc:30,
        promoter:15,
        retailer:15,
        sugTip: [],
        addresses: []
     }
  })::formArtifact('oip-041');
  console.log('artifact', JSON.stringify(oipArtifact));

  try {
    const response = await oipArtifact::publish();
    
    console.log(response);
  } catch (ex) {
    console.error('Something went wrong with OIP', ex);
  }
}

function publish() {
  const oipArtifact = this;

  return new Promise((resolve, reject) => {
    oip.publishArtifact(oipArtifact, response => {
      if (response.success) resolve(response);
      else reject(response);
    });
  });
}

function parseDuration(duration) {
  const parts = duration.split(':').reverse();
  const [seconds, minutes = 0, hours = 0] = parts;

  return seconds + minutes * 60 + hours * 60**2;
}

async function mediaRouteHandler(request, reply) {
  const { v, list, rawUrl } = request.query;

  try {

    const youtubeVideoUrl = youtube.makeUrl({ v, list });

    // const videoDetails = await youtube.getVideoDetails(youtubeVideoUrl);
    const { details: videoDetails, $video } = await youtube.getVideo(youtubeVideoUrl);
    const { title, description, thumbnail, formats } = videoDetails;
    const clientVideoFormat = getClientVideo(formats);
    const { url: directVideoUrl } = clientVideoFormat;

    console.log(JSON.stringify(videoDetails, '\t', 2));

    if ('rawUrl' in request.query) return reply(directVideoUrl);

    process.nextTick(function () {
      ({ video: {
          $video,
          url: youtubeVideoUrl,
          details: videoDetails,
          format: clientVideoFormat,
          info: {
            isPlaylist: !!list
          }
      }})::persist();
    });

    const model = {
      video: {
        title,
        poster: thumbnail,
        src: directVideoUrl,
        types: ['video/webm; codecs=vp9,vorbis', 'video/mp4']
      }
    };

    const markup = model::renderApp('/watch');

    return reply(markup);
  } catch (ex) {
    Hoek.assert(!ex, ex);
    console.error(ex);
    throw ex;
  }
}

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/playlist',
    config: {
      handler: mediaRouteHandler
    }
  });

  server.route({
    method: 'GET',
    path: '/watch',
    config: {
      handler: mediaRouteHandler
    }
  });

  server.route({
    method: 'GET',
    path: '/publisher/register',
    config: {
      handler: (async (request, reply) => {
        const address = await ::florinApi.getAccountAddress::asyncWrap('youtubexit');

        const response = await ::oip.announcePublisher::asyncWrap({
          'oip-publisher': {
            name: 'YouTubexit',
            address: address,
            emailmd5: 'bfdc056c7bd69f1bc6b3bb3ca49abb44'
          }
        });

        console.log(response);
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/{p*}',
    config: {
      handler: (request, reply) => {
        const markup = renderApp('/');

        reply(markup);
      }
    }
  });

  next();
};

exports.register.attributes = { name: 'main' };