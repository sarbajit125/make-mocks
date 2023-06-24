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
            const response = await prisma.domains.findMany()
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=domains.json')
            res.status(200).send(response)
        } else {
            throw new APIResponseErr(405, ResponseStatus.Failure, new Date().toString(), "Method not allowed")
        }
       
    } catch (error) {
        const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
    }
  }