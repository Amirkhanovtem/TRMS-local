import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';

@Injectable({
  providedIn: 'root',
})
export class JoditService {
  public getDefaultButtons(): Array<string> {
    return [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'eraser',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'paragraph',
      'classSpan',
      'lineHeight',
      '---',
      'superscript',
      'subscript',
      '|',
      'image',
      'video',
      '\n',
      'spellcheck',
      '|',
      'cut',
      'copy',
      'paste',
      'selectall',
      'copyformat',
      '|',
      'hr',
      'table',
      'link',
      'symbols',
      '|',
      'indent',
      'outdent',
      'left',
      '|',
      'brush',
      '---',
      'undo',
      'redo',
      '|',
      'find',
      '|',
      'source',
      '|',
      'preview',
      'print',
      '\n',
    ];
  }

  public getBtnsForView(): Array<string> {
    return ['---', '|', 'selectall', 'source', 'fullsize', 'print'];
  }

  public getDefaultButtonList(name: string, enumList: Array<StandardEnumModel>, localEnumField: string): any {
    const list = this.convertStandardEnumModelToObject(enumList, localEnumField);

    return {
      name: name,
      tooltip: name,
      text: name,
      popup: (editor: any, current: HTMLElement, close: () => void): HTMLElement | false => {
        const entries = Object.entries(list);
        if (entries.length === 0) {
          return false;
        }

        const form = editor.create.div('jodit-keywords-list');

        entries.forEach(([key, value]) => {
          const button = editor.create.element('a');
          button.classList.add('jodit-ui-button');
          button.textContent = value as string;
          button.dataset.key = key;
          form.appendChild(button);
        });

        form.addEventListener('click', (e: Event) => {
          const target = e.target as HTMLElement;
          const key = target.dataset?.key;
          if (!key) return;

          e.preventDefault();
          e.stopPropagation();

          editor.s.insertHTML(key);
          close();
        });

        return form;
      },
    };
  }

  private convertStandardEnumModelToObject(list: Array<StandardEnumModel>, localEnumField: string): any {
    const result = {};

    list.forEach(enumModel => {
      result[enumModel.id] = enumModel[localEnumField];
    });

    return result;
  }
}
