import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, HeadersResponse, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";
import { handleAPIError } from "./uploadRoutes";


export default async function handler(req: NextApiRequest, res: NextApiResponse)  {
    try {
  const mockId = req.query.id?.toString()
        if (mockId != undefined) {
            const reponse = await prisma.customHeaders.findMany({
              where:{
                mockId: mockId
              }
            })
          const formattedResp: HeadersResponse = {
            rows: reponse,
            serviceCode: 200,
            timeStamp: new Date().toString()

          }
          return res.status(200).send(formattedResp)
        } else {
            throw new APIResponseErr(400, ResponseStatus.Failure, new Date().toString(), "id missing from query")
        }
    } catch (error) {
      const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
  }
}