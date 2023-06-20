import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, HeadersResponse, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";


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
        console.log(error);
    if (error instanceof APIResponseErr) {
      res.status(error.serviceCode).send(error);
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      res
        .status(400)
        .send(
          new APIResponseErr(
            400,
            ResponseStatus.Failure,
            new Date().toString(),
            error.message
          )
        );
    } else {
      res
        .status(500)
        .send(
          new APIResponseErr(
            500,
            ResponseStatus.Failure,
            new Date().toString(),
            "Something went wrong"
          )
        );
    }
  }
}