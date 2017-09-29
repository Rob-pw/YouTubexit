import alexandria from './alexandria';

const people = {
  artist: 'Some artist',
  distributor: 'distributor',
  composers: ['This composer']
};

const licence = {
  copyright: 'MIT',
  prohibitions: 'n/a',
  rights: 'n/a'
};

const pricing = {
  price: {
    play: 3,
    buy: 5,
    suggested: {
      play: 3,
      buy: 6
    }
  },
  cut: {
    promotor: 'Promotor!',
    retail: 'Retailer'
  }
};

const permissions = {
  buy: true
};

const storage = {
  network: 'IPFS',
  address: 'ipfs-hash'
};

const payment = {
  fiat: 'GBP',
  scale: '1000:1',
  tip: {
    suggested: [1, 3, 5]
  },
  addresses: {
    btc: 'address'
  }
};

const artifact = {
  title: 'Some title',
  description: 'description',
  year: 1995,
  tags: ['one', 'two'],
  type: 'some type',
  genre: 'genre',
  publisher: {
    address: '/someaddress/'
  },
  people,
  licence,
  pricing,
  permissions,
  fileInfo: {
    storage,
    files: [{
      names: {
        display: 'Nice filename',
        file:  'filena,e.mp4'
      },
      type: 'some type',
      size: 2343
    }]
  }
};

console.log(JSON.stringify(
  ({ artifact, payment })::alexandria('oip-041')));