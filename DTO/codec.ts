
import * as tsCheck from "io-ts";

export const RouteDetailsCodec = tsCheck.type({
    id: tsCheck.string,
    title: tsCheck.string,
    description: tsCheck.string,
    endpoint: tsCheck.string,
    type:tsCheck.string,
    response: tsCheck.string
})


export const RoutesCodec = tsCheck.type({
    serviceId: tsCheck.number,
    message: tsCheck.string,
    timeStamp: tsCheck.string,
    routeCount: tsCheck.number,
    routes: tsCheck.readonlyArray(RouteDetailsCodec)
})

export const ARouteCodec = tsCheck.type({
    serviceId: tsCheck.number,
    message: tsCheck.string,
    timeStamp: tsCheck.string,
    route: RouteDetailsCodec
})