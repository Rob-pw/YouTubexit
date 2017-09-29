const ffmpeg = require('ffmpeg-stream').ffmpeg;

function convertVideo(videoStream, options) {
    const { 
        input: { format:inputFormat }, 
        output: { 
            video: { codec:videoCodec }, 
            audio: { codec:audioCodec },
            format:outputFormat
        }
    } = options;

    const converter = ffmpeg();
    const input = converter.input({ 
        f: inputFormat
     });

    videoStream.pipe(input);
 
    const output = converter.output({
        'c:v': videoCodec,
        'c:a': audioCodec,
        'f': outputFormat,
        pix_fmt: 'yuv420p'
    });

    converter.run();

    return output;
}
                    
module.exports = convertVideo;