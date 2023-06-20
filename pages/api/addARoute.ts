import { NextApiRequest, NextApiResponse } from "next";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
import { addRouteRequest } from "./updateARoute";
import prisma from "../../lib/prisma";
import { HttpType } from "@prisma/client";


export default async function handler(req:addRouteRequest, res: NextApiResponse) {
    try {
        let httpType =  req.body.type as keyof typeof HttpType
        if (req.method?.toLowerCase() === 'post') {
            const result = await prisma.post.create({
                data:{
                    endpoint: req.body.endpoint,
                    response: req.body.response,
                    statusCode: req.body.statusCode,
                    title: req.body.title,
                    id: req.body.id,
                    type: httpType,
                    domain:{
                        connect:{
                            name: req.body.domain
                        }
                    }
                }
            })
            return res.status(200).json({
                message: "Route created successfully",
                serviceCode: 200,
                timeStamp: new Date().toString(),
            })
        } else {
            throw new APIResponseErr(405, ResponseStatus.Failure, new Date().toString(), 'Method not allowed')
        }
    } catch (error) {
        console.log(error)
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
