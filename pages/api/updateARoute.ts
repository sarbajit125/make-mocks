import { NextApiRequest, NextApiResponse } from "next";
import {
  APIResponseErr,
  HeaderTableModel,
  ResponseStatus,
} from "../../DTO/components";
import prisma from "../../lib/prisma";
import { HttpType, Prisma } from "@prisma/client";

export default async function handler(
  req: addRouteRequest,
  res: NextApiResponse
) {
  try {
    if (req.method?.toLowerCase() === "put") {
      let httpType =  req.body.type as keyof typeof HttpType
      const result = await prisma.post.update({
        where: {
          id: req.body.id,
        },
        data: {
          endpoint: req.body.endpoint,
          response: req.body.response,
          title: req.body.title,
          statusCode: req.body.statusCode,
          type: httpType,
          headers:{
            connectOrCreate: req.body.headers?.map((item) => {
              return {
                where:{
                  id: item.id
                },
                create:{
                  key: item.key,
                  id: item.id,
                  value: item.value,
                }
              }
            })
          }
        },
      });
      return res.status(200).json({
        message: "Route updated successfully",
        serviceCode: 200,
        timeStamp: new Date().toString(),
      });
    } else {
      throw new APIResponseErr(
        405,
        ResponseStatus.Failure,
        new Date().toString(),
        "Method not allowed"
      );
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

export interface addRouteRequest extends NextApiRequest {
  body: {
    id: string;
    title: string;
    endpoint: string;
    type: string;
    response: string;
    statusCode: number;
    headers?: HeaderTableModel[];
    domain: string;
  };
}
