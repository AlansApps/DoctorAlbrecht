/** Cross-tab notifications so an open tab refreshes after another tab writes. */
export type TabMessage =
  | { type: 'progress'; itemIds: string[] }
  | { type: 'progress-all' }
  | { type: 'session'; sessionId: string; rev: number }
  | { type: 'content' }
  | { type: 'erased' };

let channel: BroadcastChannel | null | undefined;

/** Created lazily so importing storage code never keeps a Node process alive. */
function getChannel(): BroadcastChannel | null {
  if (channel === undefined) channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('tarjetalan');
  return channel;
}

export function notifyOtherTabs(msg: TabMessage): void {
  getChannel()?.postMessage(msg);
}

export function onTabMessage(handler: (msg: TabMessage) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const listener = (e: MessageEvent<TabMessage>) => handler(e.data);
  ch.addEventListener('message', listener);
  return () => ch.removeEventListener('message', listener);
}

/** For tests and scripts. */
export function closeChannel(): void {
  channel?.close();
  channel = undefined;
}
