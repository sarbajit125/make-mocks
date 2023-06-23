import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";
import { handleAPIError } from "./uploadRoutes";

export default async function handler(
    req: addDomainRequest,
    res: NextApiResponse
  ) {
    try {
      if (req.method?.toLowerCase() === 'post') {
        const response = await prisma.domains.create({
          data: {
            name: req.body.name,
            desc: req.body.desc
          }
        })
        return res.status(200).json({
          message: 'Domain subscription successfull',
          serviceCode: 200,
          timeStamp: new Date().toString()
        })
      } else {
        let errorObj  = new APIResponseErr(400, ResponseStatus.Failure,new Date().toString(), "Fetching Failed")
        throw errorObj
      }
    } catch (error) {
      const errResp = handleAPIError(error)
      res.status(errResp.status).json(errResp)
    }
  }

export interface addDomainRequest extends NextApiRequest {
    body:{
        name: string,
        desc?: string
    }
}

  