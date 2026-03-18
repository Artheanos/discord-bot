import axios, { isAxiosError } from "axios";
import { URLSearchParams } from "url";

export const findMp3Paths = async (query: string): Promise<string[]> => {
    try {
        const response = await axios.get<string>(urlBuilder(query));
        return findMediaInHtml(response.data);
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) {
            return [];
        } else {
            throw e;
        }
    }
};

export const getMediaUrl = (media: string) => `${BASE_URL}${media}`;

export const BASE_URL = "https://www.myinstants.com";

const findMediaInHtml = (html: string): string[] => {
    return [...html.matchAll(REGEX)].map(i => i[1]);
};

const REGEX = /play\('(.*?)'/g;

const urlBuilder = (name: string): string => {
    const searchParams = new URLSearchParams({ name: name });
    return `${BASE_URL}/en/search/?${searchParams.toString()}`;
};
