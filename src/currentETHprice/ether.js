import axios from 'axios';

export const etherPrice = () => {
  		axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
			.then(res => {
				return res.data.USD
			})
  	}