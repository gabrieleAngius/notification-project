import { Channel } from "../../interfaces/ChannelInterface";

export async function postRemoteData(config: Channel): Promise< Response | any > {
	const response = await fetch(config.url, config.postOption );
	return response;
}