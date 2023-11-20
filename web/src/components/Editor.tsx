"use client";

import {
  ArticleEdit,
  PostArticleParams,
  postArticle,
  putArticle,
} from "@requests/articles";
import { Options } from "easymde";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

type EditorType = {
  article: ArticleEdit | null;
  slug: string | null;
};

const acceptFileTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

export default function Editor({ article, slug }: EditorType) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState(article?.bodyMarkdown ?? "");
  const onChange = useCallback((value: string) => {
    setBodyMarkdown(value);
  }, []);

  const formParams: PostArticleParams = useMemo(
    () => ({
      title,
      bodyMarkdown,
    }),
    [title, bodyMarkdown]
  );

  const handleSubmit = async () => {
    if (slug) {
      await putArticle({ article: formParams, slug });
      router.replace(`/articles/${slug}`);
    } else {
      const data = await postArticle(formParams);
      router.replace(`/articles/${data.article.slug}`);
    }
  };
  const mdeOptions: Options = useMemo(() => {
    return {
      uploadImage: true, // 画像をUL可能に
      spellChecker: false, // スペルチェックをオフに
      tabSize: 8,
      syncSideBySidePreviewScroll: false, // 横並びプレビューは使わない
      autoDownloadFontAwesome: false, // FontAwesomeを使わない
      placeholder: "Write in Markdown", // placeholder
      toolbar: false, // ツールバーを無効に
      toolbarTips: false, // ツールバーを無効に
      status: false, // スタータスバーを非表示に
      insertTexts: {
        image: ["![](https://", ")\n"],
      },
      shortcuts: {
        drawImage: null,
        toggleHeadingBigger: null,
        toggleSideBySide: null,
        toggleFullScreen: null,
        togglePreview: null, // 自作のプレビューを用いるためこっちはオフ
        toggleItalic: null, // insertパネルを使うためこっちはオフ
      },
      previewRender: undefined, // SimpleMDEのプレビューは使わない
      autofocus: false, // タイトルがすでに書かれている場合はエディターにフォーカス
      //   imageUploadFunction: mdeImageUploadFunction,
      //   previewClass: styles.easymdeHiddenPreview, // SimpleMDEのプレビューは使わない
      imageAccept: acceptFileTypes.join(", "), // デフォルトではPNGとJPEGしか許容されていないため修正（ここに指定されていない形式だとリンクとして挿入されてしまう）
    };
    // 上述のコメントの理由により、マウント時に一度だけ実行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="w-full">
        <input
          className="text-2xl appearance-none block w-full bg-inherit text-gray-100 rounded leading-tight focus:outline-none focus:bg-inherit focus:border-inherit"
          id="grid-first-name"
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="w-full text-gray-100 bg-gray-600 p-8 rounded [&_.EasyMDEContainer_.CodeMirror]:bg-gray-600 [&_.EasyMDEContainer_.CodeMirror]:border-none [&_.EasyMDEContainer_.CodeMirror-placeholder]:text-gray-100 [&_.EasyMDEContainer_.CodeMirror]:text-gray-100">
        <SimpleMDE
          onChange={onChange}
          value={bodyMarkdown}
          options={mdeOptions}
        />
      </div>
      <div className="w-full flex justify-center">
        <button
          disabled={!title || !bodyMarkdown}
          onClick={handleSubmit}
          className="w-2/4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {slug ? "更新する" : "作成する"}
        </button>
      </div>
    </div>
  );
}
