import youtubedl from 'youtube-dl';
import { execFile } from 'child_process';

function complete(info) {
  console.info('filename: ' + info._filename + ' already downloaded.');
}

function info({ _filename: filename, size }) {
  console.info({
    filename,
    size
  });
}

function end() {
  console.info('finished downloading!');
}

function registerEvents(video) {
  // const { complete, info, end, error } = this.channels;
  
  video.on('complete', complete);
  video.on('info', info); 
  video.on('end', end);
}

export function getVideo(url) {
  return new Promise((resolve, reject) => {
    const video = youtubedl(url);

    video.on('info', info => {
      resolve({
        details: info,
        $video: video
      });
    });

    // video.on('data', data => {
    //   console.log('data', JSON.stringify(data));
    //   resolve({
    //     $video: video,
    //     data
    //   });
    // });

    video.on('error', err => {
      console.error(err);
      if (isFatalErr(err)) reject(err);
    });
  });
}

export function $getPlaylistVideos(url) {
  const video = youtubedl(url);

  video.on('info', info => {

  });
}

export function getVideoDetails(url) {
  const binaryPath = '/usr/local/bin/youtube-dl';
  const args = ['-J', url];
  const options = {};

  return new Promise((resolve, reject) => {
    execFile(binaryPath, args, options, (err, stdout, stderr) => {
      const fatal = isFatalErr(stderr);

      if (err) reject(err);
      if (stderr && fatal) reject(stderr.toString());

      const response = JSON.parse(stdout.toString());

      resolve(response);
    });
  });
}

export const makeUrl = (properties) => {
  const entries = Object.entries(properties);
  const queryString = [];
  
  for (let [key, value] of entries) {
    if (!value) continue;

    queryString.push(`${key}=${value}`);
  }

  return `https://www.youtube.com/watch?${queryString.join('&')}`;
}

function isFatalErr(err) {
  return err.split('\n').every(log => log.indexOf('WARNING:') > -1);
}