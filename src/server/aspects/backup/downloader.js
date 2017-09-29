import { spawn } from 'child_process';
import * as ipfs from './ipfs';

// const ffmpegPath = '/usr/local/bin/ffmpeg';

// function getThumbnail(resolution = '640x480') {
//   const args = [
//     '-ss', '00:00:15',
//     '-t', '1',
//     '-s', '720x480',
//     'pipe:1'
//   ];

//   const stdout = new WriteableStream();

//   const $video = this;
//   const subprocess = spawn(ffmpegPath, args, {
//     stdio: [$video, stdout]
//   });

//   subprocess.on('error', (err) => {

//   });

//   return stdout;
// }

export async function downloader(videoUrl) {
  const { service } = this;
  // Download using youtube-dl
  const $video = youtube.$getVideo(videoUrl);
  // Capture thumbnail
  // const thumbnail = $video::getThumbnail();
  // Upload to IPFS
  

  return ipfsFiles;
}