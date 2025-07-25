type Listener<T, U = void> = (event: T) => U;

interface Disposable {
  dispose(): void;
}

/** passes through events as they happen. You will not get events from before you start listening */
class TypedEvent<T> {
  private listeners: Listener<T>[] = [];
  private listenersOncer: Listener<T>[] = [];

  public on(listener: Listener<T>): Disposable {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener),
    };
  }

  public once(listener: Listener<T>): void {
    this.listenersOncer.push(listener);
  }

  public off(listener: Listener<T>) {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  }

  public emit(event: T) {
    /** Update any general listeners */
    this.listeners.forEach((listener) => listener(event));

    /** Clear the `once` queue */
    if (this.listenersOncer.length > 0) {
      const toCall = this.listenersOncer;
      this.listenersOncer = [];
      toCall.forEach((listener) => listener(event));
    }
  }

  public pipe(te: TypedEvent<T>): Disposable {
    return this.on((e) => te.emit(e));
  }
}

export { TypedEvent };
