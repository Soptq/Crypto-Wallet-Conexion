const axios = require("axios");

const GRAPHQL_API_URL = "https://graphql.bitquery.io";
const API_KEY = "BQYILxGe8e8dmc6ESoId4De4xk1JGVHH";

async function getUserPCSTradingVolumes(address) {
    const result = await axios({
        headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json"
        },
        method: "POST",
        url: GRAPHQL_API_URL,
        data: {
            query: `{
                        ethereum(network: bsc) {
                            dexTrades(
                                exchangeName: {in: ["Pancake", "Pancake v2"]}
                                txSender: {is: "${address}"}
                            ) {
                                tradeAmount(in: USD)
                            }
                        }
                    }`
        }
    });

    return result.data["data"]["ethereum"]["dexTrades"][0]["tradeAmount"];
}