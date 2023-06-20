import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, CustomHeaders, ResponseStatus, RoutesResponse } from "../../DTO/components";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method?.toLowerCase() === "get") {
      const page_number = req.query.page?.toString();
      const page_size = req.query.size?.toString();
      const domain = req.query.domain?.toString();
      if (
        page_number != undefined &&
        page_size != undefined &&
        domain != undefined
      ) {
        const result = await prisma.post.findMany({
            where: {
                domainName: domain
            },
            orderBy: {
                title: 'desc',
              },
            include:{
              headers: true
            },
            take: parseInt(page_size),
            skip: (parseInt(page_number) - 1) * parseInt(page_size)
        })
        const tableCount = await prisma.post.count()
        const routeResp = result.map( (item) => (
          {
            domain: item.domainName,
            endpoint: item.endpoint,
            id: item.id,
            response: item.response,
            statusCode: item.statusCode,
            title: item.title,
            type: item.type.toString(),
            headers: item.headers,
          }
        ))
         const response: RoutesResponse = {
            domain: domain,
            message: 'Routes fetched successfully',
            routeCount: tableCount,
            routes: routeResp,
            serviceId: 200,
            timeStamp: new Date().toString()
        }
        return res.status(200).json(response)
      } else {
        throw new APIResponseErr(
          400,
          ResponseStatus.Failure,
          new Date().toString(),
          "Query params missing"
        );
      }
    } else {
      throw new APIResponseErr(
        404,
        ResponseStatus.Failure,
        new Date().toString(),
        "Invalid method"
      );
    }
  } catch (error) {
    if (error instanceof APIResponseErr) {
      res.status(error.serviceCode).send(error);
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

