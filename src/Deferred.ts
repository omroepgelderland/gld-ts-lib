enum Status {
  Pending,
  Resolved,
  Rejected,
}

/**
 * Deferred class for promises die are resolved externally.
 *
 * @template T - Type of parameter for the resolve function.
 * @template U - Optional type for the reject function.
 */
class Deferred<T, U = unknown> {
  public readonly promise;
  public resolve: (value: T | PromiseLike<T>) => void;
  public reject: (reason?: U) => void;
  private status: Status;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.resolve = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.reject = () => {};
    this.status = Status.Pending;
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.promise.then(
      () => {
        this.status = Status.Resolved;
      },
      () => {
        this.status = Status.Rejected;
      },
    );
  }

  public is_pending(): boolean {
    return this.status === Status.Pending;
  }

  public is_resolved(): boolean {
    return this.status === Status.Resolved;
  }

  public is_rejected(): boolean {
    return this.status === Status.Rejected;
  }
}

export { Deferred };
