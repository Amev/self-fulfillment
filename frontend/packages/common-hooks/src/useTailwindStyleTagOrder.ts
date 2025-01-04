import { useEffect } from 'react';

export function useTailwindStyleTagOrder() {
  useEffect(() => {
    const head = document.querySelector('head');
    if (!head) {
      return;
    }

    let tailWindStyleTag = Array.from(head.getElementsByTagName('style')).find(
      (style) => style.innerHTML.includes('tailwind'),
    );

    if (!tailWindStyleTag) {
      tailWindStyleTag = Array.from(head.getElementsByTagName('link')).find(
        (link) => {
          // eslint-disable-next-line prefer-regex-literals
          const regex = new RegExp(/\/assets\/index-[\w|\d|-]*\.css$/gi);

          return regex.test(link.href);
        },
      );
    }

    if (tailWindStyleTag) {
      head.insertAdjacentElement('afterbegin', tailWindStyleTag);
    }
  }, []);
}
