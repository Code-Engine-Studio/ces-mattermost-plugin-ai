import { manifest } from "./manifest";

const getPluginState = (state: any) => state["plugins-" + manifest.id] || {};

export const getPluginChannelId = (state: any) =>
  getPluginState(state).botChannelId;
