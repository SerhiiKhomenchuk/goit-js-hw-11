
const BASE_URL = 'https://restcountries.com/v3.1/name/';


export default function fetchCountries(countryName) {
   const URL = `${BASE_URL}${countryName}?fields=name,capital,population,flags,languages`;
    return fetch(URL).then((resp) => { 
        
        if (!resp.ok || resp.statusCode === 404) {
           throw new Error(resp.statusText)
        }
        
        return resp.json()
   }) 
}

 