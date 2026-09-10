import { Component, type ReactNode } from 'react';

export class ReplayBoundary extends Component<
  { children: ReactNode; onExit: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="replay-error">
          <p>The replay couldn’t load.</p>
          <button className="underlined-link" onClick={this.props.onExit}>
            Show all text
          </button>
        </div>
      );
    return this.props.children;
  }
}
