import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";
import { handleAPIError } from "./uploadRoutes";
import runMiddleware, { cors } from "../../api/runMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runMiddleware(req, res, cors)
    const id = req.query.id?.toString();
    if (id != undefined) {
      const response = await prisma.domains.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json({
        message: "Domain deleted successfully",
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
  } catch (error) {
    const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
  }
}
