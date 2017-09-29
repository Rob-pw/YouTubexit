import Accept from 'accept';
import { getVideo } from '../aspects/stream/adapters/youtube';
// import { addFile } from '../aspects/backup/ipfs';

const makeYoutubeUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/watch',
    config: {
        handler: function (request, reply) {
          const { v:id} = request.query;

          const { headers } = request.raw.req;
          const mediaTypes = Accept.mediaTypes(headers.accept);

          const packet = {
            in: {
              service: 'youtube',
              path: `watch?v=${id}`,
            },
            out: {
              mediaTypes
            }
          };

          const videoUrl = makeYoutubeUrl(id);
          const { $video } = getVideo(videoUrl);
          
          // addFile({
          //   $file: $video,
          //   name: 'youtube/id'
          // });

          return reply($video);
        }
    }
  });

  next();
}

exports.register.attributes = { name: 'cdn' };