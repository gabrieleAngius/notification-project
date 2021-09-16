export type ChannelContainer = {
    [key: string]: Channel;
}

export interface Channel {
    url: string,
	patchOption: {
		method: string,
		headers: HeadersInit,
		body?: string,
	},		
	postOption: {
		method: string,
		headers: HeadersInit,
        body?: string,
	},
}