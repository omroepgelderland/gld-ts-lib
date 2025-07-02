/**
 * Event listener.
 *
 * Makes it easier to remove event listeners.
 */
class Listener {
  /**
   * Create listener and start listening.
   *
   * See addEventListener for parameter options.
   */
  constructor(
    private readonly target: EventTarget,
    private readonly type: string,
    private readonly callback: EventListenerOrEventListenerObject | null,
    private readonly options?: boolean | AddEventListenerOptions | undefined,
  ) {
    this.target.addEventListener(this.type, this.callback, this.options);
  }

  /**
   * Removes the listener.
   */
  public off(): void {
    this.target.removeEventListener(this.type, this.callback, this.options);
  }
}

export { Listener };
