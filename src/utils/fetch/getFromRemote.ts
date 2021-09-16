import { Channel } from "../../interfaces/ChannelInterface";

export async function getFromRemote(config: Channel): Promise< Response | any >  {
	const response = await fetch(config.url);
	return response;
}