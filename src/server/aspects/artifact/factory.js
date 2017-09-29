export function generateArtifactJSONFromView() {
  const { type, subtype } = this.artifact;
  const  {  }

}

const calculatePercentage = ({ value }) => value !== "" ? value / 100 : 0.3;

const type = 
const makeExtraInfo = getExtraInfo(artifact)

const makeArtifactJson = 
  ({ type, subtype, scale, discountPercentage, nsfw }) => ({
  "artifact":{  
      "type": type + "-" + subtype,
      "info": { 
        "extraInfo": {},
        nsfw
      },
      "storage": {
        "network": "IPFS",
        "files": []
      },
      "payment": {
        "fiat": "USD",
        "scale": scale + ":1",
        "disPer": discountPercentage,
        "sugTip": [ ],
        "tokens": { }
      }
    }
});

