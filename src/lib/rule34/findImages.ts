import axios from "axios";
import { URLSearchParams } from "url";

export const findImages = async (query: string): Promise<string[]> => {
    query = query.split(" ").filter(Boolean).join("_");

    const response = await axios.get(urlBuilder(query));
    const rule34Items: Rule34Item[] = response.data || [];
    return rule34Items.map(i => i.file_url);
};

const urlBuilder = (tags: string, pageId = 0): string => {
    const searchParams = new URLSearchParams({
        page: "dapi",
        s: "post",
        q: "index",
        json: "1",
        tags: tags,
        pid: pageId.toString(),
    });
    return `https://api.rule34.xxx/index.php?${searchParams.toString()}`;
};
