import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { APIResponseErr, ResponseStatus } from "../../../DTO/components";
import { HttpType } from "@prisma/client";
import { handleAPIError } from "../uploadRoutes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
        const requestType = req.method as keyof typeof HttpType
        console.log(req.query)
        const {hostid} = req.query
        if (isArrayOfStrings(hostid)) {
            const domainName = hostid[0]
            const endpoint = "/" + hostid.join("/")
            console.log(endpoint)
            const response = await prisma.post.findFirstOrThrow({
                where:{
                    domainName:{
                        equals: domainName
                    },
                    mockURL: {
                        equals: endpoint
                    },
                    type: {
                        equals: requestType
                    }
                },
                include:{
                    headers: true
                }
            })
            if (response.headers.length > 0) {
                response.headers.map((item) => (
                    res.setHeader(item.key, item.value)
                ))
            }
            return res.status(response.statusCode).send(response.response)
        } else {
            throw new APIResponseErr(400, ResponseStatus.Failure, new Date().toString(), "Only domain is insufficent")
        }

    } catch (error) {
        const errResp = handleAPIError(error)
        res.status(errResp.status).json(errResp)
    }
  }
  function isArrayOfStrings(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
 }

