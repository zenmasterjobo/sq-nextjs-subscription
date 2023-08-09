
import { Client, Environment } from 'square'

const {
    subscriptionsApi,
    customersApi,
    catalogApi,
    locationsApi
} = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox
})


export {
    subscriptionsApi,
    customersApi,
    catalogApi,
    locationsApi
}