import ipfsApi from 'ipfs-api';

const ipfs = new ipfsApi({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

export function addFiles({ root, files }) {
  const { service } = this;

  const fileData = files.map(({ $content, name }) => {
    return {
      path: `${root}/${name}`,
      content: $content
    };
  });

  const promise = new Promise((resolve, reject) => {
    ipfs.files.add(fileData, (err, files) => err ? reject(err) : resolve(files));
  });

  promise.catch(ex => {
    console.error('Error in IPFS', ex);
  });

  return promise;
}