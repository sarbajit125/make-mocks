import { useQuery } from "react-query";
import { APIManager } from "../api/apiManager";

export const getAllDomains = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery({
    queryKey: ["domains"],
    queryFn: () => APIManager.sharedInstance().fetechAllDomains(),
  });
};

export const getAllRoutes = (
  page_number: number,
  page_size: number,
  domain: string,
  search: string
) => {
  return useQuery({
    queryKey: ["mocks", page_number, page_size, domain],
    queryFn: () =>
      APIManager.sharedInstance().getAllRoutes(page_number, page_size, domain),
    keepPreviousData: true,
    select: (items) => ({
      message: items.message,
      serviceId: items.serviceId,
      timeStamp: items.timeStamp,
      routeCount: items.routeCount,
      domain: items.domain,
      routes: items.routes.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())),
    }),
  });
};
