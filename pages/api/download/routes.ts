import type { NextApiRequest, NextApiResponse } from "next";
import { handleAPIError } from "../uploadRoutes";
import prisma from "../../../lib/prisma";
import { APIResponseErr, ResponseStatus } from "../../../DTO/components";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
        if (req.method === "GET") {
            if (req.query.domain?.toString() != undefined) {
                const response = await prisma.post.findMany({
                    where:{
                        domainName: {
                            equals: req.query.domain
                        }
                    }
                })
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=routes.json')
            res.status(200).send(response)
            } else {
                throw new APIResponseErr(400, ResponseStatus.Failure, new Date().toString(), "domain params missing")
            }
            
        } else {
            throw new APIResponseErr(405, ResponseStatus.Failure, new Date().toString(), "Method not allowed")
        }
       
    } catch (error) {
        const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
    }
  }