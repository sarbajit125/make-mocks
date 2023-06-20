import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
    console.log(error)
    if (error instanceof APIResponseErr) {
      res.send(error);
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
