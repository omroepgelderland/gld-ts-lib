import { Listener } from "./Listener.ts";

/**
 * A textarea that resizes according to the size of the user input.
 */
class DynamicTextArea {
  private min_height: number;
  private readonly original_overflow;
  private readonly original_height;
  private readonly keyup_listener;

  constructor(private readonly textarea: HTMLTextAreaElement) {
    this.min_height = 0;
    this.original_overflow = this.textarea.style.overflow;
    this.original_height = this.textarea.style.height;
    this.textarea.style.overflow = "hidden";
    this.keyup_listener = new Listener(
      this.textarea,
      "keyup",
      this.update.bind(this),
    );
  }

  private update() {
    const min_height = this.get_min_height();
    if (min_height === 0) {
      return false;
    }
    this.textarea.style.height = "auto";
    const height = Math.max(this.min_height, this.textarea.scrollHeight);
    this.textarea.style.height = `${height}px`;
  }

  public destroy() {
    this.keyup_listener.off();
    this.textarea.style.overflow = this.original_overflow;
    this.textarea.style.height = this.original_height;
  }

  private get_min_height(): number {
    if (this.min_height === 0) {
      this.min_height = this.textarea.clientHeight;
    }
    return this.min_height;
  }

  public set_value(value: string): void {
    this.textarea.value = value;
    this.update();
  }
}

export { DynamicTextArea };
