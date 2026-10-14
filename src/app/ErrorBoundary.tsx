import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Last-resort guard: a render error never leaves a blank screen. Learning data is
 * in IndexedDB, so reloading is always safe; the message is bilingual because the
 * i18n context itself may be what failed.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('DoctorAlbrecht render error', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="app__main" role="alert">
        <p className="notice notice--error">
          Algo salió mal al mostrar esta pantalla. Tu progreso está guardado. · Something went wrong on this screen. Your progress is saved.
        </p>
        <button type="button" className="btn btn--primary" onClick={() => { location.hash = '#/'; location.reload(); }}>
          Volver al inicio · Back to home
        </button>
      </div>
    );
  }
}
