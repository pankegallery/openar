import React, {
  useState,
  MouseEventHandler,
  FormEvent,
  useEffect,
} from "react";
import {
  Box,
  IconButton,
  HStack,
  Portal,
  Badge,
  FormControl,
  VisuallyHidden,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEditor, EditorContent, Editor, Content } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Link from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";

import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";

import {
  RiTextWrap,
  RiLink,
  RiLinkUnlink,
  RiFormatClear,
  RiBold,
  RiItalic,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiCheckFill,
  RiCloseFill,
} from "@hacknug/react-icons/ri";

// import Blockquote, { BlockquoteOptions } from "@tiptap/extension-blockquote";
// import BulletList, { BulletListOptions } from "@tiptap/extension-bullet-list";
// import Heading, { HeadingOptions } from "@tiptap/extension-heading";
// import ListItem, { ListItemOptions } from "@tiptap/extension-list-item";
// import OrderedList, {
//   OrderedListOptions,
// } from "@tiptap/extension-ordered-list";

export type TextEditorTypes = "full" | "basic";

const EditorMenuBarButton = ({
  icon,
  isFlashing,
  label,
  isActive,
  isDisabled,

  onClick,
}: {
  icon: React.ReactElement;
  label: string;
  isFlashing?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;

  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <IconButton
    variant="outline"
    size="sm"
    border="0"
    bg="transparent"
    color="white"
    fontSize="xl"
    p="1"
    icon={icon}
    aria-label={label}
    title={label}
    onClick={onClick}
    isActive={isActive}
    isDisabled={isDisabled}
    _hover={{
      color: "gray.300"
    }}
    _focus={{
      outline: "none"
    }}
    _active={{
      bg: "none"
    }}
    sx={
      isFlashing
        ? {
            color: "var(--chakra-colors-red-500) !important",
          }
        : {}
    }
  >
    {label}
  </IconButton>
);

const EditorMenuBarSeparator = () => (
  <Box h="20px" w="1px" bg="gray.300" mx="5" />
);

const EditorMenuBar = ({
  editor,
  type,
  name,
  editorIsFocussed,
}: {
  editor: Editor;
  type: TextEditorTypes;
  name: string;
  editorIsFocussed: boolean;
}) => {
  const [showLinkEditScreen, setShowLinkEditScreen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorIsFocussed && showLinkEditScreen) {
      setShowLinkEditScreen(false);
    } else if (showLinkEditScreen) {
      if (inputRef?.current) inputRef?.current.focus();
    }
  }, [editorIsFocussed, showLinkEditScreen]);

  const save = "Save";
  const cancel = "Cancel";
  const linkFieldId = `${name}_link_url`;

  const onLinkFormSubmit = (event?: FormEvent) => {
    if (event) event.preventDefault();

    if (linkValue.length < 2) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkValue })
        .run();
    }

    setShowLinkEditScreen(false);
    return false;
  };
  return (
    <>
      {showLinkEditScreen && (
        <HStack className="menu-bar" spacing="1" height="42">
          <FormControl id={linkFieldId} isRequired={true}>
            <VisuallyHidden>
              <FormLabel htmlFor={linkFieldId} mb="0.5">
                Url
              </FormLabel>
            </VisuallyHidden>
            <Input
              defaultValue={linkValue}
              variant="unstyled"
              placeholder="https://..."
              name={linkFieldId}
              id={linkFieldId}
              pl="1"
              ref={inputRef}
              onChange={(event) => setLinkValue(event?.target?.value ?? "")}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onLinkFormSubmit();
                }
              }}
            />
          </FormControl>

          <EditorMenuBarButton
            icon={<RiCloseFill />}
            label={cancel}
            onClick={() => setShowLinkEditScreen(false)}
          />
          <EditorMenuBarButton
            icon={<RiCheckFill />}
            label={save}
            onClick={() => {
              onLinkFormSubmit();
            }}
          />
        </HStack>
      )}
      {!showLinkEditScreen && (
        <HStack className="menu-bar" spacing="1" height="42">
          <EditorMenuBarButton
            icon={<RiBold />}
            label={
              editor.isActive("bold")
                ? "Remove bold text format"
                : "Format text bold"
            }
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <EditorMenuBarButton
            icon={<RiItalic />}
            label={
              editor.isActive("italic")
                ? "Remove italic text format"
                : "Format text italic"
            }
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <EditorMenuBarSeparator />

          <EditorMenuBarButton
            icon={<RiTextWrap />}
            label="Add a new line"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          />

          <EditorMenuBarButton
            icon={<RiFormatClear />}
            label="Clear Formatting"
            onClick={() => {
              editor.chain().focus().clearNodes().run();
              editor.chain().focus().unsetAllMarks().run();
            }}
          />
          <EditorMenuBarSeparator />
          <EditorMenuBarButton
            icon={<RiArrowGoBackLine />}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          />
          <EditorMenuBarButton
            icon={<RiArrowGoForwardLine />}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          />
          <EditorMenuBarSeparator />
          <EditorMenuBarButton
            icon={<RiLink />}
            isDisabled={
              editor.view.state.selection.empty && !editor.isActive("link")
            }
            label="Add link"
            onClick={(event) => {
              setLinkValue(editor.getAttributes("link")?.href ?? "");

              setShowLinkEditScreen(true);
            }}
            isActive={editor.isActive("link")}
          />

          {editor.isActive("link") && (
            <EditorMenuBarButton
              icon={<RiLinkUnlink />}
              label="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            />
          )}
        </HStack>
      )}

      {/* <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </Button>
      

      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </Button>
      
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </Button>
      
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
  </Button> */}
    </>
  );
};

export const TextEditor = ({
  name,
  type,
  placeholder,
  onChange,
  content,
  contentType = "html",
  maxLength,
  isInvalid,
}: {
  name: string;
  type: TextEditorTypes;
  onChange: (content: string | Record<string, any>) => void;
  content: Content;
  contentType?: "html" | "json";
  placeholder?: string;
  maxLength?: number;
  isInvalid?: boolean;
}) => {
  const [isFocussed, setIsFocussed] = useState(false);
  const extensions = [];
  extensions.push(Document, Text, Paragraph);
  extensions.push(Dropcursor, Gapcursor);
  extensions.push(Bold, Italic);
  extensions.push(History);
  extensions.push(
    Link.configure({
      openOnClick: false,
    })
  );
  extensions.push(HardBreak);

  if (placeholder) extensions.push(Placeholder.configure({ placeholder }));

  const editor = useEditor({
    editable: true,
    extensions,
    content,
    // triggered on every change
    onUpdate({ editor }) {
      if (contentType === "html") onChange.call(null, editor.getHTML());

      if (contentType === "json") onChange.call(null, editor.getJSON());
    },
    onFocus() {
      setIsFocussed(true);
    },
    onBlur() {
      setIsFocussed(false);
    },
  });

  if (!editor) return <></>;

  return (
    <Box
      className={`editor ${type} ${isFocussed ? "is-focussed" : ""} ${
        maxLength && maxLength > 0 ? "has-char-count" : ""
      } ${isInvalid ? "is-error" : ""}`}
    >
      <EditorMenuBar
        {...{ type, editor, name, editorIsFocussed: isFocussed }}
      />
      <Box className="wrapper">
        <EditorContent editor={editor} />
      </Box>
      {maxLength && maxLength > 0 && editor && (
        <Box className="char-count">
          <Badge
            variant="subtle"
            colorScheme={
              editor.getCharacterCount() > maxLength ? "red" : "green"
            }
          >
            {editor.getCharacterCount()}/{maxLength} characters
          </Badge>
        </Box>
      )}

      <Portal>
        <form></form>
      </Portal>
    </Box>
  );
};
