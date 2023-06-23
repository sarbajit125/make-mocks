import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, IncomingForm } from "formidable";
import { readFile } from "fs/promises";
import prisma from "../../lib/prisma";
import { Domains } from "@prisma/client";
import { APIResponseErr, ResponseStatus } from "../../DTO/components";
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
      const array = JSON.parse(reader) as UploadedDomains[];
      const dataInFormat: Domains[] = array.map((item) => ({
        name: item.name,
        desc: item.desc ?? null,
        createdAt: new Date(),
        id: item.id,
      }));
      const response = await prisma.domains.createMany({
        data: dataInFormat,
        skipDuplicates: true,
      });
      res
        .status(200)
        .json({ message: "Upload successfull", successCount: response.count });
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
export const asyncParse = (req: any): Promise<ParseType> =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default handler;

export interface ParseType {
  fields: formidable.Fields;
  files: formidable.Files;
}

interface UploadedDomains {
  id: string;
  name: string;
  desc?: string;
}
