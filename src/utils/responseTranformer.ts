import { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

type BaseQueryResult = {
    data?: unknown;
    error?: FetchBaseQueryError;
    meta?: FetchBaseQueryMeta;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const handleResponseTransformation = <T extends BaseQueryResult>(result: T): T => {
    if (isRecord(result.data)) {
        result.data = {
            ...result.data,
            status: result.meta?.response?.status ?? result.data.status ?? null,
        };
    }

    return result;
};

export default handleResponseTransformation;
