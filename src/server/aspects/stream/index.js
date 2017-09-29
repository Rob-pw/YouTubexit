const getYoutubeStream = require('./adapters/youtube');
const transcoder = require('./transcoder');

function getVideoStream(id) {
    const videoStream = getYoutubeStream(id);
    // const transcoderStream = transcoder(videoStream, {
    //     videoCodec: 'libvpx-vp9',
    //     audioCodec: 'libvorbis',
    //     format: 'webm',
    //     dimensions: {
    //         width: 320,
    //         height: 240
    //     }
    // });

    return videoStream;
}

module.exports = getVideoStream;