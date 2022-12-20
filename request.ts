import axios from 'axios';
import IEnsAPIResponse from './Interfaces/IENSApiResponse';

export default async function requestDataFromEns(ensName: string): (Promise<IEnsAPIResponse|null>){
    const options = {
        method: 'POST',
        url: `https://api.zettablock.com/api/v1/dataset/${process.env.ZETTABLOCK_APP_ID}/graphql`,
        headers: {accept: 'application/json', 'content-type': 'application/json',"X-API-KEY": process.env.ZETTABLOCK_API_KEY},
        data: { query: `
            {
                record(name:"${ensName}") {
                  name,
                  contract_address,
                  owner,
                  label,
                  event,
                  cost,
                  expires,
                  block_number,
                  transaction_hash
                }
            }
            `
            }
        };

        const data = await axios
        .request(options)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

        return data.data.record;
}