class LoopRenderComponentCount {
  private count = 1

  public getCount() {
    return this.count++
  }
}

export const loopRenderComponentCount = new LoopRenderComponentCount()
