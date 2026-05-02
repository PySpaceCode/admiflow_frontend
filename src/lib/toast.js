// @ts-nocheck  
/**
 * Toast notification dispatcher.
 * Usage: showToast('Message here', 'success' | 'error' | 'info')
 */
export function showToast(message, type = 'info') {
  const event = new CustomEvent('show-toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}
