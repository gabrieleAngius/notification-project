import { Channel } from "../../interfaces/ChannelInterface";

export async function patchRemoteData(config: Channel): Promise< Response | any > {
	const response = await fetch(config.url, config.patchOption);
	return response;
}