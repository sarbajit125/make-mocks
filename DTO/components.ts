export class Posts{
    id: string;
   title: string;
   description: string;
   endpoint: string;
   type: string;
   response: string;

   public constructor( id: string,
    title: string,
    description: string,
    endpoint: string,
    type: string,
    response: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.endpoint = endpoint;
        this.type= type;
        this.response = response;
    }
}

export interface RouteDetails {
    id: string;
    title: string;
    description: string;
    endpoint: string;
    type: string;
    response: string;
}

export interface ListProps {
    mocks: RouteDetails[]
}


export var TableMock = [ new Posts("0","Circle lobby","Get all circle of user", "v1/circle","GET","{}"),
                    new Posts("1","Circle Dashboard","Get user details in a circle","v1/circle/dashboard","GET","{}"),
                    new Posts("2","Create circle","Create new circle","v1/create-circle","POST","{}")]

export  const RequestType = ["POST","GET","PUT","DELETE","PATCH"];