const path = require('path');
import Hapi from 'hapi';
import Joi from 'joi';
import Hoek from 'hoek';
import Nes from 'nes';
import Glue from 'glue';

const createServer = () => new Hapi.Server();
const registerRoutes = () => {
    // const server = createServer();
    // server.connection({ port: 8080 });

    const manifest = {
        connections: [{
            port: 8080
        }],
        registrations: [{
            plugin: {
                register: './sites/api.site'
            },
            options: {
                routes: {
                    vhost: 'cdn.youtubexit.com'
                }
            }
        }, {
            plugin: {
                register: './sites/main.site'
            },
            options: {
                routes: {
                    vhost: 'youtubexit.com'
                }
            }
        }]
    };

    Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
        console.log('Hello?');

        server.register({
            register: Nes,
            options: {}
        });

        Hoek.assert(!err, err);
        server.start((err) => {

            Hoek.assert(!err, err);
            console.log('server started');
        });
    });
};

registerRoutes();