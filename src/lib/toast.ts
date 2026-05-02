/**
 * Toast notification dispatcher.
 * Usage: showToast('Message here', 'success' | 'error' | 'info')
 */
export function showToast(message: string, type: string = 'info') {
  const event = new CustomEvent('show-toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}
