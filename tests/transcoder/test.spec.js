import fs from 'fs';
import path from 'path';
import test, { group } from 'tape-plus';
import convertVideo from '/aspects/stream/transcoder';

group('Streaming video conversion', test => {
    test('from static mpeg4 to webm', t => {
        const filePath = path.join(__dirname, './toystory.mp4');
        const readStream = fs.createReadStream(filePath);
        const conversionStream = convertVideo(readStream, {
            input: {
                format: 'mpeg4'
            },
            output: {
                video: {
                    codec: 'libvpx-vp9'
                },
                audio: {
                    codec: 'libvorbis'
                },
                format: 'webm'
            }
        });

        conversionStream.on('finish', result => {
            console.log(result);
        });

        t.equal(false, true);
    });
});