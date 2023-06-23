import { APIResponseErr, ResponseStatus, RouteDetails } from "../../DTO/components";
import type { NextApiRequest, NextApiResponse } from "next";
import { File } from "formidable";
import { asyncParse } from "./uploadDomains";
import { readFile } from "fs/promises";
import prisma from "../../lib/prisma";
import { HttpType } from "@prisma/client";
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
        const result = await asyncParse(req);
      const fileArr = result.files.routes as File[];
      const reader = await readFile(fileArr[0].filepath, {
        encoding: "utf8",
      });
      const array = JSON.parse(reader) as RouteDetails[];
      const mapResponse: String[] =  await  Promise.all(array.map(async (item) => {
        const mapResult = await prisma.post.create({
          data: {
            endpoint: item.endpoint,
            statusCode: item.statusCode,
            response: item.response,
            title: item.title,
            id: item.id,
            mockURL: "/" + item.domain + item.endpoint,
            type: item.type as keyof typeof HttpType,
            domain:{
              connect:{
                name: item.domain
              }
            }
          }
        });
        return mapResult.id;
      })) 
      // const response = await prisma.post.createMany({
      //   skipDuplicates: true,
      //   data: array.map((item) => (
      //       {
      //           domainName: item.domain,
      //           endpoint: item.endpoint,
      //           statusCode: item.statusCode,
      //           response: item.response,
      //           title: item.title,
      //           id: item.id,
      //           mockURL: "/" + item.domain + item.endpoint,
      //           type: item.type as keyof typeof HttpType
      //       }
      //   ))
      // })
      res.status(201).json({
        "message": "Upload successful and routes created",
        "timeStamp": new Date().toString(),
        "successCount": mapResponse.length
      })

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
      res.status(error.serviceCode).json({
        timeStamp: error.timeStamp,
        message: error.message,
      });
    } else {
      const gernicErr = new APIResponseErr(
        500,
        ResponseStatus.Failure,
        new Date().toString(),
        "Something went wrong"
      );
      res.status(gernicErr.serviceCode).json({
        timeStamp: gernicErr.timeStamp,
        message: gernicErr.message,
      });
    }
  }
};
export default handler