var ssbkeys = require('ssb-keys')

ssbkeys.create(path, function(err, k) {
  console.log(k) /* => {
    id: String,
    public: String,
    private: String
  }*/
})