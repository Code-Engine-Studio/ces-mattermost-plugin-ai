import { manifest } from './manifest';

console.log(manifest)

const getPluginState = (state: any) => state['plugins-' + manifest.id] || {};

export const getPluginChannelId = (state: any) => { console.log(state); return getPluginState(state).botChannelId; }