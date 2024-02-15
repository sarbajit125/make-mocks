import { APIErrUi, APIResponseErr, ResponseStatus, RouteDetails, UploadRouteDetails } from "../../DTO/components";
import type { NextApiRequest, NextApiResponse } from "next";
import { File } from "formidable";
import { asyncParse } from "./uploadDomains";
import { readFile } from "fs/promises";
import prisma from "../../lib/prisma";
import { HttpType } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
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
      const array = JSON.parse(reader) as UploadRouteDetails[];
      const mapResponse: String[] =  await  Promise.all(array.map(async (item) => {
        const mapResult = await prisma.post.create({
          data: {
            endpoint: item.endpoint,
            statusCode: item.statusCode,
            response: item.response,
            title: item.title,
            id: item.id,
            mockURL: item.mockURL,
            type: item.type as keyof typeof HttpType,
            domain:{
              connect:{
                name: item.domainName
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
    const errResp = handleAPIError(error)
    res.status(errResp.status).json(errResp)
  }
};
export default handler


export const handleAPIError = (error: unknown): APIErrUi => {
  console.log(error);
  if (error instanceof APIResponseErr) {
    return {
      message: error.message,
      status: error.status,
      timeStamp: error.timeStamp,
    };
  } else if (error instanceof PrismaClientKnownRequestError) {
    return {
      message: error.message,
      status: 400,
      timeStamp: new Date().toString(),
    };
  } else if (error instanceof PrismaClientValidationError) {
    return {
      message: error.message,
      status: 400,
      timeStamp: new Date().toString(),
    };
  }
   else {
    return {
      message: "Something went wrong",
      status: 500,
      timeStamp: new Date().toString(),
    };
  }
};