import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";
import { handleAPIError } from "./uploadRoutes";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
        if (req.method?.toLowerCase() === 'delete') {
            const id = req.query.id?.toString();
            if (id != undefined) {
                const response = await prisma.post.delete({
                    where: {
                      id: id,
                    },
                  
                  });
                  console.log(response)
                  return res.status(200).json({
                    message: "Route deleted successfully",
                    serviceCode: 200,
                    timeStamp: new Date().toString(),
                  });
            } else {
                throw new APIResponseErr(
                    400,
                    ResponseStatus.Failure,
                    new Date().toString(),
                    "ID missing"
                  );
            }
        } else {
            throw new APIResponseErr(
                404,
                ResponseStatus.Failure,
                new Date().toString(),
                "Wrong http method"
              );
        }
    } catch (error) {
      const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
    }
  }