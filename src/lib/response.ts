import { NextResponse } from "next/server";

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
};

export function formatResponse<T>(data: T, message = "Operation completed successfully", status = 200) {
    return NextResponse.json<ApiResponse<T>>(
        {
            success: true,
            message,
            data,
        },
        { status }
    );
}

export function formatErrorResponse(message = "An error occurred", status = 500) {
    return NextResponse.json<ApiResponse<null>>(
        {
            success: false,
            message,
            data: null,
        },
        { status }
    );
}