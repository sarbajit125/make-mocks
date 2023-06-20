import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, DomainDTO, ResponseStatus } from "../../DTO/components";
import prisma from "../../lib/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await prisma.domains.findMany();
    res.status(200).json(
      result.map((item) => ({
        desc: item.desc ?? "",
        id: item.id,
        name: item.name,
      }))
    );
  } catch (error) {
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
