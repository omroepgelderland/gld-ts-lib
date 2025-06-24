import Listener from "./Listener";

/**
 * Collection of event listeners.
 */
class ListenersCollection {
  private readonly listeners: Set<Listener>;

  constructor() {
    this.listeners = new Set();
  }

  /**
   * Add and start a new listener.
   *
   * See addEventListener for parameter options.
   */
  public add(
    target: EventTarget,
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): Listener {
    const listener = new Listener(target, type, callback, options);
    this.listeners.add(listener);
    return listener;
  }

  /**
   * Adds and starts multiple event listeners.
   *
   * See addEventListener for parameter options.
   */
  public add_list(
    targets: Iterable<EventTarget>,
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): Set<Listener> {
    const listeners = new Set<Listener>();
    for (const target of targets) {
      listeners.add(this.add(target, type, callback, options));
    }
    return listeners;
  }

  /**
   * Stops and deletes all listeners.
   */
  public remove_all(): void {
    for (const listener of this.listeners) {
      this.remove(listener);
    }
  }

  /**
   * Removes specific listener.
   */
  public remove(listener: Listener): void {
    listener.off();
    this.listeners.delete(listener);
  }
}

export default ListenersCollection;
