/**
 * Copy text to clipboard with fallback for non-secure contexts (HTTP / mobile browsers).
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // 1. Try modern navigator.clipboard API if available
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, attempting fallback...', err);
    }
  }

  // 2. Legacy execCommand fallback for HTTP / mobile browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Position offscreen to prevent layout shift / mobile scrolling
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Extra handling for iOS WebKit selection
    textArea.setSelectionRange(0, 999999);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return true;
    }
  } catch (err) {
    console.error('execCommand copy fallback failed:', err);
  }

  return false;
};

/**
 * Share URL using Web Share API on mobile devices, or fallback to copy to clipboard.
 */
export const shareOrCopyUrl = async (
  title: string,
  text: string,
  url: string
): Promise<'shared' | 'copied' | 'failed'> => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return 'shared';
    } catch (err: any) {
      // User cancelled share dialog
      if (err.name === 'AbortError') {
        return 'failed';
      }
      console.warn('navigator.share failed, falling back to copy:', err);
    }
  }

  const success = await copyToClipboard(url);
  return success ? 'copied' : 'failed';
};
