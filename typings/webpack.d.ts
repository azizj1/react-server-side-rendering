declare const __DEV__: boolean;
declare const __CALENDAR_ENDPOINT__: string;

declare module '*.svg' {
	const url: any;
	export = url;
}

declare module '*.png' {
	const url: any;
	export = url;
}
