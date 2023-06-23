import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { handleAPIError } from "./uploadRoutes";
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
    const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
  }
}
