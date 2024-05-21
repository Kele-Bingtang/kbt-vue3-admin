<template>
  <component :is="tag" ref="editorRef" :class="prefixClass">
    <aside v-if="$slots.default" style="display: none" aria-hidden><slot /></aside>
  </component>
</template>

<script setup lang="ts">
import { indentWithTab } from "@codemirror/commands";
import { indentUnit as indentUnitConfig, type LanguageSupport } from "@codemirror/language";
import {
  diagnosticCount as linterDagnosticCount,
  forceLinting as forceLintingFun,
  linter as linterFun,
  lintGutter,
  type Diagnostic,
  type LintSource,
} from "@codemirror/lint";
import {
  Compartment,
  EditorSelection,
  EditorState,
  StateEffect,
  type Transaction,
  type Extension,
  type SelectionRange,
  type StateField,
  type Text,
} from "@codemirror/state";
import { EditorView, keymap, placeholder as placeholderFun, type ViewUpdate } from "@codemirror/view";
import { basicSetup, minimalSetup } from "codemirror";
import { useDesign } from "@/hooks";
import { getPx } from "@/utils";

defineOptions({ name: "CodeMirror6" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("code-mirror");

interface CodeMirrorProps {
  width?: string | number; // 代码编辑器宽度，默认 auto
  height?: string | number; // 代码编辑器高度，默认 400
  fontSize?: string | number; // 字体大小，默认 14px
  localTheme?: Extension; // 本地主题包
  lang?: LanguageSupport; // 本地代码语言包
  basic?: boolean; // 是否导入代码编辑器常用功能，See https://codemirror.net/docs/ref/#codemirror.basicSetup
  minimal?: boolean; // 是否导入代码编辑器 Mini 功能，See https://codemirror.net/docs/ref/#codemirror.minimalSetup
  dark?: boolean; // 是否切换为暗黑主题（前提是主题切换），默认不切换 false
  placeholder?: string; // 代码编辑器占位符
  wrap?: boolean; // 内容宽度超出屏幕后，是否开启自动换行，默认开启 true
  tab?: boolean; // 是否启用 Tab 键缩进，默认开启 true
  tabSize?: number; // Tab 键缩进单位，默认 2
  multiple?: boolean; // 是否开启允许多选，默认不开启 false，See https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections
  lineSeparator?: string; // 换行符，默认 '\n'
  customTheme?: Record<string, any>; // 自定义主题，See https://codemirror.net/docs/ref/#view.EditorView^theme
  readonly?: boolean; // 是否只读代码编辑器，默认不开启 false
  disabled?: boolean; // 是否禁用代码编辑器，默认不开启 false
  phrases?: Record<string, string>; // 自定义代码编辑器的国际化语言内容，See https://codemirror.net/6/examples/translate/
  linter?: LintSource | any; // 代码校验器，See https://codemirror.net/docs/ref/#lint.linter
  linterConfig?: Record<string, any>; // See https://codemirror.net/docs/ref/#lint.linter^config
  forceLinting?: boolean; // 是否在输入过程开始校验语法，false 则在输入完成后校验，默认不开启 false
  gutter?: boolean; // 当代码语法出错，开头是否红色圆圈 🔴 提示，前提开启 linter 属性，默认不开启 false
  gutterConfig?: Record<string, any>; // See https://codemirror.net/docs/ref/#lint.lintGutter^config
  tag?: string; // 代码编辑器跟标签，默认是 div
  indentUnit?: string; // 缩进单位，如 "  "，缩进两个空格，"    " 代表缩进四个空格
  extensions?: Extension[]; // 额外扩展
}

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  width: "auto",
  height: 400,
  fontSize: 14,
  basic: true,
  minimal: false,
  wrap: true,
  tab: true,
  multiple: false,
  readonly: false,
  disabled: false,
  extensions: () => [],
  customTheme: () => ({}),
  linterConfig: () => defaultPhrases,
  forceLinting: false,
  gutter: false,
  tag: "div",
});

type CodeMirror6Emits = {
  update: [_value: ViewUpdate];
  /** CodeMirror onReady */
  ready: [_value: { view: EditorView; state: EditorState; container: HTMLElement }];
  /** CodeMirror onFocus */
  focus: [_value: boolean];
  /** State Changed */
  change: [_value: EditorState];
  /** CodeMirror onDestroy */
  destroy: [];
};

const emits = defineEmits<CodeMirror6Emits>();

// 编辑器 DOM 元素引用
const editorRef = ref<HTMLElement | undefined>();

// v-model
const doc = defineModel<string | Text>({ required: true });

/**
 * CodeMirror 的 EditorEditorView
 *
 * @see {@link https://codemirror.net/docs/ref/#view.EditorView}
 */
const view = shallowRef<EditorView>(new EditorView());

/**
 * 是否获得焦点
 *
 * @see {@link https://codemirror.net/docs/ref/#view.EditorView.hasFocus}
 */
const focus = computed<boolean>({
  get: () => view.value.hasFocus,
  set: f => {
    if (f) {
      view.value.focus();
    }
  },
});

/**
 * 选择范围
 *
 * @see {@link https://codemirror.net/docs/ref/#state.EditorSelection}
 */
const selection = computed<EditorSelection>({
  get: () => view.value.state.selection,
  set: s => view.value.dispatch({ selection: s }),
});

/** 光标位置 */
const cursor = computed<number>({
  get: () => view.value.state.selection.main.head,
  set: a => view.value.dispatch({ selection: { anchor: a } }),
});

/** JSON */
const json = computed<Record<string, StateField<any>>>({
  get: () => view.value.state.toJSON(),
  set: j => view.value.setState(EditorState.fromJSON(j)),
});

/** 文本长度 */
const length: Ref<number> = ref(0);

/**
 * 语法检查的诊断代码数量
 *
 * @see {@link https://codemirror.net/docs/ref/#lint.diagnosticCount}
 */
const diagnosticCount: Ref<number> = ref(0);

/** 获取 CodeMirror 的扩展 */
const extensions: ComputedRef<Extension[]> = computed(() => {
  // 配置
  // @see https://codemirror.net/examples/config/
  const language = new Compartment();
  const tabSize = new Compartment();

  return [
    // 切换基本设置
    props.basic ? basicSetup : undefined,
    // 切换最小设置
    props.minimal && !props.basic ? minimalSetup : undefined,
    // 添加监听器
    EditorView.updateListener.of((update: ViewUpdate): void => {
      // 触发焦点事件
      emits("focus", view.value.hasFocus);

      // 更新文本长度
      length.value = view.value.state.doc?.length;

      if (update.changes.empty || !update.docChanged) {
        // 如果没有更改，则不触发
        return;
      }
      if (props.linter) {
        // 代码校验处理
        if (props.forceLinting) {
          // 如果 forceLinting 开启，第一次加载视图后校验。
          forceLintingFun(view.value);
        }
        // 计算诊断数量
        diagnosticCount.value = (props.linter(view.value) as readonly Diagnostic[]).length;
      }
      emits("update", update);
    }),
    // 切换浅色/深色模式
    EditorView.theme(props.customTheme, { dark: props.dark }),
    props.localTheme ? props.localTheme : undefined,
    // 开启行宽换行
    props.wrap ? EditorView.lineWrapping : undefined,
    // 启用 Tab 键缩进
    props.tab ? keymap.of([indentWithTab]) : undefined,
    // Tab 键缩进单位
    props.indentUnit ? indentUnitConfig.of(props.indentUnit) : undefined,
    // 允许多选
    EditorState.allowMultipleSelections.of(props.multiple),
    // Tab 键缩进大小
    props.tabSize ? tabSize.of(EditorState.tabSize.of(props.tabSize)) : undefined,
    // 国际化设置
    props.phrases ? EditorState.phrases.of(props.phrases) : undefined,
    // 编辑器只读
    EditorState.readOnly.of(props.readonly),
    // 编辑器可编辑
    EditorView.editable.of(!props.disabled),
    // // 设置换行字符
    props.lineSeparator ? EditorState.lineSeparator.of(props.lineSeparator) : undefined,
    // 代码语言
    props.lang ? language.of(props.lang) : undefined,
    // 添加代码校验器
    props.linter ? linterFun(props.linter, props.linterConfig) : undefined,
    // 显示错误行的红色圆圈 🔴 提示
    props.linter && props.gutter ? lintGutter(props.gutterConfig) : undefined,
    // 编辑器占位符
    props.placeholder ? placeholderFun(props.placeholder) : undefined,
    // 添加 props 自定义扩展
    ...(props.extensions || []),
  ].filter((extension): extension is Extension => !!extension);
});

// 监听 extensions（主要是属性）变化
watch(
  extensions,
  exts => {
    view.value?.dispatch({
      effects: StateEffect.reconfigure.of(exts),
    });
  },
  { immediate: true }
);

// 监听文字输入变化
watch(
  doc,
  async value => {
    if (
      view.value.composing || // IME 修复
      view.value.state.doc.toJSON().join(props.lineSeparator ?? "\n") === value // don't need to update
    ) {
      // 不要提交 CodeMirror 的存储。
      return;
    }

    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.length, insert: value },
      selection: view.value.state.selection,
      scrollIntoView: true,
    });
  },
  { immediate: true }
);

onMounted(async () => {
  /** 初始化 Value */
  let value: string | Text = doc.value;
  if (!editorRef.value) return;
  if (editorRef.value.children[0]) {
    if (doc.value !== "") {
      console.warn(
        "[CodeMirror.vue] The <code-mirror> tag contains child elements that overwrite the `v-model` values."
      );
    }
    value = (editorRef.value.childNodes[0] as HTMLElement).innerText?.trim();
  }

  // 注册 Codemirror
  view.value = new EditorView({
    parent: editorRef.value,
    state: EditorState.create({ doc: value, extensions: extensions.value }),
    dispatch: (tr: Transaction) => {
      view.value.update([tr]);
      if (tr.changes.empty || !tr.docChanged) {
        return;
      }

      doc.value = tr.state.doc.toString() ?? "";
      emits("change", tr.state);
    },
  });

  await nextTick();

  emits("ready", {
    view: view.value,
    state: view.value.state,
    container: editorRef.value,
  });
});

onUnmounted(() => {
  view.value.destroy();
  emits("destroy");
});

/**
 * 手动触发语法检查
 *
 * @see {@link https://codemirror.net/docs/ref/#lint.forceLinting}
 */
const lint = (): void => {
  if (!props.linter || !view.value) return;
  if (props.forceLinting) forceLintingFun(view.value);
  diagnosticCount.value = linterDagnosticCount(view.value.state);
};

/**
 * 手动使配置重新生效
 *
 * @see {@link https://codemirror.net/examples/config/#top-level-reconfiguration}
 */
const forceReconfigure = (): void => {
  // 先清除配置
  view.value?.dispatch({
    effects: StateEffect.reconfigure.of([]),
  });
  // 重新注册配置
  view.value?.dispatch({
    effects: StateEffect.appendConfig.of(extensions.value),
  });
};

/* ----- 实验性 ------ */

/**
 * 在编辑器中获取给定点之间的文本（下标位置而不是行号）
 *
 * @param from - 开始位置
 * @param to - 结束位置
 */
const getRange = (from?: number, to?: number): string | undefined => view.value.state.sliceDoc(from, to);
/**
 * 获取指定行文本
 *
 * @param number - 行号
 */
const getLineText = (number: number): string => view.value.state.doc.line(number + 1).text;
/** 获取行数 */
const lineCount = (): number => view.value.state.doc.lines;
/** 获取光标所在的下标位置 */
const getCursor = (): number => view.value.state.selection.main.head;
/** 获取所有当前选择的内容相关信息对象 */
const listSelections = (): readonly SelectionRange[] => {
  let _view$value$state$sel;
  return (_view$value$state$sel = view.value.state.selection.ranges) !== null && _view$value$state$sel !== undefined
    ? _view$value$state$sel
    : [];
};
/** 获取当前选择的内容 */
const getSelection = (): string => {
  let _view$value$state$sli;
  return (_view$value$state$sli = view.value.state.sliceDoc(
    view.value.state.selection.main.from,
    view.value.state.selection.main.to
  )) !== null && _view$value$state$sli !== undefined
    ? _view$value$state$sli
    : "";
};
/**
 * 获取当前选择的多行内容数组，一行占一个数组下标
 */
const getSelections = (): string[] => {
  const s = view.value.state;
  if (!s) {
    return [];
  }

  return s.selection.ranges.map((r: { from: number; to: number }) => s.sliceDoc(r.from, r.to));
};
/** 如果有文本被选中，返回 `true`；否则返回 `false`，检查是否有任何选择范围不为空 */
const somethingSelected = (): boolean => view.value.state.selection.ranges.some((r: { empty: boolean }) => !r.empty);

/**
 * 将文档中从 `from` 位置到 `to` 位置的文本替换为给定的 `replacement` 文本
 *
 * @param replacement - replacement text
 * @param from - start string at position
 * @param to -  insert the string at position
 */
const replaceRange = (replacement: string | Text, from: number, to: number): void =>
  view.value.dispatch({
    changes: { from, to, insert: replacement },
  });
/**
 * 替换当前的选区（或选区）为给定的 `replacement` 文本。默认情况下，新选择会位于插入的文本之后
 *
 * @param replacement - replacement text
 */
const replaceSelection = (replacement: string | Text): void =>
  view.value.dispatch(view.value.state.replaceSelection(replacement));
/**
 * 设置光标位置到指定的 `position`
 *
 * @param position - position.
 */
const setCursor = (position: number): void => view.value.dispatch({ selection: { anchor: position } });
/**
 * 设置单一的选取范围，其中 `anchor` 是锚点位置，`head` 是可选的头部位置。
 *
 * @param anchor - anchor position
 * @param head -
 */
const setSelection = (anchor: number, head?: number): void => view.value.dispatch({ selection: { anchor, head } });
/**
 * 设置新的选取范围数组，至少需要一个选取。`ranges` 是选取范围数组，`primary` 是可选的主选取索引
 *
 * @param ranges - Selection range
 * @param primary -
 */
const setSelections = (ranges: readonly SelectionRange[], primary?: number): void =>
  view.value.dispatch({
    selection: EditorSelection.create(ranges, primary),
  });
/**
 * 应用提供的函数 `f` 到所有现有的选取上，并根据结果调用 `extendSelections` 方法。这允许动态扩展选取范围
 *
 * @param f - function
 */
const extendSelectionsBy = (f: any): void =>
  view.value.dispatch({
    selection: EditorSelection.create(selection.value.ranges.map((r: SelectionRange) => r.extend(f(r)))),
  });

defineExpose({
  editor: editorRef,
  view,
  cursor,
  selection,
  focus,
  length,
  json,
  diagnosticCount,
  dom: view.value.contentDOM,
  lint,
  forceReconfigure,
  // Bellow is CodeMirror5's function
  getRange,
  getLineText,
  lineCount,
  getCursor,
  listSelections,
  getSelection,
  getSelections,
  somethingSelected,
  replaceRange,
  replaceSelection,
  setCursor,
  setSelection,
  setSelections,
  extendSelectionsBy,
});

const codeMirrorWidth = computed(() => getPx(props.width));
const codeMirrorHeight = computed(() => getPx(props.height));
const codeMirrorFontSize = computed(() => getPx(props.fontSize));
</script>

<script lang="ts">
const defaultPhrases = {
  // @codemirror/view
  "Control character": "控制字符",
  // @codemirror/commands
  "Selection deleted": "选择已删除",
  // @codemirror/language
  "Folded lines": "折叠行",
  "Unfolded lines": "展开行",
  to: "到",
  "folded code": "折叠代码",
  unfold: "展开代码",
  "Fold line": "折叠行",
  "Unfold line": "展开行",
  // @codemirror/search
  "Go to line": "跳转到行",
  go: "OK",
  Find: "查找",
  Replace: "替换",
  next: "下一个",
  previous: "上一个",
  all: "全部",
  "match case": "匹配条件",
  "by word": "全文检索",
  regexp: "正则表达式",
  replace: "替换",
  "replace all": "替换全部",
  close: "关闭",
  "current match": "当前匹配",
  "replaced $ matches": "替换 $ 命中",
  "replaced match on line $": "替换 $ 行匹配",
  "on line": "在线",
  // @codemirror/autocomplete
  Completions: "自动补全",
  // @codemirror/lint
  Diagnostics: "诊断",
  "No diagnostics": "无诊断",
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-code-mirror;

.#{$prefix-class} {
  width: v-bind(codeMirrorWidth);
  height: v-bind(codeMirrorHeight);
  font-size: v-bind(codeMirrorFontSize);

  // CodeMirror 实际高度
  :deep(.cm-editor) {
    height: 100%;
  }
}
</style>
