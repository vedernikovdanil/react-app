import React from "react";

class StickyEdges {
  #bufferScroll = 0;
  #lastDirection = "";

  constructor(
    public $el: HTMLElement,
    public offset: [top: number, bottom: number],
    public canCompute = () => true
  ) {}

  compute() {
    if (!this.canCompute()) {
      return;
    }
    const { top, overflow } = this.getScrollOptions();

    const delta = this.#bufferScroll - window.scrollY;
    this.#bufferScroll = window.scrollY;

    const isBottom = delta < 0 && top < overflow;
    const isTop = overflow > 0 || (delta > 0 && top > 0);

    if (isBottom || isTop) {
      if (
        !(isBottom && this.#lastDirection === "bottom") &&
        !(isTop && this.#lastDirection === "top")
      ) {
        this.bindEdge(isBottom);
      }
    } else if (
      (delta > 0 && this.#lastDirection === "bottom") ||
      (delta < 0 && this.#lastDirection === "top")
    ) {
      this.unbindEdge(delta);
    }
  }

  private getScrollOptions() {
    const bcr = this.$el.getBoundingClientRect();
    const top = bcr.top - this.offset[0];
    const overflow =
      window.innerHeight - bcr.height - (this.offset[0] + this.offset[1]);
    return { top, bottom: top - overflow, overflow };
  }

  private bindEdge(isBottom: boolean) {
    const styles = this.getStyles(isBottom);
    for (const key in styles) {
      this.$el.style.setProperty(key, styles[key as keyof typeof styles]);
    }
    this.#lastDirection = isBottom ? "bottom" : "top";
    // console.log(`bind ${this.lastDirection}`);
  }

  private unbindEdge(delta: number) {
    const styles = this.getStyles(false);
    for (const key in styles) {
      this.$el.style.setProperty(key, "");
    }
    const direction = this.#lastDirection as keyof typeof this.getScrollOptions;
    const dist = this.getScrollOptions()[direction];
    const position = -(dist - delta);
    if (position >= 0) {
      this.$el.style.transform = `translateY(${position}px)`;
    }
    this.#lastDirection = "";
    // console.log(`unbind ${this.lastDirection}`);
  }

  private getStyles(isBottom: boolean) {
    return {
      position: "sticky",
      top: isBottom ? "" : `${this.offset[0]}px`,
      bottom: isBottom ? `${this.offset[1]}px` : "",
      "margin-top": isBottom ? "auto" : "",
      "margin-bottom": isBottom ? "" : "auto",
      transform: "translateY(0)",
    };
  }
}

type ElemRef = React.MutableRefObject<HTMLElement | null>;

function useStickyEdges(
  ref: ElemRef,
  offset: [top: number, bottom: number],
  canCompute = () => true
) {
  React.useEffect(() => {
    if (ref.current) {
      const stickyEdges = new StickyEdges(ref.current, offset, canCompute);
      const listener = stickyEdges.compute.bind(stickyEdges);
      window.addEventListener("scroll", listener);
      window.addEventListener("resize", listener);
      return () => {
        window.removeEventListener("scroll", listener);
        window.removeEventListener("resize", listener);
      };
    }
    // eslint-disable-next-line
  }, [ref.current]);
}

export default useStickyEdges;
