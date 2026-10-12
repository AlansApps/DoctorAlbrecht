/** Cross-tab notifications so an open tab refreshes after another tab writes. */
export type TabMessage =
  | { type: 'progress'; itemIds: string[] }
  | { type: 'session'; sessionId: string }
  | { type: 'content' };

const channel: BroadcastChannel | null = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('tarjetalan');

export function notifyOtherTabs(msg: TabMessage): void {
  channel?.postMessage(msg);
}

export function onTabMessage(handler: (msg: TabMessage) => void): () => void {
  if (!channel) return () => {};
  const listener = (e: MessageEvent<TabMessage>) => handler(e.data);
  channel.addEventListener('message', listener);
  return () => channel.removeEventListener('message', listener);
}
