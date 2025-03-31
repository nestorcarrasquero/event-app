import { Prisma } from "@prisma/client";
import { formatErrorResponse } from "./response";

export function routeErrorHandler(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return formatErrorResponse(error.message, 500)
        }
    }
}