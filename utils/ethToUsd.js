import axios from 'axios'
const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum'

export const convertPrice = async (value, unit) => {
    try {
        const res = await axios.get(url)
        const current_price = res.data[0].current_price
        let amount

        if (unit === 'eth') {
            amount = value / current_price
        } else {
            amount = value * current_price
        }
        return amount
    } catch (error) {
        console.log(error)
    }
}
