/**
 * @date: 2024/2/25
 * @author: 小红
 * @fileName: pagination
 * @Description: 渲染html
 */
import $ from 'jquery';
import Clipboard from 'clipboard';

export default class Render {

  // 全局配置
  #config = window.App.config.render || {};

  // 元数据配置
  #attrs = window.App.config.attrs || {};

  constructor(Theme) {
    this.Theme = Theme;
    if (!Theme) return;

    // 代码块
    if (this.#config['enable_code']) this.useCodeBlock(this.#config);
  }


  /**
   * 切换代码主题
   * @param mode
   */
  useSwitchCodeTheme(mode) {
    const light = document.querySelector('link[data-code=light]');

    const dark = document.querySelector('link[data-code=dark]');

    if (!dark && !light) return;

    light.disabled = mode === 'dark';
    dark.disabled = mode === 'light';
  }

  /**
   * 代码块
   */
  useCodeBlock(codeConfig) {
    // 初始化代码主题
    this.useSwitchCodeTheme(this.Theme.getMode());

    //  主题切换，代码块切换
    this.Theme.change((mode) => this.useSwitchCodeTheme(mode));

    let dom = $('article.render');

    // 单行复制
    let className = 'single_code_select'

    // 是否显示行号
    if (codeConfig['enable_code_line']) className += ' line-numbers';

    dom.addClass(className)

    Prism.highlightAll();

    const pres = dom.find('pre');

    if (!pres.length) return;

    pres.each(function () {
      const pre = $(this);

      const toolbar = pre.next('.toolbar');

      if (toolbar) {
        toolbar.append(`<div class="custom-item"></div>`);

        const customItem = toolbar.find('.custom-item');

        //标题
        if (codeConfig['enable_code_title']) {
          toolbar.addClass('enable-title')
        }

        // 分割线
        if (codeConfig['enable_code_hr']) {
          toolbar.addClass('enable-hr')
        }

        // 代码块复制
        if (codeConfig['enable_code_copy']) {
          customItem.append('<i class="fas fa-paste code-copy"></i>');

          customItem.find('.code-copy').on('click', function (e) {
            const text = pre.children("code[class*='language-']").text();
            const clipboard = new Clipboard(this, {text: () => text});

            clipboard.on('success', () => {
              console.log("已复制"); // todo msg 提示插件未编写 
              alert("已复制");
              clipboard.destroy();
            });

            clipboard.on('error', () => {
              clipboard.destroy()
            })

            clipboard.onClick(e);
          })
        }

        // 代码块展开
        if (codeConfig['enable_code_expander']) {
          customItem.append('<i class="fa-sharp fa-solid fa-caret-down code-expander"></i>');

          customItem.find('.code-expander').on('click', function () {
            pre.children('code').toggle();
            toolbar.toggleClass('enable-expander');
          })
        }

      }

    })

  }


}
